/**
 * 전국 지역 코드
 */
const ZCODES = [
  // { code: 11, region: '서울' },
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
const USING_STATUS = '3';

const STATUS_TYPE = Object.freeze({
  receiver: 'receiver',
  saver: 'saver',
  logger: 'logger',
});

const URL = Object.freeze({
  api: 'http://apis.data.go.kr/B552584/EvCharger/getChargerInfo?',
  serviceKey: 'serviceKey=dg8oHXO5d9HkXM00ye%2Bvpwk1w16hxVZxN9UGvCFKA8kXtHQhTb6CJebWA2WZdMszfK%2B9HgoiqEYCB%2Bze2hFWMQ%3D%3D',
  pageNo: '&pageNo=',
  numOfRows: '&numOfRows=',
  zcode: '&zcode=',
});

const statusConverter = (type, status) => {
  switch (type) {
    case 'receiver':
      if (status) {
        return '수신완료'.yellow.bgGreen.bold;
      }
      return '수신중'.yellow.bgYellow.bold;
    case 'saver':
      if (status) {
        return '저장완료'.yellow.bgGreen.bold;
      }
      return '저장중'.yellow.bgYellow.bold;
    case 'logger':
      if (status) {
        return '로깅완료'.yellow.bgGreen.bold;
      }
      return '로깅중'.yellow.bgYellow.bold;
    default:
      return 'error';
  }
};

const statusView = (stat) => {
  let text = '';
  if (stat.receiver !== null) {
    text += statusConverter('receiver', stat.receiver);
  }
  if (stat.saver !== null) {
    text += ` → ${statusConverter('saver', stat.saver)}`;
  }
  if (stat.logger !== null) {
    text += ` → ${statusConverter('logger', stat.logger)}`;
  }
  return text;
};

const regionPageView = (stat) => `${stat.region} ${stat.currentPage}/${stat.maxPage}`.bgGray.bold;

const STATUS_MESSAGE = (stat) => `${regionPageView(stat)}\t${statusView(stat)}\t`;

export {
  ZCODES, NUM_OF_ROWS, USING_STATUS, STATUS_TYPE, URL, STATUS_MESSAGE,
};
