import request from "superagent";
import { createActions } from "alt/utils/decorators";
import alt from "../alt";
import QuestionActions from "../actions/QuestionActions";

const API_PATH = "http://ec2-54-254-201-89.ap-southeast-1.compute.amazonaws.com";

@createActions(alt)
export class RoomActions {
    fetch(roomId, cb) {
        request.get(API_PATH + "/room" + "/" + roomId)
            .query({ "populate": false })
            .end((err, res) => {
                    if (err) {
                        this.actions._onFetchingFailed(err);
                    } else {
                        this.actions._onFetchingSuccess(res);
                        QuestionActions.fetchAll(res.body.id, cb);
                    }
                });
    }
    _onFetchingSuccess(res) {
        if (res.ok) { return res.body; }
    }
    _onFetchingFailed(err) { console.log(err); return err; }

    add(room) {
        request.post(API_PATH + "/room")
            .send({ "name": room.name })
            .end((err, res) => !err ?
                    this.actions._onAddingSuccess(res) :
                    this.actions._onAddingFailed(err)
                );
    }
    _onAddingSuccess(res) { if (res.ok) return res.body; }
    _onAddingFailed(err) { console.log(err); return err; }
}

export default RoomActions;
