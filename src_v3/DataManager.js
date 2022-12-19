/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import Receiver from './controllers/Receiver.js';
import StatusManager from './utils/StatusManager.js';

export default class DataManager {
  #count = 0;

  #statusManager = null;

  constructor() {
    console.log('Data Manager 시작');
  }

  async init() {
    while (true) {
      this.#statusManager = new StatusManager();
      this.#count += 1;
      console.log(`${this.#count}번째 수집중`);
      const receiver = new Receiver(this.#statusManager);
      receiver.init();
      await this.delay(10 * 60).then(() => console.log('대기 끝')); // 대기시간 n*60초
    }
  }

  delay(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 30));
  }
}
