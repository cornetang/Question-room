import { createStore } from "alt/utils/decorators";
import _ from "lodash";
import alt from "../alt";
import QuestionActions from "../actions/QuestionActions";

@createStore(alt)
export class QuestionStore {
    state = { isLoading: true, questions: [] };

    constructor() {
        this.bindListeners({
            fetchAll: QuestionActions._onFetchingSuccess,
            add: QuestionActions._onUploadImageSuccess,
            update: [
                    QuestionActions._onUpVoteSuccess,
                    QuestionActions._onDownVoteSuccess
                ]
        });
    }

    fetchAll = (questions) => { this.setState({ isLoading: false, questions: questions }); }

    update = (question) => {
        if (this.find(question.id)) {
            this.setState({ questions: _.map(this.state.questions, anyQuestion => anyQuestion.id === question.id ? question : anyQuestion) });
        }
    }

    find = (id) => _.findWhere(this.state.questions, { id: id });

    add = (question) => {
        this.setState({
            questions: this.state.questions.concat(_.assign(question, {}))
        });
    }
}

export default QuestionStore;
