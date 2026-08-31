import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ArtworkPlate } from '@/components/ArtworkCard';
import { Reveal } from '@/components/Reveal';

export function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  const fromPage = searchParams.get('fromPage');
  const handleBackToGallery = () => {
    if (id) {
      // fromPage가 있으면 함께 전달, 없으면 작품 ID만 전달 (Gallery에서 페이지를 찾음)
      if (fromPage) {
        navigate(`/gallery?page=${fromPage}&returnToArtworkId=${id}`);
      } else {
        navigate(`/gallery?returnToArtworkId=${id}`);
      }
    } else {
      navigate('/gallery');
    }
  };

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;

      try {
        const data = await api.getArtwork(id);
        setArtwork(data);
      } catch (err) {
        console.error('작품을 불러오는데 실패했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="shell py-32 text-center">
        <Loader2 className="mx-auto mb-5 size-8 animate-spin text-ink-faint" />
        <p className="text-meta tracking-wide text-ink-soft">작품을 불러오는 중...</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="shell py-32 text-center">
        <p className="font-serif text-h2 mb-8 font-normal text-ink">작품을 찾을 수 없습니다</p>
        <Button
          variant="outline"
          onClick={handleBackToGallery}
          className="pressable text-meta rounded-none border-ink font-normal"
        >
          <ArrowLeft className="size-4" />
          갤러리로 돌아가기
        </Button>
      </div>
    );
  }

  const tombstone = [
    { label: 'Year', value: artwork.year ? String(artwork.year) : '' },
    { label: 'Medium', value: artwork.medium },
    { label: 'Dimensions', value: artwork.dimensions },
  ].filter((row) => row.value);

  return (
    <div className="min-h-screen bg-wall pb-[var(--space-section)]">
      {/* Back */}
      <div className="shell pt-8">
        <Button
          variant="ghost"
          onClick={handleBackToGallery}
          className="pressable arrow-link text-meta h-auto rounded-none px-0 font-normal text-ink-soft hover:bg-transparent hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          갤러리로 돌아가기
        </Button>
      </div>

      <section className="shell pt-[var(--space-block)]">
        <div className="grid items-start gap-x-[var(--gutter)] gap-y-12 lg:grid-cols-[1.3fr_1fr] lg:gap-x-20">
          {/* The work */}
          <Reveal>
            <ArtworkPlate
              imageUrl={artwork.imageUrl}
              title={artwork.title}
              dimensions={artwork.dimensions}
              priority
            />
          </Reveal>

          {/* Wall label */}
          <Reveal delay={80} className="lg:sticky lg:top-28 lg:self-start">
            <p className="label-sm">Artwork</p>

            <h1 className="font-serif text-h1 mt-5 font-light tracking-[-0.01em] text-ink">
              {artwork.title}
            </h1>

            <div className="mt-8 h-px w-full bg-rule" aria-hidden="true" />

            {tombstone.length > 0 && (
              <dl className="mt-7 space-y-4">
                {tombstone.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4"
                  >
                    <dt className="label-sm">{row.label}</dt>
                    <dd className="text-meta text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {artwork.description && (
              <>
                <div
                  className="mt-9 h-px w-full bg-rule"
                  aria-hidden="true"
                />

                <div className="mt-7">
                  <h2 className="label-sm">작품 설명</h2>
                  <p className="text-body font-serif mt-5 whitespace-pre-wrap text-ink-soft">
                    {artwork.description}
                  </p>
                </div>
              </>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
