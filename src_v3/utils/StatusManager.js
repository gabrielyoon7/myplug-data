import { STATUS_MESSAGE } from './constants.js';
import { generateTimeObject } from './time.js';

export default class StatusManager {
  #time = null;

  #statusList = [];

  constructor() {
    this.#time = generateTimeObject();
  }

  addStatus(region, currentPage, maxPage, currentCount, totalCount) {
    this.#statusList.push({
      region,
      currentPage,
      maxPage,
      currentCount,
      totalCount,
      receiver: false,
      saver: null,
      logger: null,
    });
    this.print();
  }

  updateStatus(region, currentPage, type, status) {
    const con = (stat) => stat.region === region && stat.currentPage === currentPage;
    const index = this.#statusList.findIndex((stat) => con(stat));
    this.#statusList[index][type] = status;
    this.print();
  }

  getStatus() {
    return this.#statusList;
  }

  getTime() {
    return this.#time;
  }

  print() {
    // console.clear();
    this.#statusList.sort((a, b) => a.region.localeCompare(b.region));
    // console.log(JSON.stringify(this.#statusList));
    this.#statusList.forEach((stat) => {
      console.log(STATUS_MESSAGE(stat));
    });
    console.log('');
  }
}
