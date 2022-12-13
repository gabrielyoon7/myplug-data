import Receiver from './controller/Receiver.js';
import { generateTimeObject } from './utils/time.js';

export default class DataManager {
  #count = 0;

  #time = null;

  constructor() {
    console.log('Data Manager 시작');
  }

  async init() {
    while (true) {
      this.#count += 1;
      console.log(this.#count);
      this.#time = generateTimeObject();
      const receiver = new Receiver(this.#time);
      receiver.init();
      await this.delay(10 * 60).then(() => console.log('대기 끝')); // 대기시간 n*60초
    }
  }

  delay(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 30));
  }
}
