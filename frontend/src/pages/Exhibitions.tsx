import { useEffect, useState } from 'react';
import { api, type Exhibition } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await api.getExhibitions();
        // Sort by start date (newest first)
        const sorted = data.sort((a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setExhibitions(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exhibitions');
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const isUpcoming = (startDate: string) => new Date(startDate) > new Date();
  const isOngoing = (startDate: string, endDate: string) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Loading exhibitions...</p>
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
        <h1 className="text-4xl font-bold mb-8">Exhibitions</h1>

        {exhibitions.length === 0 ? (
          <p className="text-lg text-muted-foreground">No exhibitions scheduled yet.</p>
        ) : (
          <div className="space-y-6">
            {exhibitions.map((exhibition) => {
              const upcoming = isUpcoming(exhibition.startDate);
              const ongoing = isOngoing(exhibition.startDate, exhibition.endDate);

              return (
                <Card key={exhibition.id}>
                  <div className="grid lg:grid-cols-[300px_1fr] gap-6">
                    {exhibition.imageUrl && (
                      <div className="aspect-video lg:aspect-square overflow-hidden rounded-l-xl">
                        <img
                          src={exhibition.imageUrl}
                          alt={exhibition.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {ongoing && (
                            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
                              Now Showing
                            </span>
                          )}
                          {upcoming && (
                            <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-2xl">{exhibition.title}</CardTitle>
                        <CardDescription>
                          {new Date(exhibition.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {' - '}
                          {new Date(exhibition.endDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">{exhibition.location}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">{exhibition.description}</p>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}