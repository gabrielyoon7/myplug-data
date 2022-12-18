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

export { stationUpsertDoc, chargerUpsertDoc };
