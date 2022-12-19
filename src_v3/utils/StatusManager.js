import { NUM_OF_ROWS } from './constants.js';
import { generateTimeObject } from './time.js';

export default class StatusManager {
  #time = null;

  #statusList = [];

  constructor() {
    this.#time = generateTimeObject();
  }

  addStatus(region, currentPage, maxPage, totalCount) {
    this.#statusList.push({
      description: '수신완료', region, currentPage, maxPage, totalCount,
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
    console.log(this.#statusList.length);
    this.#statusList = this.#statusList.sort((a, b) => a.region - b.region);
    console.log(JSON.stringify(this.#statusList));
    this.#statusList.forEach((stat) => console.log(`[${stat.description}] [${stat.region} ${stat.currentPage}/${stat.maxPage}] | count [${(stat.currentPage * NUM_OF_ROWS > stat.totalCount ? stat.totalCount : stat.currentPage * NUM_OF_ROWS)}/${stat.totalCount}]`.yellow.bgGreen.bold));
    console.log('');
  }
}
