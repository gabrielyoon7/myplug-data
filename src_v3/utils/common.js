const stationUpsertDoc = (date, raw) => {
  const upsertDoc = {
    updateOne: {
      filter: { _id: { $eq: raw.statId } },
      update: {
        _id: raw.statId,
        api: 'keco',
        date,
        statNm: raw.statNm,
        statId: raw.statId,
        addr: raw.addr,
        location: raw.location,
        useTime: raw.useTime,
        lat: raw.lat,
        lng: raw.lng,
        busiId: raw.busiId,
        bnm: raw.bnm,
        busiNm: raw.busiNm,
        busiCall: raw.busiCall,
        zcode: raw.zcode,
        zscode: raw.zscode,
        kind: raw.kind,
        kindDetail: raw.kindDetail,
        parkingFree: raw.parkingFree,
        note: raw.note,
        limitYn: raw.limitYn,
        limitDetail: raw.limitDetail,
        delYn: raw.delYn,
        delDetail: raw.delDetail,
        distance: 0,
      },
      upsert: true,
    },
  };
  return upsertDoc;
};

const chargerUpsertDoc = (date, raw) => {
  const upsertDoc = {
    updateOne: {
      filter: { _id: { $eq: raw.statId + raw.chgerId } },
      update: {
        _id: raw.statId + raw.chgerId,
        api: 'keco',
        date,
        statNm: raw.statNm,
        statId: raw.statId,
        chgerId: raw.chgerId,
        chgerType: raw.chgerType,
        stat: raw.stat,
        statUpdDt: raw.statUpdDt,
        lastTsdt: raw.lastTsdt,
        lastTedt: raw.lastTsdt,
        nowTsdt: raw.nowTsdt,
        output: raw.output,
        method: raw.method,
      },
      upsert: true,
    },
  };
  return upsertDoc;
};

const defaultTimeTable = {
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

/**
* 사용중인 충전기 업데이트
* @param {*} logId
* @returns
*/
const updateUsingLogDoc = (time, logId) => {
  // https://github.com/Automattic/mongoose/issues/9268 여기 참고해서 다시 도전해보기 --> 해결
  // console.log(logId);
  const { day } = time;
  const { hour } = time;
  const { week } = time;
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
};

/**
* 처음 발견한 충전기에 대한 기본 로그 추가
* @param {*} time
* @param {*} region
* @param {*} newId
* @param {*} raw
* @returns
*/
const insertDefaultLogDoc = (time, region, newId, raw) => {
  const upsertDoc = {
    insertOne: {
      document: {
        _id: newId,
        statId: raw.statId,
        chgerId: raw.chgerId,
        week: time.week,
        region,
        logs: {
          mon: defaultTimeTable,
          tue: defaultTimeTable,
          wed: defaultTimeTable,
          thu: defaultTimeTable,
          fri: defaultTimeTable,
          sat: defaultTimeTable,
          sun: defaultTimeTable,
        },
      },
    },
  };
  return upsertDoc;
};

export {
  stationUpsertDoc, chargerUpsertDoc, updateUsingLogDoc, insertDefaultLogDoc,
};
