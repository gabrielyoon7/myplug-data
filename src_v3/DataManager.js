import { generateTimeObject } from "./utils/time.js";

export default class DataManager {
    #count = 0;
    #time=null;
    constructor() {
        console.log('Data Manager 시작')
    }
    async init() {
        while (true) {
            this.#count++;
            console.log(this.#count);
            this.#time=generateTimeObject();
            await this.delay(10 * 60).then(() => console.log('대기 끝')); //대기시간 n*60초
        }
    }
    delay(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 30));
    }

}
