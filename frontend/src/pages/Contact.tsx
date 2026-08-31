import { useState } from 'react';
import { api, type ContactFormData } from '@/lib/api';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle2 } from 'lucide-react';
import { PageMasthead } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const FIELD_CLASS =
  'h-11 rounded-none border-0 border-b border-rule bg-transparent px-0 text-meta shadow-none transition-colors duration-200 ease-out placeholder:text-ink-faint focus-visible:border-ink focus-visible:ring-0';

const GALLERY_HOURS = [
  { day: 'Tuesday - Saturday', hours: '10:00 - 18:00' },
  { day: 'Sunday', hours: '12:00 - 17:00' },
  { day: 'Monday', hours: 'Closed' },
];

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.submitContact(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-wall pb-[var(--space-section)]">
      <PageMasthead title="Contact">
        작품이나 전시회에 대한 문의, 또는 협업 제안이 있으시면
        <br />
        언제든 연락주세요.
      </PageMasthead>

      {/* Subtle decorative element */}
      <div className="pointer-events-none absolute right-10 bottom-24 hidden lg:block">
        <img
          src="/ddunddun2.png"
          alt=""
          className="size-36 animate-[float_8s_ease-in-out_infinite] object-contain opacity-80"
          style={{ filter: 'grayscale(10%)' }}
        />
      </div>

      <section className="shell relative z-10 mt-[var(--space-block)]">
        <div className="grid gap-x-[var(--gutter)] gap-y-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-20">
          {/* Contact Info */}
          <Reveal>
            <h2 className="font-serif text-h2 font-normal text-ink">
              Get in Touch
            </h2>
            <p className="text-body mt-5 text-ink-soft">
              작품 전시 협력, 대여 등의 문의사항이 있으시면
              <br />
              아래 연락처로 편하게 연락주세요.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <p className="label-sm">Email</p>
                <a
                  href="mailto:hildamin1218@gmail.com"
                  className="font-serif mt-2 block text-lg text-ink transition-colors duration-200 ease-out hover:text-ink-soft"
                >
                  hildamin1218@gmail.com
                </a>
              </div>

              <div>
                <p className="label-sm">Phone</p>
                <a
                  href="tel:+82-10-2711-1115"
                  className="font-serif mt-2 block text-lg text-ink transition-colors duration-200 ease-out hover:text-ink-soft"
                >
                  +82 10-2711-1115
                </a>
              </div>

              <div>
                <p className="label-sm">Location</p>
                <p className="font-serif mt-2 text-lg leading-relaxed text-ink">
                  서울특별시 갤러리 구역
                  <br />
                  아트 스트리트 123
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-rule pt-8">
              <h3 className="label-sm">Gallery Hours</h3>
              <dl className="mt-5 space-y-3">
                {GALLERY_HOURS.map((entry) => (
                  <div
                    key={entry.day}
                    className="text-meta flex items-baseline justify-between gap-6 text-ink-soft"
                  >
                    <dt>{entry.day}</dt>
                    <dd className="tabular-nums text-ink">{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={80}>
            <div className="bg-paper p-6 sm:p-10 lg:p-12">
              <h2 className="font-serif text-h2 font-normal text-ink">
                Send Message
              </h2>
              <p className="text-body mt-4 text-ink-soft">
                아래 양식을 작성해 주시면 빠른 시일 내에 답변 드리겠습니다.
              </p>

              {success && (
                <div className="mt-8 flex items-start gap-4 border border-rule bg-wall p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ink-soft" />
                  <div>
                    <p className="text-meta font-medium text-ink">메시지가 전송되었습니다</p>
                    <p className="text-meta mt-1 text-ink-soft">
                      문의해 주셔서 감사합니다. 곧 답변 드리겠습니다.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-8 border border-destructive/40 bg-destructive/5 p-5">
                  <p className="text-meta text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="label-sm">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="홍길동"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="label-sm">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="hong@example.com"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="label-sm">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="작품 문의"
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="label-sm">
                    Message *
                  </Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="문의 내용을 자세히 작성해 주세요..."
                    rows={6}
                    className="text-meta w-full resize-none border-0 border-b border-rule bg-transparent px-0 py-3 leading-relaxed text-ink outline-none transition-colors duration-200 ease-out placeholder:text-ink-faint focus:border-ink"
                  />
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  className="pressable text-meta h-12 w-full rounded-none border-ink font-normal text-ink hover:bg-ink hover:text-paper"
                  disabled={loading}
                >
                  {loading ? (
                    '전송 중...'
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
