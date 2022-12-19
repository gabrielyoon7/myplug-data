import { chargerUpsertDoc, stationUpsertDoc } from '../utils/common.js';

export default class Saver {
  #statusManager = null;

  #region = null;

  #currentPage = null;

  #rawData = null;

  #stations = [];

  #chargers = [];

  #stationIdSet = new Set();

  constructor(statusManager, region, currentPage, rawData) {
    this.#statusManager = statusManager;
    this.#region = region;
    this.#currentPage = currentPage;
    this.#rawData = rawData;
  }

  async init() {
    const { date } = this.#statusManager.getTime();
    await this.#rawData.forEach((raw) => {
      if (!this.#stationIdSet.has(raw.statId)) {
        this.#stationIdSet.add(raw.statId);
        this.#stations.push(stationUpsertDoc(date, raw));
      }
      this.#chargers.push(chargerUpsertDoc(date, raw));
    });
  }

  async updateStations() {

  }

  async updateChargers() {

  }
}
