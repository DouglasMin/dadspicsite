import { useState } from 'react';
import { api, type ContactFormData } from '@/lib/api';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      {/* Page Header - Minimal */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-px bg-neutral-300 mx-auto mb-8" />
              <h1 className="text-5xl md:text-6xl font-light text-neutral-900 tracking-tight mb-6">
                Contact
              </h1>
              <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
                작품이나 전시회에 대한 문의, 또는 협업 제안이 있으시면<br />
                언제든 연락주세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24 relative">
        {/* Subtle decorative element */}
        <div className="absolute bottom-12 right-12 opacity-30 pointer-events-none hidden lg:block">
          <img
            src="/ddunddun2.png"
            alt=""
            className="w-32 h-32 object-contain animate-[float_8s_ease-in-out_infinite]"
            style={{ filter: 'grayscale(40%) opacity(0.6)' }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="w-12 h-px bg-neutral-300" />
                <h2 className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide">
                  Get in Touch
                </h2>
                <p className="text-base text-neutral-600 font-light leading-relaxed">
                  작품 구매, 전시 협력, 또는 기타 문의사항이 있으시면<br />
                  아래 연락처로 편하게 연락주세요.
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-neutral-500" />
                    <span className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      Email
                    </span>
                  </div>
                  <a
                    href="mailto:info@yhartlab.com"
                    className="text-lg font-light text-neutral-900 hover:text-neutral-600 transition-colors block"
                  >
                    info@yhartlab.com
                  </a>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="size-4 text-neutral-500" />
                    <span className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      Phone
                    </span>
                  </div>
                  <a
                    href="tel:+82-10-1234-5678"
                    className="text-lg font-light text-neutral-900 hover:text-neutral-600 transition-colors block"
                  >
                    +82 10-1234-5678
                  </a>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-neutral-500" />
                    <span className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      Location
                    </span>
                  </div>
                  <div className="text-lg font-light text-neutral-900">
                    서울특별시 갤러리 구역<br />
                    아트 스트리트 123
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-neutral-200">
                <div className="space-y-4">
                  <h3 className="text-base font-light text-neutral-900 tracking-wide">
                    Gallery Hours
                  </h3>
                  <div className="text-sm text-neutral-600 font-light space-y-2">
                    <div className="flex justify-between">
                      <span>Tuesday - Saturday</span>
                      <span>10:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>12:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-neutral-50 p-8 lg:p-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="w-12 h-px bg-neutral-300" />
                  <h2 className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide">
                    Send Message
                  </h2>
                  <p className="text-base text-neutral-600 font-light leading-relaxed">
                    아래 양식을 작성해 주시면 빠른 시일 내에 답변 드리겠습니다.
                  </p>
                </div>

                {success && (
                  <div className="p-6 bg-white border border-neutral-200 flex items-start gap-4">
                    <CheckCircle2 className="size-5 text-neutral-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-light text-neutral-900 mb-1">메시지가 전송되었습니다</p>
                      <p className="text-sm text-neutral-500 font-light">
                        문의해 주셔서 감사합니다. 곧 답변 드리겠습니다.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-6 bg-red-50 border border-red-200">
                    <p className="text-red-700 text-sm font-light">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="홍길동"
                        className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-xs font-light tracking-wide uppercase text-neutral-500">
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
                        className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="작품 문의"
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-xs font-light tracking-wide uppercase text-neutral-500">
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
                      className="w-full border border-neutral-300 bg-white px-4 py-3 text-base font-light transition-colors outline-none resize-none focus:border-neutral-900 placeholder:text-neutral-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full h-12 text-base font-light border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      '전송 중...'
                    ) : (
                      <>
                        <Send className="mr-2 size-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}