import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { success, badRequest, internalError } from '../utils/response.js';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-northeast-2' });
const IMAGES_BUCKET = process.env.IMAGES_BUCKET_NAME;

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  if (event.httpMethod !== 'POST') {
    return badRequest('Only POST method is supported');
  }

  try {
    // Parse multipart/form-data
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return badRequest('Content-Type must be multipart/form-data');
    }

    // Extract boundary from content-type
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      return badRequest('Missing boundary in Content-Type');
    }

    // Parse the body (base64 encoded in API Gateway)
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body);

    // Parse multipart data
    const parts = parseMultipart(body, boundary);
    const filePart = parts.find((part) => part.filename);

    if (!filePart) {
      return badRequest('No file found in request');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(filePart.contentType)) {
      return badRequest('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (filePart.data.length > maxSize) {
      return badRequest('File size exceeds 5MB limit');
    }

    // Generate unique filename
    const fileExtension = filePart.filename.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const key = `uploads/${fileName}`;

    // Upload to S3
    const uploadParams = {
      Bucket: IMAGES_BUCKET,
      Key: key,
      Body: filePart.data,
      ContentType: filePart.contentType,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Return the S3 URL
    const imageUrl = `https://${IMAGES_BUCKET}.s3.ap-northeast-2.amazonaws.com/${key}`;

    return success({ imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return internalError(error.message);
  }
};

function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let position = 0;

  while (position < buffer.length) {
    // Find next boundary
    const boundaryIndex = buffer.indexOf(boundaryBuffer, position);
    if (boundaryIndex === -1) break;

    position = boundaryIndex + boundaryBuffer.length;

    // Skip CRLF after boundary
    if (buffer[position] === 0x0d && buffer[position + 1] === 0x0a) {
      position += 2;
    }

    // Check for end boundary
    if (buffer[position] === 0x2d && buffer[position + 1] === 0x2d) {
      break;
    }

    // Find end of headers (double CRLF)
    const headersEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), position);
    if (headersEnd === -1) break;

    // Parse headers
    const headersBuffer = buffer.slice(position, headersEnd);
    const headers = headersBuffer.toString('utf-8');
    const contentDisposition = headers.match(/Content-Disposition: ([^\r\n]+)/i)?.[1];
    const contentType = headers.match(/Content-Type: ([^\r\n]+)/i)?.[1];

    const filename = contentDisposition?.match(/filename="([^"]+)"/)?.[1];
    const name = contentDisposition?.match(/name="([^"]+)"/)?.[1];

    position = headersEnd + 4;

    // Find next boundary
    const nextBoundary = buffer.indexOf(boundaryBuffer, position);
    if (nextBoundary === -1) break;

    // Extract data (remove trailing CRLF)
    let dataEnd = nextBoundary;
    if (buffer[dataEnd - 2] === 0x0d && buffer[dataEnd - 1] === 0x0a) {
      dataEnd -= 2;
    }

    const data = buffer.slice(position, dataEnd);

    parts.push({
      name,
      filename,
      contentType: contentType || 'application/octet-stream',
      data,
    });

    position = nextBoundary;
  }

  return parts;
}