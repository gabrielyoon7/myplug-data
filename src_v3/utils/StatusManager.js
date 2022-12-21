import { NUM_OF_ROWS, STATUS_MESSAGE } from './constants.js';
import { generateTimeObject } from './time.js';

export default class StatusManager {
  #time = null;

  #statusList = [];

  constructor() {
    this.#time = generateTimeObject();
  }

  addStatus(region, currentPage, maxPage, currentCount, totalCount) {
    this.#statusList.push({
      description: '수신완료', region, currentPage, maxPage, currentCount, totalCount,
    });
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
      }
      console.log(message);
    });
    console.log('');
  }
}
