import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;

      try {
        const data = await api.getArtwork(id);
        setArtwork(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Loading artwork...</p>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-destructive">Error: {error || 'Artwork not found'}</p>
        <Button className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          ← Back to Gallery
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-xl border">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{artwork.title}</h1>
            <div className="space-y-4 mb-8">
              <p className="text-lg text-muted-foreground">
                {artwork.year} • {artwork.medium}
              </p>
              <p className="text-muted-foreground">{artwork.dimensions}</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{artwork.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">
                    {artwork.status === 'not_for_sale' ? 'Not for Sale' : artwork.status}
                  </span>
                </div>
                {artwork.price && artwork.status === 'available' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">${artwork.price.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {artwork.status === 'available' && (
              <Button size="lg" className="w-full mt-6" onClick={() => window.location.href = '/contact'}>
                Inquire About This Artwork
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}