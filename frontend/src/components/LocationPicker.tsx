import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  value: string;
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
  clientId: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export function LocationPicker({ value, onChange, clientId }: LocationPickerProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(value);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // 네이버 지도 스크립트 로드
  useEffect(() => {
    if (!isMapOpen) return;

    const scriptId = 'naver-maps-script';
    if (document.getElementById(scriptId)) {
      // 스크립트는 이미 로드됨, 지도만 다시 초기화
      setTimeout(() => initializeMap(), 100);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
    script.async = true;
    script.onload = () => initializeMap();
    document.head.appendChild(script);
  }, [isMapOpen, clientId]);

  const initializeMap = () => {
    if (!window.naver || !window.naver.maps || !mapRef.current) {
      console.error('네이버 지도 API 로딩 실패');
      return;
    }

    try {
      // 기존 지도 인스턴스가 있으면 제거
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }

      // 기존 마커가 있으면 제거
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      const defaultCenter = new window.naver.maps.LatLng(37.5665, 126.9780); // 서울 시청
      
      mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      });

      // 지도 클릭 이벤트
      window.naver.maps.Event.addListener(mapInstanceRef.current, 'click', (e: any) => {
        const latlng = e.coord;
        updateMarker(latlng);
        reverseGeocode(latlng);
      });
    } catch (error) {
      console.error('지도 초기화 실패:', error);
      alert('지도를 불러오는데 실패했습니다. 네이버 클라우드 플랫폼에서 Web 서비스 URL을 확인해주세요.');
    }
  };

  const updateMarker = (latlng: any) => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.naver.maps.Marker({
      position: latlng,
      map: mapInstanceRef.current,
    });

    mapInstanceRef.current.setCenter(latlng);
  };

  const reverseGeocode = (latlng: any) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      alert('네이버 지도 API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    window.naver.maps.Service.reverseGeocode(
      {
        coords: latlng,
        orders: [
          window.naver.maps.Service.OrderType.ADDR,
          window.naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(','),
      },
      (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          alert('주소를 가져올 수 없습니다.');
          return;
        }

        const result = response.v2;
        const address = result.address;
        const roadAddress = address.roadAddress || address.jibunAddress;

        setSelectedLocation(roadAddress);
        setSelectedCoords({ lat: latlng.y, lng: latlng.x });
      }
    );
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      alert('네이버 지도 API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsSearching(true);
    
    window.naver.maps.Service.geocode(
      {
        query: searchQuery,
      },
      (status: any, response: any) => {
        setIsSearching(false);

        if (status !== window.naver.maps.Service.Status.OK) {
          alert('검색 결과가 없습니다.');
          return;
        }

        const result = response.v2;
        const items = result.addresses;

        if (items.length === 0) {
          alert('검색 결과가 없습니다.');
          return;
        }

        setSearchResults(items);

        // 첫 번째 결과로 지도 이동
        if (items[0]) {
          const latlng = new window.naver.maps.LatLng(items[0].y, items[0].x);
          updateMarker(latlng);
          setSelectedLocation(items[0].roadAddress || items[0].jibunAddress);
          setSelectedCoords({ lat: parseFloat(items[0].y), lng: parseFloat(items[0].x) });
        }
      }
    );
  };

  const handleSelectResult = (item: any) => {
    const latlng = new window.naver.maps.LatLng(item.y, item.x);
    updateMarker(latlng);
    setSelectedLocation(item.roadAddress || item.jibunAddress);
    setSelectedCoords({ lat: parseFloat(item.y), lng: parseFloat(item.x) });
    setSearchResults([]);
  };

  const handleConfirm = () => {
    onChange(selectedLocation, selectedCoords || undefined);
    setIsMapOpen(false);
    setSearchResults([]);
  };

  const handleCancel = () => {
    setIsMapOpen(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="location" className="text-xs font-light tracking-wide uppercase text-neutral-500">
        장소 *
      </Label>
      <div className="flex gap-2">
        <Input
          id="location"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 서울시 종로구 세종대로 209"
          required
          className="h-12 border-neutral-300 bg-white font-light focus:border-neutral-900 focus:ring-0"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapOpen(true)}
          className="h-12 px-4 border-neutral-300 hover:border-neutral-500"
        >
          <MapPin className="h-4 w-4 mr-2" />
          지도에서 선택
        </Button>
      </div>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>전시회 장소 선택</DialogTitle>
            <DialogDescription>
              주소를 검색하거나 지도를 클릭하여 위치를 선택하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 검색 바 */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="주소 또는 장소명 검색..."
                  className="h-12 pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
              <Button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="h-12 px-6"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    검색 중
                  </>
                ) : (
                  '검색'
                )}
              </Button>
            </div>

            {/* 검색 결과 */}
            {searchResults.length > 0 && (
              <div className="border border-neutral-200 rounded-lg max-h-40 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectResult(item)}
                    className="w-full text-left px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-0 transition-colors"
                  >
                    <div className="font-medium text-sm">
                      {item.roadAddress || item.jibunAddress}
                    </div>
                    {item.roadAddress && item.jibunAddress && (
                      <div className="text-xs text-neutral-500 mt-1">
                        지번: {item.jibunAddress}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* 지도 */}
            <div
              ref={mapRef}
              className="w-full h-96 border border-neutral-200 rounded-lg"
            />

            {/* 선택된 주소 */}
            {selectedLocation && (
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-neutral-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {selectedLocation}
                    </p>
                    {selectedCoords && (
                      <p className="text-xs text-neutral-500 mt-1">
                        좌표: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-12"
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="flex-1 h-12"
              >
                선택 완료
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
