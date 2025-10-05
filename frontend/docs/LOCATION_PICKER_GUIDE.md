# LocationPicker 컴포넌트 사용 가이드

## 개요

`LocationPicker`는 네이버 지도 API를 활용한 위치 선택 컴포넌트입니다. 사용자가 주소를 직접 입력하거나 지도에서 시각적으로 위치를 선택할 수 있습니다.

## 주요 기능

### 1. 텍스트 입력
- 기본 Input 필드로 주소 직접 입력 가능
- 수기 입력 시 빠른 데이터 입력

### 2. 지도 기반 선택
- "지도에서 선택" 버튼으로 지도 모달 열기
- 주소 검색 또는 지도 클릭으로 위치 선택
- 선택된 위치에 마커 표시

### 3. 주소 검색 (Geocoding)
- 검색창에 주소 입력
- 실시간 검색 결과 표시
- 도로명 주소 및 지번 주소 지원

### 4. 지도 클릭 (Reverse Geocoding)
- 지도의 원하는 위치 클릭
- 자동으로 해당 위치의 주소 표시
- 좌표 정보도 함께 제공

## 사용 방법

### 기본 사용

```tsx
import { LocationPicker } from '@/components/LocationPicker';

function MyForm() {
  const [location, setLocation] = useState('');

  return (
    <LocationPicker
      value={location}
      onChange={(newLocation) => setLocation(newLocation)}
      clientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}
    />
  );
}
```

### 좌표 정보 포함

```tsx
import { LocationPicker } from '@/components/LocationPicker';

function MyForm() {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <LocationPicker
      value={location}
      onChange={(newLocation, coords) => {
        setLocation(newLocation);
        setCoordinates(coords || null);
      }}
      clientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | ✅ | 현재 선택된 주소 값 |
| `onChange` | `(location: string, coordinates?: { lat: number; lng: number }) => void` | ✅ | 주소 변경 시 호출되는 콜백 함수 |
| `clientId` | `string` | ✅ | 네이버 지도 API Client ID |

## 컴포넌트 구조

```
LocationPicker
├── Input (주소 직접 입력)
├── Button (지도 모달 열기)
└── Dialog (지도 모달)
    ├── 검색 바
    ├── 검색 결과 목록
    ├── 지도 (네이버 Maps)
    ├── 선택된 주소 표시
    └── 확인/취소 버튼
```

## 스타일링

컴포넌트는 프로젝트의 디자인 시스템을 따릅니다:
- Tailwind CSS 유틸리티 클래스 사용
- shadcn/ui 컴포넌트 활용
- 일관된 spacing과 color scheme

### 커스터마이징

필요시 컴포넌트를 복사하여 수정할 수 있습니다:

```tsx
// 지도 초기 중심점 변경
const defaultCenter = new window.naver.maps.LatLng(37.5665, 126.9780); // 서울 시청

// 지도 줌 레벨 변경
mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, {
  center: defaultCenter,
  zoom: 15, // 원하는 줌 레벨로 변경
});
```

## 에러 처리

### Client ID 누락
```tsx
// 환경변수가 없을 경우 대체 UI 표시
{!import.meta.env.VITE_NAVER_MAP_CLIENT_ID ? (
  <div className="text-sm text-amber-600">
    네이버 지도 API 키가 설정되지 않았습니다.
  </div>
) : (
  <LocationPicker ... />
)}
```

### 검색 실패
컴포넌트 내부에서 자동으로 alert 표시:
- "검색 결과가 없습니다."
- "주소를 가져올 수 없습니다."

## 성능 최적화

### 스크립트 로딩
- 지도 모달이 열릴 때만 네이버 지도 스크립트 로드
- 중복 로딩 방지 (scriptId 체크)
- 비동기 로딩으로 초기 페이지 로드 속도 유지

### 메모리 관리
- 컴포넌트 언마운트 시 자동으로 리소스 정리
- 마커 재사용으로 메모리 절약

## 접근성

- 키보드 네비게이션 지원 (Enter 키로 검색)
- 명확한 Label과 placeholder
- 시각적 피드백 (로딩 상태, 선택된 위치)

## 브라우저 호환성

- Chrome, Firefox, Safari, Edge 최신 버전
- 모바일 브라우저 지원
- IE는 지원하지 않음 (네이버 지도 API 제약)

## 예제 시나리오

### 시나리오 1: 미술관 주소 입력
1. "지도에서 선택" 버튼 클릭
2. 검색창에 "국립현대미술관" 입력
3. 검색 결과에서 원하는 위치 선택
4. "선택 완료" 클릭

### 시나리오 2: 정확한 위치 지정
1. "지도에서 선택" 버튼 클릭
2. 지도를 드래그하여 원하는 지역으로 이동
3. 정확한 위치를 클릭
4. 자동으로 표시되는 주소 확인
5. "선택 완료" 클릭

## 문제 해결

### Q: 지도가 표시되지 않아요
A: 
- Client ID가 올바르게 설정되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 네트워크 탭에서 API 호출 상태 확인

### Q: 검색이 안 돼요
A:
- 정확한 주소 형식으로 입력 (도로명 주소 권장)
- 일일 API 사용량 제한 확인
- 네이버 클라우드 플랫폼 콘솔에서 API 상태 확인

### Q: 좌표 정보가 필요해요
A:
- `onChange` 콜백의 두 번째 파라미터로 좌표 제공
- `{ lat: number, lng: number }` 형태로 전달됨

## 향후 개선 사항

- [ ] 최근 검색 기록 저장
- [ ] 즐겨찾기 위치 기능
- [ ] 주소 자동완성 (debounce 적용)
- [ ] 다국어 지원
- [ ] 커스텀 마커 아이콘
