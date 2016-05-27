import React from "react";
import _ from "lodash";
import moment from "moment";
import connectToStores from "alt/utils/connectToStores";
import history from "../history";
import { QuestionListItem } from "../components/QuestionList";
import CommentStore from "../stores/CommentStore";
import QuestionActions from "../actions/QuestionActions";

export class CommentView extends React.Component {
    static propTypes = { message: React.PropTypes.string.isRequired, createdAt: React.PropTypes.string.isRequired }

    getTimeString = (ISODateString) => {
        const createdMoment = moment(ISODateString);
        return moment().diff(createdMoment, "hours") > 20 ?
            createdMoment.calendar(null, {
                sameDay: "[Today at] h:mma",
                nextDay: "[Unknown Date]",
                nextWeek: "[Unknown Date]",
                lastDay: "[Yesterday at] h:mma",
                lastWeek: "[Last] dddd [at] h:mma",
                sameElse: "MMMM D [at] h:mma"
            }) : createdMoment.fromNow();
    }

    render() {
        return (
            <div className="card card-block question-list-item">
                <div style={{ width: "100%" }}>{this.props.message}<span className="pull-right text-muted">{this.getTimeString(this.props.createdAt)}</span></div>
            </div>
        );
    }
}

export class CommentInput extends React.Component {
    static propTypes = { questionId: React.PropTypes.string }
    state = { message: "", isUploading: false }

    handleChange = (e) => {
        const input = e.target.value;
        const msgRef = this.refs.message;
        if (msgRef.scrollHeight > msgRef.offsetHeight) ++msgRef.rows;
        else if (input === "") msgRef.rows = 2;
        this.setState({ message: input });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const message = this.refs.message.value.trim();
        if (!message) { return; }
        this.setState({ isUploading: true });
        QuestionActions.comment(this.props.questionId, message, () => { this.clearForm(); });
        window.location.reload();
    }

    clearForm = () => { this.setState({ message: "" }); }

    render() {
        return (
            <form className="card card-block question-list-item" onSubmit={this.handleSubmit}>
                <textarea
                    ref="message"
                    className="form-control comment-textarea"
                    value={this.state.message}
                    placeholder="Comment here..."
                    rows={3}
                    onChange={this.handleChange} /><br />
                <button type="submit" className="btn btn-primary btn-comment">Comment</button>
            </form>
        );
    }
}

@connectToStores
export class QuestionView extends React.Component {
    static propTypes = {
        params: React.PropTypes.object.isRequired,
        question: React.PropTypes.object
    }
    state = { isLoading: true }

    constructor(props) {
        super(props);
        document.body.className = "noscroll";
        QuestionActions.loadDetail(this.props.params.questionId, () => { this.setState({ isLoading: false }); });
    }

    static getStores() { return [ CommentStore ]; }
    static getPropsFromStores() { return CommentStore.getState(); }

    closeModal = () => {
        history.pushState({}, "/room/" + this.props.params.roomId);
        document.body.className = "";
    }

    render() {
        const q = this.props.question;
        return (
            <div className="list-presentation p-x" style={{ zIndex: 1200 }}>
                <div className="btn-presentation-close" onClick={this.closeModal}><i className="fa fa-2x fa-times" /></div>
                <div className="question-list">
                    {
                        this.state.isLoading || !q ?
                            <p className="question-detail-loading">Loading...</p> :
                            <div>
                                <QuestionListItem question={q} />
                                <h6 className="m-t" style={{ color: "white" }}>Comment</h6>
                                { _.sortBy(q.comments, m => m.createdAt).map((m, i) =>
                                    <CommentView key={i} message={m.message} createdAt={m.createdAt} />) }
                                <CommentInput questionId={q.id} />
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default QuestionView;
