import { useState } from 'react';
import { api, type ContactFormData } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            문의하기
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            작품이나 전시회에 대해 궁금하신 점이 있으신가요? 언제든 연락주세요.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 relative">
        {/* Decorative Bird - positioned in bottom right as a whimsical accent */}
        <div className="absolute bottom-8 right-4 lg:bottom-12 lg:right-12 z-0 pointer-events-none hidden sm:block">
          <img
            src="/ddunddun2.png"
            alt=""
            className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 opacity-70 hover:opacity-90 transition-all duration-500 animate-[float_5s_ease-in-out_infinite]"
            style={{
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.12))',
              animationDelay: '1s'
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">연락처 정보</h2>
                <p className="text-muted-foreground mb-8">
                  아래 연락처나 문의 양식을 통해 편하게 연락주세요.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="size-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">이메일</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          이메일로 문의하세요
                        </p>
                        <a
                          href="mailto:info@yhartlab.com"
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          info@yhartlab.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="size-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">전화</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          갤러리 운영 시간 내 통화 가능
                        </p>
                        <a
                          href="tel:+82-10-1234-5678"
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          +82 10-1234-5678
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="size-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">방문</h3>
                        <p className="text-sm text-muted-foreground">
                          서울특별시 갤러리 구역<br />
                          아트 스트리트 123
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 bg-primary/5">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">운영 시간</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>화요일 - 토요일: 오전 10:00 - 오후 6:00</p>
                    <p>일요일: 오후 12:00 - 오후 5:00</p>
                    <p>월요일: 휴관</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">메시지 보내기</CardTitle>
                <CardDescription className="text-base">
                  아래 양식을 작성해 주시면 최대한 빠르게 답변 드리겠습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/20 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary mb-1">메시지가 전송되었습니다!</p>
                      <p className="text-sm text-muted-foreground">
                        문의해 주셔서 감사합니다. 곧 답변 드리겠습니다.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        이름 *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="홍길동"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        이메일 *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="hong@example.com"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold">
                      제목 *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="작품 문의"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      메시지 *
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="문의 내용을 자세히 작성해 주세요..."
                      rows={6}
                      className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      '전송 중...'
                    ) : (
                      <>
                        <Send className="mr-2 size-4" />
                        메시지 보내기
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}