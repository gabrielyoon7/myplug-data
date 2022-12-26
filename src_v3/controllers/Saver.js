import { Charger } from '../models/Charger.js';
import { Station } from '../models/Station.js';
import { chargerUpsertDoc, stationUpsertDoc } from '../utils/common.js';
import { STATUS_TYPE } from '../utils/constants.js';
import Logger from './Logger.js';

export default class Saver {
  #statusManager = null;

  #region = null;

  #currentPage = null;

  #rawData = null;

  #stations = [];

  #chargers = [];

  constructor(statusManager, region, currentPage, rawData) {
    this.#statusManager = statusManager;
    this.#region = region;
    this.#currentPage = currentPage;
    this.#rawData = rawData;
  }

  async init() {
    await this.generateDocs();
    this.#statusManager.updateStatus(this.#region, this.#currentPage, STATUS_TYPE.saver, false);
    await Promise.all([
      this.updateStations(),
      this.updateChargers(),
    ]);
    this.#statusManager.updateStatus(this.#region, this.#currentPage, STATUS_TYPE.saver, true);
    this.executeLogger();
  }

  async executeLogger() {
    const logger = new Logger(
      this.#statusManager,
      this.#region,
      this.#currentPage,
      this.#rawData,
    );
    logger.init();
  }

  async generateDocs() {
    const { date } = this.#statusManager.getTime();
    const stationIdSet = new Set();
    await this.#rawData.forEach((raw) => {
      if (!stationIdSet.has(raw.statId)) {
        stationIdSet.add(raw.statId);
        this.#stations.push(stationUpsertDoc(date, raw));
      }
      this.#chargers.push(chargerUpsertDoc(date, raw));
    });
  }

  async updateStations() {
    console.log(`[saver] [Stations] ${this.#currentPage} 정보 업데이트 중 ...`.yellow);
    await Station.bulkWrite(this.#stations).then((bulkWriteOpResult) => {
      console.log(`[saver] [Stations] ${this.#currentPage} MongoDB BULK update OK : ${this.#stations.length}`.green);
    }).catch((err) => {
      console.log(`>> Stations ${this.#currentPage} BULK update error`.red);
      console.log(JSON.stringify(err));
    });
    return null;
  }

  async updateChargers() {
    console.log(`[saver] [Chargers] ${this.#currentPage} 정보 업데이트 중 ...`.yellow);
    await Charger.bulkWrite(this.#chargers).then((bulkWriteOpResult) => {
      console.log(`[saver] [Chargers] ${this.#currentPage} MongoDB BULK update OK : ${this.#chargers.length}`.green);
    }).catch((err) => {
      console.log(`>> Chargers ${this.#currentPage} BULK update error`.red);
      console.log(JSON.stringify(err));
    });
    return null;
  }
}
