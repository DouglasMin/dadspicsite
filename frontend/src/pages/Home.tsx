import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to YH  Art Lab</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore a curated collection of contemporary artworks. Scan QR codes at our exhibitions
          to learn more about each piece.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/gallery')}>
            View Gallery
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/exhibitions')}>
            Current Exhibitions
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Access</CardTitle>
                <CardDescription>
                  Scan artwork QR codes to view detailed information instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exhibitions</CardTitle>
                <CardDescription>
                  Discover current and upcoming exhibitions with dates and locations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Contact us for inquiries, purchases, or exhibition information
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}