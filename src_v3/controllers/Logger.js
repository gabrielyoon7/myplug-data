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
    const date = this.#statusManager.getTime();
    this.#statusManager.updateStatus(this.#region, this.#currentPage, 'logger', false);
    console.log(`${this.#region} ${this.#currentPage} 로거 시작`);
    const logs = await StationLogs.find({
      $and: [
        { week: { $eq: date.week } },
        { region: { $eq: this.#region } },
        { statId: { $in: this.#rawData.map((data) => data.statId) } },
      ],
    }, '_id');
    console.log(`[logger] ${this.#currentPage} raw data size : ${this.#rawData.length}`);
    console.log(`[logger] ${this.#currentPage} prev logs size : ${logs.length}`);
    this.#rawData.forEach((raw) => {
      // eslint-disable-next-line no-underscore-dangle
      const index = logs.findIndex((item) => (item._id === `${date.week}${raw.statId}${raw.chgerId}`));
      if (index === -1) {
        this.#logsForBulk.push(this.addDefaultLogJSON(this.#region, date, raw));
      }
    });
    console.log(`[logger] ${this.#currentPage} next logs size : ${this.#logsForBulk.length}`);

    // 신규 충전기에 대한 기본 로그 데이터를 추가해준다.
    await this.addDefaultLogs();

    // 사용중인 충전기들은 요일/시간별로 로그를 업데이트 해준다.
    this.#logsForBulk = [];
    // const tt = this.#rawData.filter((data) => data.stat === '3')[0];
    // console.log(`TTTT : ${JSON.stringify(this.addStat3LogJSON(date, `${date.week}${tt.statId}${tt.chgerId}`))}`); // test
    this.#rawData.filter((data) => data.stat === '3').forEach((data) => {
      this.#logsForBulk.push(this.addStat3LogJSON(date, `${date.week}${data.statId}${data.chgerId}`));
    });
    console.log(`${this.#currentPage} 사용중인 충전기 수 : ${this.#logsForBulk.length}`);
    await this.updateStat3Logs();
    this.#statusManager.updateStatus(this.#region, this.#currentPage, 'logger', true);
  }

  /**
 * 사용중인 충전기 업데이트
 * @param {*} date
 * @param {*} logId
 * @returns
 */
  addStat3LogJSON(date, logId) {
  // https://github.com/Automattic/mongoose/issues/9268 여기 참고해서 다시 도전해보기 --> 해결
  // console.log(logId);
    const { day } = date;
    const { hour } = date;
    const temp = `logs.${day}.${hour}`;
    const doc = {
      updateOne: {
        filter: {
          $and: [
            { _id: { $eq: logId } },
            { week: { $eq: date.week } },
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
* @param {*} region
* @param {*} date
* @param {*} raw
* @returns
*/
  addDefaultLogJSON(region, date, raw) {
    const upsertDoc = {
      updateOne: {
        filter: { _id: { $eq: `${date.week}${raw.statId}${raw.chgerId}` } },
        update: {
          _id: `${date.week}${raw.statId}${raw.chgerId}`,
          statId: raw.statId,
          chgerId: raw.chgerId,
          week: date.week,
          region,
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
        upsert: true,
      },
    };
    return upsertDoc;
  }

  async addDefaultLogs() {
    console.log(`[logger] [신규 충전소 기본 로그 추가] ${this.#currentPage} 기본 로그 데이터 추가 중 ...`.yellow);
    await StationLogs.bulkWrite(this.#logsForBulk).then((bulkWriteOpResult) => {
      console.log(`[logger] [신규 충전소 기본 로그 추가] ${this.#currentPage} MongoDB BULK update OK : ${this.#logsForBulk.length}`.green);
    }).catch((err) => {
      console.log(`>> Logs [신규 충전소 기본 로그 추가] ${this.#currentPage} BULK update error`);
      console.log(JSON.stringify(err));
      console.log(err);
    });
    return null;
  }

  async updateStat3Logs() {
    console.log(`[logger] [사용중인 충전소 로그 업데이트] ${this.#currentPage} 사용중인 충전기 로그 업데이트 중 ...`.yellow);
    await StationLogs.bulkWrite(this.#logsForBulk).then((bulkWriteOpResult) => {
      console.log(`[logger] [사용중인 충전소 로그 업데이트] ${this.#currentPage} MongoDB BULK update OK : ${this.#logsForBulk.length}`.green);
    }).catch((err) => {
      console.log(`>> Logs [사용중인 충전소 로그 업데이트] ${this.#currentPage} BULK update error`);
      console.log(JSON.stringify(err));
    });
    return null;
  }
}
