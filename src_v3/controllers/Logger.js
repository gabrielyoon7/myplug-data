import { StationLogs } from '../models/StationLogs.js';
import { insertDefaultLogDoc, updateUsingLogDoc } from '../utils/common.js';

export default class Logger {
  #statusManager = null;

  #region = null;

  #currentPage = null;

  #rawData = null;

  #logsForBulk = [];

  constructor(statusManager, region, currentPage, rawData) {
    this.#statusManager = statusManager;
    this.#region = region;
    this.#currentPage = currentPage;
    this.#rawData = rawData;
  }

  async init() {
    this.#statusManager.updateStatus(this.#region, this.#currentPage, 'logger', false);
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
        this.#logsForBulk.push(
          insertDefaultLogDoc(this.#statusManager.getTime(), this.#region, newId, raw),
        );
      }
    });
    console.log(`[logger] ${this.#region + this.#currentPage} next logs size : ${this.#logsForBulk.length}`);
    await StationLogs.bulkWrite(this.#logsForBulk).then((bulkWriteOpResult) => {
      console.log(`[logger] [신규 충전소 기본 로그 추가] ${this.#region + this.#currentPage} MongoDB BULK update OK : ${this.#logsForBulk.length}`.green);
    }).catch((err) => {
      console.log(`>> Logs [신규 충전소 기본 로그 추가] ${this.#region + this.#currentPage} BULK update error`);
      console.log(JSON.stringify(err));
      console.log(err);
    });
    this.#logsForBulk = [];
    this.#rawData.filter((data) => data.stat === '3').forEach((raw) => {
      const logId = `${date.week}${raw.statId}${raw.chgerId}`;
      this.#logsForBulk.push(
        updateUsingLogDoc(this.#statusManager.getTime(), logId),
      );
    });
    console.log(`${this.#region + this.#currentPage} 사용중인 충전기 수 : ${this.#logsForBulk.length}`);
    await StationLogs.bulkWrite(this.#logsForBulk).then((bulkWriteOpResult) => {
      console.log(`[logger] [사용중인 충전소 로그 업데이트] ${this.#region + this.#currentPage} MongoDB BULK update OK : ${this.#logsForBulk.length}`.green);
    }).catch((err) => {
      console.log(`>> Logs [사용중인 충전소 로그 업데이트] ${this.#region + this.#currentPage} BULK update error`);
      console.log(JSON.stringify(err));
    });
    this.#statusManager.updateStatus(this.#region, this.#currentPage, 'logger', true);
  }
}
