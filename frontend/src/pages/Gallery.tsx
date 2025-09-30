import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await api.getArtworks();
        setArtworks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Gallery</h1>

        {artworks.length === 0 ? (
          <p className="text-lg text-muted-foreground">No artworks available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <Card
                key={artwork.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/artwork/${artwork.id}`)}
              >
                {artwork.imageUrl && (
                  <div className="aspect-square overflow-hidden rounded-t-xl">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{artwork.title}</CardTitle>
                  <CardDescription>
                    {artwork.year} • {artwork.medium}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{artwork.description}</p>
                  {artwork.status === 'sold' && (
                    <p className="text-sm text-destructive mt-2 font-medium">Sold</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}