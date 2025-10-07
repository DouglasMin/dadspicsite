import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { LocationPicker } from '@/components/LocationPicker';
import { getIdToken } from '@/lib/auth';
import { api, type Exhibition, type Artwork } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Loader2, Image as ImageIcon } from 'lucide-react';

export function ExhibitionManagement() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthGuard();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: '',
    artworkIds: [] as string[]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const token = await getIdToken();
      if (token) {
        api.setToken(token);
      }

      await Promise.all([loadExhibitions(), loadArtworks()]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadExhibitions = async () => {
    try {
      const data = await api.getExhibitions();
      setExhibitions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('전시회 목록 로딩 실패:', error);
    }
  };

  const loadArtworks = async () => {
    try {
      const data = await api.getArtworks();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('작품 목록 로딩 실패:', error);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';

    setUploading(true);
    try {
      const result = await api.uploadImage(imageFile);
      return result.imageUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      // 새 이미지가 선택된 경우 업로드
      if (imageFile) {
        imageUrl = await handleImageUpload();
      }

      const exhibitionData = {
        ...formData,
        imageUrl
      };

      if (editingExhibition) {
        await api.updateExhibition(editingExhibition.id, exhibitionData);
      } else {
        await api.createExhibition(exhibitionData);
      }

      await loadExhibitions();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('전시회 저장 실패:', error);
      alert('전시회 저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
    setFormData({
      title: exhibition.title,
      description: exhibition.description,
      startDate: exhibition.startDate.split('T')[0], // ISO date to YYYY-MM-DD
      endDate: exhibition.endDate.split('T')[0],
      location: exhibition.location,
      imageUrl: exhibition.imageUrl || '',
      artworkIds: exhibition.artworkIds || []
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 전시회를 삭제하시겠습니까?')) return;

    try {
      await api.deleteExhibition(id);
      await loadExhibitions();
    } catch (error) {
      console.error('전시회 삭제 실패:', error);
      alert('전시회 삭제에 실패했습니다.');
    }
  };

  const handleArtworkToggle = (artworkId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      artworkIds: checked
        ? [...prev.artworkIds, artworkId]
        : prev.artworkIds.filter(id => id !== artworkId)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      imageUrl: '',
      artworkIds: []
    });
    setEditingExhibition(null);
    setImageFile(null);
  };

  const getExhibitionStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: 'upcoming', label: '예정', variant: 'secondary' as const };
    } else if (now >= start && now <= end) {
      return { status: 'ongoing', label: '진행중', variant: 'default' as const };
    } else {
      return { status: 'ended', label: '종료', variant: 'outline' as const };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAuthGuard가 리다이렉트 처리
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">전시회 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              대시보드로
            </Button>
            <h1 className="text-xl font-bold">전시회 관리</h1>

          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                새 전시회 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingExhibition ? '전시회 수정' : '새 전시회 추가'}
                </DialogTitle>
                <DialogDescription>
                  전시회 정보를 입력해주세요. 모든 필수 항목을 채워주세요.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                    전시회명 *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                    placeholder="전시회의 제목을 입력하세요"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                    전시회 설명 *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    className="border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0 resize-none"
                    placeholder="전시회에 대한 상세한 설명을 입력하세요..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="startDate" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      시작일 *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="endDate" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      종료일 *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                    />
                  </div>
                </div>

                <LocationPicker
                  value={formData.location}
                  onChange={(location) => setFormData({ ...formData, location })}
                  clientId={import.meta.env.VITE_KAKAO_MAP_CLIENT_ID || ''}
                />

                <div className="space-y-3">
                  <Label htmlFor="image" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                    전시회 포스터 이미지
                  </Label>
                  <div className="space-y-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-light file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                    />
                    {formData.imageUrl && (
                      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                        <img
                          src={formData.imageUrl}
                          alt="미리보기"
                          className="w-24 h-24 object-cover rounded-lg border border-neutral-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-light text-neutral-600 mb-1">현재 포스터 이미지</p>
                          <p className="text-xs text-neutral-500">새 이미지를 선택하면 기존 이미지가 교체됩니다</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-light tracking-wide uppercase text-neutral-500">
                    전시 작품 선택
                  </Label>
                  <div className="border border-neutral-300 rounded-lg p-6 bg-neutral-50 max-h-80 overflow-y-auto">
                    {artworks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm font-light text-neutral-500">등록된 작품이 없습니다.</p>
                        <p className="text-xs text-neutral-400 mt-1">먼저 작품을 등록해주세요.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {artworks.map((artwork) => (
                          <div key={artwork.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
                            <Checkbox
                              id={artwork.id}
                              checked={formData.artworkIds.includes(artwork.id)}
                              onCheckedChange={(checked) =>
                                handleArtworkToggle(artwork.id, checked as boolean)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <label
                                htmlFor={artwork.id}
                                className="text-sm font-light text-neutral-900 cursor-pointer block leading-tight"
                              >
                                {artwork.title}
                              </label>
                              <p className="text-xs text-neutral-500 mt-1">
                                {artwork.year} • {artwork.medium}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>선택된 작품: {formData.artworkIds.length}개</span>
                    {formData.artworkIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, artworkIds: [] })}
                        className="text-neutral-400 hover:text-neutral-600 underline"
                      >
                        모두 해제
                      </button>
                    )}
                  </div>
                </div>

                <DialogFooter className="pt-8 border-t border-neutral-200">
                  <div className="flex gap-4 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 h-12 font-light border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex-1 h-12 font-light bg-neutral-900 hover:bg-neutral-800"
                    >
                      {submitting || uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {uploading ? '업로드 중...' : '저장 중...'}
                        </>
                      ) : (
                        editingExhibition ? '전시회 수정' : '전시회 추가'
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>전시회 목록</CardTitle>
            <CardDescription>
              등록된 전시회 {exhibitions.length}개
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exhibitions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground mb-2">등록된 전시회가 없습니다</p>
                <p className="text-sm text-muted-foreground">첫 번째 전시회를 추가해보세요</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>포스터</TableHead>
                    <TableHead>전시회명</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>장소</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>전시작품</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exhibitions.map((exhibition) => {
                    const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
                    return (
                      <TableRow key={exhibition.id}>
                        <TableCell>
                          {exhibition.imageUrl ? (
                            <img
                              src={exhibition.imageUrl}
                              alt={exhibition.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{exhibition.title}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(exhibition.startDate)}</div>
                            <div className="text-muted-foreground">~ {formatDate(exhibition.endDate)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{exhibition.location}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>{exhibition.artworkIds?.length || 0}개</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(exhibition)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(exhibition.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}