// import * as dataManager from './src/dataManager.js'
// dataManager.run();

import mongoose from 'mongoose';
import colors from 'colors';
import DataManager from './src_v3/DataManager.js';

const run = async () => {
  //  Mongoose Connection (여기서만 해주면 전역 설정 됨 / 1회)
  await mongoose
  // .connect(`mongodb+srv://gabrielyoon7:0000@gabrielyoon7.aq0fu.mongodb.net/myplug?retryWrites=true&w=majority`, {})
    .connect('mongodb://localhost:27017/myplug', {})
    .then(() => {
      console.log('MongoDB Connected!!');
      const dataManager = new DataManager();
      dataManager.init();
    })
    .catch((err) => console.log(err));
};

run();
