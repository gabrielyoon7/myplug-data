import mongoose from "mongoose";

export default class DataManager {
    count = 0;
    constructor() {
        console.log('Data Manager 시작')
        this.connectMongoose();
    }
    async connectMongoose() {
        //  Mongoose Connection (여기서만 해주면 전역 설정 됨 / 1회)
        await mongoose
            .connect(`mongodb://localhost:27017/myplug`, {})
            .then(() => console.log('MongoDB Connected!!'))
            .catch(err => console.log(err));
    }
    run(){
        let a=0
    }
}
