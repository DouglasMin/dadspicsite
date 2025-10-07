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
    kakao: any;
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

  // 카카오 지도 스크립트 로드
  useEffect(() => {
    if (!isMapOpen) return;

    const scriptId = 'kakao-maps-script';
    const existingScript = document.getElementById(scriptId);
    
    if (existingScript) {
      // 스크립트는 이미 로드됨
      if (window.kakao && window.kakao.maps) {
        // 이미 로드 완료
        setTimeout(() => initializeMap(), 100);
      } else {
        // 로드 중
        existingScript.addEventListener('load', () => {
          window.kakao.maps.load(() => initializeMap());
        });
      }
      return;
    }

    // 새로 스크립트 로드
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${clientId}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => initializeMap());
    };
    script.onerror = () => {
      console.error('카카오 지도 스크립트 로드 실패');
      alert('카카오 지도를 불러올 수 없습니다. 네트워크 연결을 확인해주세요.');
    };
    document.head.appendChild(script);
  }, [isMapOpen, clientId]);

  const initializeMap = () => {
    if (!window.kakao || !window.kakao.maps || !mapRef.current) {
      console.error('카카오 지도 API 로딩 실패');
      return;
    }

    try {
      // 기존 마커가 있으면 제거
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      const defaultCenter = new window.kakao.maps.LatLng(37.5665, 126.9780); // 서울 시청
      
      const mapOption = {
        center: defaultCenter,
        level: 3, // 확대 레벨
      };

      mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, mapOption);

      // 지도 클릭 이벤트
      window.kakao.maps.event.addListener(mapInstanceRef.current, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        updateMarker(latlng);
        reverseGeocode(latlng);
      });
    } catch (error) {
      console.error('지도 초기화 실패:', error);
      alert('지도를 불러오는데 실패했습니다. 카카오 개발자 콘솔에서 Web 플랫폼을 등록해주세요.');
    }
  };

  const updateMarker = (latlng: any) => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.kakao.maps.Marker({
      position: latlng,
      map: mapInstanceRef.current,
    });

    mapInstanceRef.current.setCenter(latlng);
  };

  const reverseGeocode = (latlng: any) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert('카카오 지도 API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].road_address 
          ? result[0].road_address.address_name 
          : result[0].address.address_name;

        setSelectedLocation(address);
        setSelectedCoords({ lat: latlng.getLat(), lng: latlng.getLng() });
      } else {
        alert('주소를 가져올 수 없습니다.');
      }
    });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('카카오 API 상태:', {
        kakao: !!window.kakao,
        maps: !!(window.kakao && window.kakao.maps),
        services: !!(window.kakao && window.kakao.maps && window.kakao.maps.services)
      });
      alert('카카오 지도 API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      // 카카오 장소 검색 서비스
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(searchQuery, (data: any, status: any) => {
        setIsSearching(false);

        if (status === window.kakao.maps.services.Status.OK) {
          // 검색 결과를 통일된 형식으로 변환
          const formattedResults = data.map((item: any) => ({
            title: item.place_name,
            roadAddress: item.road_address_name || item.address_name,
            jibunAddress: item.address_name,
            x: item.x,
            y: item.y,
          }));

          setSearchResults(formattedResults);

          // 첫 번째 결과로 지도 이동
          if (formattedResults[0] && mapInstanceRef.current) {
            const latlng = new window.kakao.maps.LatLng(
              parseFloat(formattedResults[0].y),
              parseFloat(formattedResults[0].x)
            );
            updateMarker(latlng);
            setSelectedLocation(formattedResults[0].roadAddress || formattedResults[0].jibunAddress);
            setSelectedCoords({
              lat: parseFloat(formattedResults[0].y),
              lng: parseFloat(formattedResults[0].x),
            });
          }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 없습니다.');
        } else if (status === window.kakao.maps.services.Status.ERROR) {
          console.error('카카오 검색 API 에러');
          alert('검색 중 오류가 발생했습니다. API 키와 플랫폼 설정을 확인해주세요.');
        } else {
          console.error('알 수 없는 상태:', status);
          alert('검색 중 오류가 발생했습니다.');
        }
      });
    } catch (error) {
      console.error('검색 중 예외 발생:', error);
      setIsSearching(false);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleSelectResult = (item: any) => {
    const latlng = new window.kakao.maps.LatLng(parseFloat(item.y), parseFloat(item.x));
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
                    {item.title && (
                      <div className="font-medium text-sm mb-1">
                        {item.title}
                      </div>
                    )}
                    <div className={item.title ? "text-xs text-neutral-600" : "font-medium text-sm"}>
                      {item.roadAddress || item.jibunAddress}
                    </div>
                    {item.roadAddress && item.jibunAddress && !item.title && (
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
