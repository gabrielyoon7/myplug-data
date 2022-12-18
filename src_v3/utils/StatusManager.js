import { generateTimeObject } from './time.js';

export default class StatusManager {
  #time = null;

  #statusList = [];

  constructor() {
    this.#time = generateTimeObject();
  }

  addStatus(stat) {
    this.#statusList.push(stat);
  }

  getStatus() {
    return this.#statusList;
  }

  getTime() {
    return this.#time;
  }
}
