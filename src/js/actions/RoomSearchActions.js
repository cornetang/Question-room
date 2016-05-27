import request from "superagent";
import { createActions } from "alt/utils/decorators";
import alt from "../alt";

const API_PATH = "http://ec2-54-254-201-89.ap-southeast-1.compute.amazonaws.com";

@createActions(alt)
export class RoomSearchActions {
    fetchAll() {
        request.get(API_PATH + "/room")
            .query({ "populate": false })
            .end((err, res) => err ?
                    this.actions._onFetchingFailed(err) :
                    this.actions._onFetchingSuccess(res)
                );
    }
    _onFetchingSuccess(res) { if (res.ok) return res.body; }
    _onFetchingFailed(err) { console.log(err); return err; }
}

export default RoomSearchActions;
