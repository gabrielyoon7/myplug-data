export default class Logger {
  #statusManager = null;

  #region = null;

  #currentPage = null;

  #rawData = null;

  constructor(statusManager, region, currentPage, rawData) {
    this.#statusManager = statusManager;
    this.#region = region;
    this.#currentPage = currentPage;
    this.#rawData = rawData;
  }

  async init() {
    console.log(`${this.#region} ${this.#currentPage} 로거 시작`);
  }
}
