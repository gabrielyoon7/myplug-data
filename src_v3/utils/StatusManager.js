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
      region, currentPage, maxPage, currentCount, totalCount, description: '수신 완료',
    });
    this.print();
  }

  updateStatus(region, currentPage, description) {
    const con = (stat) => stat.region === region && stat.currentPage === currentPage;
    const index = this.#statusList.findIndex((stat) => con(stat));
    this.#statusList[index].description = description;
    this.print();
  }

  getStatus() {
    return this.#statusList;
  }

  getTime() {
    return this.#time;
  }

  print() {
    console.clear();
    this.#statusList.sort((a, b) => a.region.localeCompare(b.region));
    console.log(JSON.stringify(this.#statusList));
    this.#statusList.forEach((stat) => {
      let message = `${STATUS_MESSAGE(stat)}`;
      if (stat.description.endsWith('완료')) {
        message = message.yellow.bgGreen.bold;
      } else if (stat.description.endsWith('중')) {
        message = message.yellow.bgYellow.bold;
      }
      console.log(message);
    });
    console.log('');
  }
}
