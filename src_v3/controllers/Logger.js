import { StationLogs } from '../models/StationLogs.js';
import { insertDefaultLogDoc, updateUsingLogDoc } from '../utils/common.js';
import { STATUS_TYPE, USING_STATUS } from '../utils/constants.js';

export default class Logger {
  #statusManager = null;

  #region = null;

  #currentPage = null;

  #rawData = null;

  #newBulkDocs = [];

  #usingBulkDocs = [];

  constructor(statusManager, region, currentPage, rawData) {
    this.#statusManager = statusManager;
    this.#region = region;
    this.#currentPage = currentPage;
    this.#rawData = rawData;
  }

  async init() {
    this.#statusManager.updateStatus(this.#region, this.#currentPage, STATUS_TYPE.logger, false);
    await this.generateInsertDocs();
    await this.insertNewLogs();
    await this.generateUpdateDocs();
    await this.updateUsingLogs();
    this.#statusManager.updateStatus(this.#region, this.#currentPage, STATUS_TYPE.logger, true);
  }

  async generateInsertDocs() {
    const date = this.#statusManager.getTime();
    // console.log(`${date.week}${this.#rawData[0].statId}${this.#rawData[0].chgerId}`);
    const logs = await StationLogs.find({
      $and: [
        { week: { $eq: date.week } },
        { region: { $eq: this.#region } },
        { statId: { $in: this.#rawData.map((data) => data.statId) } },
      ],
    }, '_id');
    console.log(`[logger] ${this.#region + this.#currentPage} prev logs size : ${logs.length}`);
    console.log(`[logger] ${this.#region + this.#currentPage} raw size : ${this.#rawData.length}`);
    this.#rawData.forEach((raw) => {
      const newId = `${date.week}${raw.statId}${raw.chgerId}`;
      // eslint-disable-next-line no-underscore-dangle
      const index = logs.findIndex((item) => (item._id === newId));
      if (index === -1) {
        this.#newBulkDocs.push(
          insertDefaultLogDoc(this.#statusManager.getTime(), this.#region, newId, raw),
        );
      }
    });
    console.log(`[logger] ${this.#region + this.#currentPage} next logs size : ${this.#newBulkDocs.length}`);
  }

  async insertNewLogs() {
    await StationLogs.bulkWrite(this.#newBulkDocs).then((bulkWriteOpResult) => {
      console.log(`[logger] [신규 충전소 기본 로그 추가] ${this.#region + this.#currentPage} MongoDB BULK update OK : ${this.#newBulkDocs.length}`.green);
    }).catch((err) => {
      console.log(`>> Logs [신규 충전소 기본 로그 추가] ${this.#region + this.#currentPage} BULK update error`);
      console.log(JSON.stringify(err));
      console.log(err);
    });
  }

  async generateUpdateDocs() {
    const date = this.#statusManager.getTime();
    this.#rawData.filter((data) => data.stat === USING_STATUS).forEach((raw) => {
      const logId = `${date.week}${raw.statId}${raw.chgerId}`;
      this.#usingBulkDocs.push(
        updateUsingLogDoc(this.#statusManager.getTime(), logId),
      );
    });
    console.log(`${this.#region + this.#currentPage} 사용중인 충전기 수 : ${this.#usingBulkDocs.length}`);
  }

  async updateUsingLogs() {
    await StationLogs.bulkWrite(this.#usingBulkDocs).then((bulkWriteOpResult) => {
      console.log(`[logger] [사용중인 충전소 로그 업데이트] ${this.#region + this.#currentPage} MongoDB BULK update OK : ${this.#usingBulkDocs.length}`.green);
    }).catch((err) => {
      console.log(`>> Logs [사용중인 충전소 로그 업데이트] ${this.#region + this.#currentPage} BULK update error`);
      console.log(JSON.stringify(err));
    });
  }
}
