import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { getIdToken } from '@/lib/auth';
import { api, type Artwork } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

export function ArtworkManagement() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthGuard();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadArtworks();
    }
  }, [isAuthenticated]);

  const loadArtworks = async () => {
    try {
      const token = await getIdToken();
      if (token) {
        api.setToken(token);
      }

      const data = await api.getArtworks();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('작품 목록 로딩 실패:', error);
    } finally {
      setDataLoading(false);
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

      const artworkData = {
        ...formData,
        year: Number(formData.year),
        imageUrl
      };

      if (editingArtwork) {
        await api.updateArtwork(editingArtwork.id, artworkData);
      } else {
        await api.createArtwork(artworkData);
      }

      await loadArtworks();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('작품 저장 실패:', error);
      alert('작품 저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: artwork.description,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      imageUrl: artwork.imageUrl
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 작품을 삭제하시겠습니까?')) return;

    try {
      await api.deleteArtwork(id);
      await loadArtworks();
    } catch (error) {
      console.error('작품 삭제 실패:', error);
      alert('작품 삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      medium: '',
      dimensions: '',
      imageUrl: ''
    });
    setEditingArtwork(null);
    setImageFile(null);
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
          <p className="text-muted-foreground">작품 목록을 불러오는 중...</p>
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
            <h1 className="text-xl font-bold">작품 관리</h1>

          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                새 작품 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArtwork ? '작품 수정' : '새 작품 추가'}
                </DialogTitle>
                <DialogDescription>
                  작품 정보를 입력해주세요. 모든 필수 항목을 채워주세요.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      작품명 *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                      placeholder="작품의 제목을 입력하세요"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="year" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      제작년도 *
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      required
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                    작품 설명 *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    className="border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0 resize-none"
                    placeholder="작품에 대한 상세한 설명을 입력하세요..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="medium" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      재료/기법 *
                    </Label>
                    <Input
                      id="medium"
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                      placeholder="예: 캔버스에 유화"
                      required
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dimensions" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                      크기 *
                    </Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="예: 100 x 80 cm"
                      required
                      className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="image" className="text-xs font-light tracking-wide uppercase text-neutral-500">
                    작품 이미지
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
                          <p className="text-sm font-light text-neutral-600 mb-1">현재 이미지</p>
                          <p className="text-xs text-neutral-500">새 이미지를 선택하면 기존 이미지가 교체됩니다</p>
                        </div>
                      </div>
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
                        editingArtwork ? '작품 수정' : '작품 추가'
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
            <CardTitle>작품 목록</CardTitle>
            <CardDescription>
              등록된 작품 {artworks.length}개
            </CardDescription>
          </CardHeader>
          <CardContent>
            {artworks.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground mb-2">등록된 작품이 없습니다</p>
                <p className="text-sm text-muted-foreground">첫 번째 작품을 추가해보세요</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이미지</TableHead>
                    <TableHead>작품명</TableHead>
                    <TableHead>제작년도</TableHead>
                    <TableHead>재료/기법</TableHead>
                    <TableHead>크기</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artworks.map((artwork) => (
                    <TableRow key={artwork.id}>
                      <TableCell>
                        {artwork.imageUrl ? (
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{artwork.title}</TableCell>
                      <TableCell>{artwork.year}</TableCell>
                      <TableCell>{artwork.medium}</TableCell>
                      <TableCell>{artwork.dimensions}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(artwork)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(artwork.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}