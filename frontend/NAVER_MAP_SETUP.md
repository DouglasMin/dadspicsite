# 네이버 지도 API 설정 가이드

전시회 위치 선택 기능을 사용하려면 네이버 지도 API 키가 필요합니다.

## 1. 네이버 클라우드 플랫폼 가입

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 접속
2. 회원가입 또는 로그인

## 2. Maps API 신청

1. 콘솔 접속: https://console.ncloud.com/
2. **Services > Application Services > Maps** 선택
3. **이용 신청하기** 클릭
4. 약관 동의 후 신청 완료

## 3. 애플리케이션 등록

1. **AI·NAVER API > Application** 메뉴 선택
2. **Application 등록** 버튼 클릭
3. 애플리케이션 정보 입력:
   - **Application 이름**: 원하는 이름 (예: "아트 갤러리")
   - **Service 선택**: 
     - ✅ Maps
     - ✅ Geocoding (주소 검색용)
     - ✅ Reverse Geocoding (좌표→주소 변환용)
   - **Web 서비스 URL**: 
     - 개발: `http://localhost:5173`
     - 프로덕션: 실제 도메인 추가

## 4. 인증 정보 확인

1. 등록한 애플리케이션 선택
2. **인증 정보** 탭에서 **Client ID** 확인
3. Client ID 복사

## 5. 환경변수 설정

프론트엔드 프로젝트의 `.env` 파일에 추가:

```bash
VITE_NAVER_MAP_CLIENT_ID=your_client_id_here
```

`.env.example` 파일을 복사하여 `.env` 파일을 만들고 실제 Client ID로 교체하세요.

## 6. 개발 서버 재시작

```bash
npm run dev
```

## 사용 방법

1. **Admin > 전시회 관리** 페이지 접속
2. **새 전시회 추가** 또는 기존 전시회 **수정**
3. 장소 입력란 옆의 **"지도에서 선택"** 버튼 클릭
4. 두 가지 방법으로 위치 선택:
   - **주소 검색**: 상단 검색창에 주소 입력 후 검색
   - **지도 클릭**: 지도에서 원하는 위치 직접 클릭
5. **선택 완료** 버튼으로 주소 확정

## 기능 설명

### 주소 검색 (Geocoding)
- 사용자가 입력한 주소를 좌표로 변환
- 도로명 주소와 지번 주소 모두 지원
- 검색 결과 목록에서 선택 가능

### 좌표→주소 변환 (Reverse Geocoding)
- 지도 클릭 시 해당 위치의 주소 자동 표시
- 도로명 주소 우선 표시

### 지도 인터랙션
- 줌 인/아웃 컨트롤
- 드래그로 지도 이동
- 마커로 선택된 위치 표시

## API 사용량 제한

네이버 클라우드 플랫폼 무료 티어:
- **Geocoding**: 일 10,000건
- **Reverse Geocoding**: 일 10,000건
- **Maps API**: 무제한

일일 사용량 초과 시 추가 요금이 발생할 수 있으니 주의하세요.

## 문제 해결

### "인증 실패" 오류
- Client ID가 올바른지 확인
- Web 서비스 URL에 현재 도메인이 등록되어 있는지 확인
- 브라우저 캐시 삭제 후 재시도

### 지도가 표시되지 않음
- 브라우저 콘솔에서 에러 메시지 확인
- 네트워크 탭에서 API 호출 상태 확인
- Client ID 환경변수가 제대로 설정되었는지 확인

### 검색 결과가 없음
- 정확한 주소 형식으로 입력 (예: "서울시 종로구 세종대로 209")
- 건물명보다는 도로명 주소 사용 권장

## 참고 문서

- [네이버 지도 API v3 문서](https://navermaps.github.io/maps.js.ncp/docs/)
- [Geocoding API](https://api.ncloud-docs.com/docs/ai-naver-mapsgeocoding)
- [Reverse Geocoding API](https://api.ncloud-docs.com/docs/ai-naver-mapsreversegeocoding)
