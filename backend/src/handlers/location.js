const { success, badRequest } = require('../utils/response');

/**
 * 네이버 지역 검색 API를 사용하여 장소 검색
 * 장소명으로 검색 가능 (예: "원천교회", "스타벅스 강남점")
 */
async function searchLocation(query) {
  if (!query || query.trim().length === 0) {
    return badRequest('검색어를 입력해주세요.');
  }

  try {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('네이버 API 인증 정보가 설정되지 않았습니다.');
      return success([]);
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://openapi.naver.com/v1/search/local.json?query=${encodedQuery}&display=5&sort=random`;

    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!response.ok) {
      console.error('네이버 지역 검색 API 호출 실패:', response.status);
      return success([]);
    }

    const data = await response.json();
    
    // HTML 태그 제거 및 데이터 정리
    const items = (data.items || []).map(item => ({
      title: item.title.replace(/<[^>]*>/g, ''),
      address: item.address,
      roadAddress: item.roadAddress,
      category: item.category,
      mapx: item.mapx,
      mapy: item.mapy,
    }));

    return success(items);
  } catch (error) {
    console.error('장소 검색 중 오류:', error);
    return success([]);
  }
}

module.exports = {
  searchLocation,
};
