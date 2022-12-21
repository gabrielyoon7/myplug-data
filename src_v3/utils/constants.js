/**
 * 전국 지역 코드
 */
const ZCODES = [
  { code: 11, region: '서울' },
  // { code: 26, region: '부산' },
  // { code: 27, region: '대구' },
  // { code: 28, region: '인천' },
  // { code: 29, region: '광주' },
  // { code: 30, region: '대전' },
  // { code: 31, region: '울산' },
  // { code: 41, region: '경기' },
  // { code: 42, region: '강원' },
  // { code: 43, region: '충북' },
  // { code: 44, region: '충남' },
  // { code: 45, region: '전북' },
  // { code: 46, region: '전남' },
  // { code: 47, region: '경북' },
  // { code: 48, region: '경남' },
  { code: 50, region: '제주' },
];

const NUM_OF_ROWS = 9999; // 한번에 최대 몇개 데이터를 처리할건지 결정하는 부분. (max : 9999)

const STATUS_MESSAGE = (stat) => `[${stat.region} ${stat.currentPage}/${stat.maxPage}] : ${stat.description} `;

export { ZCODES, NUM_OF_ROWS, STATUS_MESSAGE };
