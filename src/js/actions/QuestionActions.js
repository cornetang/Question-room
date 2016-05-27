import request from "superagent";
import { createActions } from "alt/utils/decorators";
import alt from "../alt";

const API_PATH = "http://ec2-54-254-201-89.ap-southeast-1.compute.amazonaws.com";

@createActions(alt)
export class QuestionActions {
    fetchAll(roomId, cb) {
        request.get(API_PATH + "/room" + "/" + roomId + "/questions")
            .end((err, res) => {
                    if (err) {
                        this.actions._onFetchingFailed(err);
                    } else {
                        this.actions._onFetchingSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onFetchingSuccess(res) { if (res.ok) return res.body; }
    _onFetchingFailed(err) { console.log(err); return err; }

    add(question, file, cb) {
        request.post(API_PATH + "/question")
            .send({
                    "roomId": question.roomId,
                    "message": question.message
                })
            .end((err, res) => {
                    if (err) {
                        this.actions._onAddingFailed(err);
                    } else {
                        if (file) {
                            this.actions.uploadImage(res.body.id, file, cb);
                        } else {
                            this.actions._onAddingSuccess(res);
                            if (typeof cb === "function") cb();
                        }
                    }
                });
    }
    _onAddingSuccess(res) { if (res.ok) return res.body; }
    _onAddingFailed(err) { console.log(err); return err; }

    comment(questionId, msg, cb) {
        request.post(API_PATH + "/comment")
            .send({
                    "questionId": questionId,
                    "message": msg
                })
            .end((err, res) => {
                    if (err) {
                        this.actions._onCommentFailed(err);
                    } else {
                        this.actions._onCommentSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onCommentSuccess(res) { if (res.ok) return res.body; }
    _onCommentFailed(err) { console.log(err); return err; }

    uploadImage(questionId, file, cb) {
        request.post(API_PATH + "/question" + "/" + questionId + "/" + "image")
            .attach("image", file)
            .end((err, res) => {
                    if (err) {
                        this.actions._onUploadImageFailed(err);
                    } else {
                        this.actions._onUploadImageSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onUploadImageSuccess(res) { if (res.ok) return res.body; }
    _onUploadImageFailed(err) { console.log(err); return err; }

    loadDetail(questionId, cb) {
        request.get(API_PATH + "/question/" + questionId)
            .end((err, res) => {
                    if (err) {
                        this.actions._onLoadDetailFailed(err);
                    } else {
                        this.actions._onLoadDetailSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onLoadDetailSuccess(res) { if (res.ok) return res.body; }
    _onLoadDetailFailed(err) { console.log(err); return err; }

    upVote(questionId, cb) {
        if (!questionId || localStorage.getItem(questionId)) { return null; }
        request.put(API_PATH + "/question" + "/" + questionId + "/upVote")
            .end((err, res) => {
                    if (err) {
                        this.actions._onUpVoteFailed(err);
                    } else {
                        localStorage.setItem(questionId, "upVote");
                        this.actions._onUpVoteSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onUpVoteSuccess(res) { if (res.ok) return res.body; }
    _onUpVoteFailed(err) { console.log(err); return err; }

    downVote(questionId, cb) {
        if (!questionId || localStorage.getItem(questionId)) { return null; }
        request.put(API_PATH + "/question" + "/" + questionId + "/downVote")
            .end((err, res) => {
                    if (err) {
                        this.actions._onDownVoteFailed(err);
                    } else {
                        localStorage.setItem(questionId, "downVote");
                        this.actions._onDownVoteSuccess(res);
                        if (typeof cb === "function") cb();
                    }
                });
    }
    _onDownVoteSuccess(res) { if (res.ok) return res.body; }
    _onDownVoteFailed(err) { console.log(err); return err; }
}

export default QuestionActions;
