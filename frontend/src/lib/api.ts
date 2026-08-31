const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fffw8q7fo1.execute-api.ap-northeast-2.amazonaws.com/dev';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  year: number;
  medium: string;
  dimensions: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  relatedLink?: string;
  photoUrls?: string[];
  artworkIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type UploadFolder = 'artworks' | 'exhibitions';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Handle empty responses (like DELETE)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return {} as T;
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string }> {
    return this.request('/health');
  }

  // Artworks
  async getArtworks(): Promise<Artwork[]> {
    return this.request('/artworks');
  }

  async getArtwork(id: string): Promise<Artwork> {
    return this.request(`/artworks/${id}`);
  }

  async createArtwork(artwork: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artwork> {
    return this.request('/artworks', {
      method: 'POST',
      body: JSON.stringify(artwork),
    });
  }

  async updateArtwork(id: string, artwork: Partial<Artwork>): Promise<Artwork> {
    return this.request(`/artworks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artwork),
    });
  }

  async deleteArtwork(id: string): Promise<void> {
    return this.request(`/artworks/${id}`, {
      method: 'DELETE',
    });
  }

  // Exhibitions
  async getExhibitions(): Promise<Exhibition[]> {
    return this.request('/exhibitions');
  }

  async getExhibition(id: string): Promise<Exhibition> {
    return this.request(`/exhibitions/${id}`);
  }

  async createExhibition(exhibition: Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exhibition> {
    return this.request('/exhibitions', {
      method: 'POST',
      body: JSON.stringify(exhibition),
    });
  }

  async updateExhibition(id: string, exhibition: Partial<Exhibition>): Promise<Exhibition> {
    return this.request(`/exhibitions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exhibition),
    });
  }

  async deleteExhibition(id: string): Promise<void> {
    return this.request(`/exhibitions/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact form
  async submitContact(data: ContactFormData): Promise<{ message: string }> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get presigned URL for image upload
  async getPresignedUrl(fileName: string, fileType: string, fileSize: number, folder?: UploadFolder): Promise<{ presignedUrl: string; imageUrl: string; key: string }> {
    return this.request('/upload', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileType, fileSize, folder }),
    });
  }

  // Upload image directly to S3 using presigned URL
  async uploadImageToS3(presignedUrl: string, file: File): Promise<void> {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
    }
  }

  // Search locations (place names and addresses)
  async searchLocations(query: string): Promise<any[]> {
    return this.request<any[]>(`/locations/search?q=${encodeURIComponent(query)}`);
  }

  // Complete image upload process
  async uploadImage(file: File, folder?: UploadFolder): Promise<{ imageUrl: string }> {
    // Step 1: Get presigned URL
    const { presignedUrl, imageUrl } = await this.getPresignedUrl(
      file.name,
      file.type,
      file.size,
      folder
    );

    // Step 2: Upload directly to S3
    await this.uploadImageToS3(presignedUrl, file);

    // Step 3: Return the final image URL
    return { imageUrl };
  }
}

export const api = new ApiClient(API_BASE_URL);