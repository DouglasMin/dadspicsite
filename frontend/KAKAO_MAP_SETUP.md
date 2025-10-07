# 카카오 지도 API 설정 가이드

전시회 위치 선택 기능에서 **상호명 검색 → 도로명 주소 변환**을 위해 카카오 지도 API를 사용합니다.

## 1. 카카오 개발자 계정 가입

1. [카카오 개발자 센터](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인 또는 회원가입

## 2. 애플리케이션 등록

1. 상단 메뉴에서 **"내 애플리케이션"** 선택
2. **"애플리케이션 추가하기"** 클릭
3. 애플리케이션 정보 입력:
   - **앱 이름**: 원하는 이름 (예: "아트 갤러리")
   - **사업자명**: 개인 또는 회사명
   - **카테고리**: 적절한 카테고리 선택

## 3. JavaScript 키 확인

1. 생성한 애플리케이션 선택
2. **"앱 키"** 메뉴 선택
3. **JavaScript 키** 복사

## 4. Web 플랫폼 등록 (필수!)

카카오 지도 JavaScript SDK를 사용하려면 반드시 Web 플랫폼을 등록해야 합니다.

1. 애플리케이션 설정 페이지에서 **"플랫폼"** 메뉴 선택
2. **"Web 플랫폼 추가"** 클릭
3. **사이트 도메인** 입력:
   - 개발: `http://localhost:5173`
   - 프로덕션: 실제 도메인 추가 (예: `https://yourdomain.com`)
4. **저장** 클릭

> ⚠️ **중요**: 등록하지 않은 도메인에서는 API가 작동하지 않습니다!

## 5. 환경변수 설정

### 로컬 개발 환경

프론트엔드 프로젝트의 `.env` 파일에 추가:

```bash
VITE_KAKAO_MAP_CLIENT_ID=your_javascript_key_here
```

### Terraform (인프라)

`terraform/terraform.tfvars` 파일에 추가:

```hcl
kakao_javascript_key = "your_javascript_key_here"
```

### GitHub Actions (CI/CD)

GitHub Repository Settings에서:

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Secret 추가:
   - Name: `VITE_KAKAO_MAP_CLIENT_ID`
   - Value: JavaScript 키

## 6. 개발 서버 재시작

```bash
cd frontend
npm run dev
```

## 사용 방법

1. **Admin > 전시회 관리** 페이지 접속
2. **새 전시회 추가** 또는 기존 전시회 **수정**
3. 장소 입력란 옆의 **"지도에서 선택"** 버튼 클릭
4. 검색창에 **상호명 또는 주소** 입력 (예: "동안교회", "스타벅스 강남점")
5. 검색 결과에서 선택하거나 지도를 직접 클릭
6. **선택 완료** 버튼으로 주소 확정

## 주요 기능

### 키워드 검색 (Places API)
- 상호명, 건물명, 랜드마크로 검색 가능
- 자동으로 도로명 주소 변환
- 검색 결과 목록에서 선택 가능

### 좌표→주소 변환 (Geocoder API)
- 지도 클릭 시 해당 위치의 주소 자동 표시
- 도로명 주소 우선 표시

### 지도 인터랙션
- 줌 인/아웃
- 드래그로 지도 이동
- 마커로 선택된 위치 표시

## API 사용량 제한

카카오 지도 API 무료 사용량:
- **키워드 검색**: 일 300,000건
- **좌표→주소 변환**: 일 300,000건

일일 사용량 초과 시 추가 요금이 발생할 수 있으니 주의하세요.

## 문제 해결

### "인증 실패" 오류
- JavaScript 키가 올바른지 확인
- Web 플랫폼에 현재 도메인이 등록되어 있는지 확인
- 브라우저 캐시 삭제 후 재시도

### 지도가 표시되지 않음
- 브라우저 콘솔에서 에러 메시지 확인
- 네트워크 탭에서 API 호출 상태 확인
- JavaScript 키 환경변수가 제대로 설정되었는지 확인

### 검색 결과가 없음
- 정확한 상호명 또는 주소 입력
- 띄어쓰기 확인 (예: "동안 교회" → "동안교회")

## 참고 문서

- [카카오 지도 Web API 문서](https://apis.map.kakao.com/web/)
- [키워드 검색 가이드](https://apis.map.kakao.com/web/sample/keywordBasic/)
- [좌표→주소 변환 가이드](https://apis.map.kakao.com/web/sample/coord2addr/)
