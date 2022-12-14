/* eslint-disable no-await-in-loop */
import API from '../utils/API.js';
import {
  NUM_OF_ROWS, STATUS_TYPE, URL, ZCODES,
} from '../utils/constants.js';
import Saver from './Saver.js';

export default class Receiver {
  // 전국 지역 코드
  #zCodes = ZCODES;

  #statusManager = null;

  constructor(statusManager) {
    this.#statusManager = statusManager;
  }

  async init() {
    // 순서를 지켜주기 위해 Promise.all을 사용했으며, 이후에 등장하는 함수를 iterable하게 적용함
    await Promise.all(this.#zCodes.map((z) => this.getChargerInfoByZcode(z)));
  }

  async getChargerInfoByZcode(z) {
    // console.log(z.code, z.region);
    let totalCount = 10000; // 실행 시 업데이트 되는 부분... 최초 실행 시 업데이트 되며, 전체 갯수를 의미함.
    let page = 1; // 페이지 초기값
    let maxPage = 2; // 최대 페이지값... 최초 실행 시 업데이트 되며, 전체 페이지 수를 의미함.
    while (true) {
      // 다음 페이지를 위해 비워주기 (한번에 여러개 저장하려면 이렇게 하면 안됨)
      const rawData = [];
      // 끝 페이지 도달 시 탈출
      if (page > maxPage) {
        break;
      }

      let url = URL.api;
      url += URL.serviceKey; // 고유키값 (하루에 1000번 요청 제한 있음.)
      url += `${URL.pageNo}${page}`; // 페이지 번호 : 페이지 번호
      url += `${URL.numOfRows}${NUM_OF_ROWS}`; // 한 페이지 결과 수 : 한 페이지 결과 수 (최소 10, 최대 9999)
      url += `${URL.zcode}${z.code}`; // 지역구분 코드 시도 코드 (행정구역코드 앞 2자리)

      const { header, item } = await API.getChargerInfo(url); // KECO API로부터 데이터 수신
      try {
        rawData.push(...item);
        totalCount = header.totalCount;
        maxPage = parseInt(totalCount / NUM_OF_ROWS, 10) + 1;
        this.#statusManager.addStatus(z.region, page, maxPage, rawData.length, totalCount);
        this.#statusManager.updateStatus(z.region, page, STATUS_TYPE.receiver, true);
        /**
         * 받은 데이터를 저장하기 시작함
         * node.js 속도 향상을 위해 지역별이 아닌 페이지 단위로 저장 요청을 수행한다.
         * 이렇게 되면 1번에 최대 9999개까지만 작업해서 속도 개선이 가능함.
         * */
        const saver = new Saver(this.#statusManager, z.region, page, rawData);
        await saver.init();
        // await saver.init(z.region, dateJSON, raw_data, `[${z.region} ${page}/${maxPage}]`);
        page += 1;
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    return null;
  }
}
