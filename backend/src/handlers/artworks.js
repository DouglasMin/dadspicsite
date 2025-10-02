import { randomUUID } from 'crypto';
import { dynamodb } from '../utils/dynamodb.js';
import { success, created, noContent, badRequest, notFound, internalError } from '../utils/response.js';

const ARTWORKS_TABLE = process.env.ARTWORKS_TABLE_NAME;

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod, pathParameters, body } = event;
  const id = pathParameters?.id;

  try {
    switch (httpMethod) {
      case 'GET':
        if (id) {
          return await getArtwork(id);
        }
        return await listArtworks();

      case 'POST':
        return await createArtwork(body);

      case 'PUT':
        if (!id) return badRequest('Artwork ID is required!');
        return await updateArtwork(id, body);

      case 'DELETE':
        if (!id) return badRequest('Artwork ID is required!');
        return await deleteArtwork(id);

      default:
        return badRequest('Unsupported HTTP method');
    }
  } catch (error) {
    console.error('Error:', error);
    return internalError(error.message);
  }
};

async function listArtworks() {
  const artworks = await dynamodb.scan(ARTWORKS_TABLE);
  return success(artworks);
}

async function getArtwork(id) {
  const artwork = await dynamodb.get(ARTWORKS_TABLE, { id });

  if (!artwork) {
    return notFound('Artwork not found');
  }

  return success(artwork);
}

async function createArtwork(bodyString) {
  const data = JSON.parse(bodyString);

  // Validate required fields
  if (!data.title || !data.description || !data.year || !data.medium || !data.dimensions) {
    return badRequest('Missing required fields: title, description, year, medium, dimensions');
  }

  const now = new Date().toISOString();
  const artwork = {
    id: randomUUID(),
    title: data.title,
    description: data.description,
    year: data.year,
    medium: data.medium,
    dimensions: data.dimensions,
    imageUrl: data.imageUrl || '',
    createdAt: now,
    updatedAt: now,
  };

  await dynamodb.put(ARTWORKS_TABLE, artwork);
  return created(artwork);
}

async function updateArtwork(id, bodyString) {
  const data = JSON.parse(bodyString);

  // Check if artwork exists
  const existing = await dynamodb.get(ARTWORKS_TABLE, { id });
  if (!existing) {
    return notFound('Artwork not found');
  }

  // Build updates object
  const updates = {
    updatedAt: new Date().toISOString(),
  };

  const allowedFields = ['title', 'description', 'year', 'medium', 'dimensions', 'imageUrl'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const updated = await dynamodb.update(ARTWORKS_TABLE, { id }, updates);
  return success(updated);
}

async function deleteArtwork(id) {
  // Check if artwork exists
  const existing = await dynamodb.get(ARTWORKS_TABLE, { id });
  if (!existing) {
    return notFound('Artwork not found');
  }

  await dynamodb.delete(ARTWORKS_TABLE, { id });
  return noContent();
}