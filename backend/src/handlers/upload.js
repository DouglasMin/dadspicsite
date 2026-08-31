import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { success, badRequest, internalError } from '../utils/response.js';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-northeast-2' });
const IMAGES_BUCKET = process.env.IMAGES_BUCKET_NAME;
const ALLOWED_FOLDERS = ['artworks', 'exhibitions'];

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  if (event.httpMethod !== 'POST') {
    return badRequest('Only POST method is supported');
  }

  try {
    const { fileName, fileType, fileSize, folder } = JSON.parse(event.body);

    if (!fileName || !fileType) {
      return badRequest('fileName and fileType are required');
    }

    // Restrict the destination prefix to a known set (no caller-controlled paths)
    const targetFolder = folder || 'artworks';
    if (!ALLOWED_FOLDERS.includes(targetFolder)) {
      return badRequest(`Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}`);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return badRequest('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (fileSize && fileSize > maxSize) {
      return badRequest('File size exceeds 10MB limit');
    }

    // Generate unique file name
    const fileExtension = getFileExtension(fileType);
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    const key = `${targetFolder}/${uniqueFileName}`;

    // Create presigned URL for PUT operation
    const command = new PutObjectCommand({
      Bucket: IMAGES_BUCKET,
      Key: key,
      ContentType: fileType,
      // Optional: Add metadata
      Metadata: {
        'original-name': fileName,
        'uploaded-at': new Date().toISOString()
      }
    });

    // Generate presigned URL (expires in 5 minutes)
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // The final URL where the image will be accessible
    const imageUrl = `https://${IMAGES_BUCKET}.s3.${process.env.AWS_REGION || 'ap-northeast-2'}.amazonaws.com/${key}`;

    return success({
      presignedUrl,
      imageUrl,
      key
    });
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return internalError(error.message);
  }
};

function getFileExtension(contentType) {
  switch (contentType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

