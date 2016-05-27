import { createStore } from "alt/utils/decorators";
import _ from "lodash";
import alt from "../alt";
import QuestionStore from "../stores/QuestionStore";
import QuestionActions from "../actions/QuestionActions";

@createStore(alt)
export class CommentStore {
    state = { question: { comments: [] } }
    constructor() {
        this.bindListeners({
            fetchAll: QuestionActions._onLoadDetailSuccess,
            addComment: QuestionActions._onCommentSuccess
        });
    }
    fetchAll = (question) => { this.waitFor(QuestionStore); this.setState({ question: question }); }
    addComment = (comment) => {
        this.setState({ question: _.merge({}, this.state.question, { comments: this.state.question.comments.push(comment) }) });
    }
}

export default CommentStore;
