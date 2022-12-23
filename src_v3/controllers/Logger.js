import { StationLogs } from '../models/StationLogs.js';

export default class Logger {
  #statusManager = null;

  #region = null;

  #currentPage = null;

  #rawData = null;

  #logsForBulk = [];

  #defaultTimeTable = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
  };

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
        this.#logsForBulk.push(this.addDefaultLogJSON(newId, raw));
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
      this.#logsForBulk.push(this.addStat3LogJSON(logId));
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

  /**
 * 사용중인 충전기 업데이트
 * @param {*} logId
 * @returns
 */
  addStat3LogJSON(logId) {
  // https://github.com/Automattic/mongoose/issues/9268 여기 참고해서 다시 도전해보기 --> 해결
  // console.log(logId);
    const { day } = this.#statusManager.getTime();
    const { hour } = this.#statusManager.getTime();
    const { week } = this.#statusManager.getTime();
    const temp = `logs.${day}.${hour}`;
    const doc = {
      updateOne: {
        filter: {
          $and: [
            { _id: { $eq: logId } },
            { week: { $eq: week } },
          ],
        },
        update: {
          $set: {
            [temp]: 1,
          },
        },
      },
    };
    return doc;
  }

  /**
* 처음 발견한 충전기에 대한 기본 로그 추가
* @param {*} newId
* @param {*} raw
* @returns
*/
  addDefaultLogJSON(newId, raw) {
    const upsertDoc = {
      insertOne: {
        document: {
          _id: newId,
          statId: raw.statId,
          chgerId: raw.chgerId,
          week: this.#statusManager.getTime().week,
          region: this.#region,
          logs: {
            mon: this.#defaultTimeTable,
            tue: this.#defaultTimeTable,
            wed: this.#defaultTimeTable,
            thu: this.#defaultTimeTable,
            fri: this.#defaultTimeTable,
            sat: this.#defaultTimeTable,
            sun: this.#defaultTimeTable,
          },
        },
      },
    };
    return upsertDoc;
  }
}
