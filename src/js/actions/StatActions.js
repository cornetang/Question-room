import request from "superagent";
import { createActions } from "alt/utils/decorators";
import alt from "../alt";

const API_PATH = "http://ec2-54-254-201-89.ap-southeast-1.compute.amazonaws.com";

@createActions(alt)
export class StatActions {
    fetchBasicStat(roomId, cb) {
        request.get(API_PATH + "/room/" + roomId + "/stat")
            .end((err, res) => {
                    if (err) {
                        this.actions._onFetchingBasicStatFailed(err);
                    } else {
                        this.actions._onFetchingBasicStatSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onFetchingBasicStatSuccess(res) { if (res.ok) return res.body; }
    _onFetchingBasicStatFailed(err) { console.log(err); return err; }

    fetchWeekStat(roomId, cb) {
        request.get(API_PATH + "/room/" + roomId + "/stat/week")
            .end((err, res) => {
                    if (err) {
                        this.actions._onFetchingWeekStatFailed(err);
                    } else {
                        this.actions._onFetchingWeekStatSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onFetchingWeekStatSuccess(res) { if (res.ok) return res.body; }
    _onFetchingWeekStatFailed(err) { console.log(err); return err; }
}

export default StatActions;
