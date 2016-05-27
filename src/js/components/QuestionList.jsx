import React from "react";
import { Link } from "react-router";
import _ from "lodash";
import moment from "moment";
import connectToStores from "alt/utils/connectToStores";
import Fuse from "fuse.js";
import Spinner from "react-spinner";
import QuestionStore from "../stores/QuestionStore";
import QuestionActions from "../actions/QuestionActions";

export class QuestionListItem extends React.Component {
    static propTypes = {
        question: React.PropTypes.object.isRequired,
        onSearch: React.PropTypes.func
    };
    state = { isLoading: false }

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

    handleUpVote = (e) => {
        e.preventDefault();
        if (localStorage.getItem(this.props.question.id)) return;
        this.setState({ isLoading: true });
        QuestionActions.upVote(this.props.question.id, () => {
                this.setState({ isLoading: false });
            });
    }

    handleDownVote = (e) => {
        e.preventDefault();
        if (localStorage.getItem(this.props.question.id)) return;
        this.setState({ isLoading: true });
        QuestionActions.downVote(this.props.question.id, () => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        const shouldDisableVote = localStorage.getItem(this.props.question.id);
        return (
            <div className="card card-block question-list-item">
                {
                    this.state.isLoading ?
                        <div className="list-spinner-container"><Spinner /></div> : null
                }
                <div className="col-main">
                    <div className="row-flex">
                        { _.words(this.props.question.message, /[^, ]+/g)
                            .map((w, i) => {
                                const hashtag = w.match(/#[A-Z][A-Z0-9]+/gi);
                                const tag = hashtag ? _.trimLeft(hashtag[0], "#") : hashtag;
                                return tag ?
                                    <span key={i}>
                                        <a className="hashtag" href={"/room/" + this.props.question.roomId + "?search=" + tag}>{hashtag}</a>
                                        {w.substring(tag.length + 1) + " "}
                                    </span> :
                                    <span key={i}>{w + " "}</span>;
                                })
                        }
                        { this.props.question.image ?
                            <img className="question-image img-responsive" src={this.props.question.image} /> :
                            null }
                        { "pollOptions" in this.props.question && this.props.question.pollOptions ?
                            <div>{this.props.question.pollOptions}</div> : null
                        }
                    </div>
                    <div className="row-bottom text-muted">
                        {
                            this.props.onSearch ?
                                <Link to={"/room/" + this.props.question.roomId + "/question/" + this.props.question.id}>View detail</Link> : null
                        }
                        <br/>
                        {
                            this.props.question.numOfComments ?
                                this.props.question.numOfComments + " comment(s)・" : "No comment・"
                        }
                        { this.getTimeString(this.props.question.createdAt) }
                    </div>
                </div>
                <div className={ "col-side".concat(shouldDisableVote ?
                    " vote-disabled" : "") }>
                    <div><i className="fa fa-3x fa-caret-up btn-upvote"
                        onClick={ this.handleUpVote } /></div>
                    <div>{ this.props.question.upVote - this.props.question.downVote }</div>
                    <div><i className="fa fa-3x fa-caret-down btn-downvote"
                        onClick={ this.handleDownVote } /></div>
                </div>
            </div>
        );
    }
}

@connectToStores
export class QuestionList extends React.Component {
    static propTypes = {
        keywords: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        mode: React.PropTypes.string.isRequired,
        onSearch: React.PropTypes.func,
        sortOrder: React.PropTypes.string,
        roomId: React.PropTypes.string.isRequired,
        isLoading: React.PropTypes.bool.isRequired,
        questions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    }
    state = { sortOrder: "default" }

    static getStores() { return [ QuestionStore ]; }
    static getPropsFromStores() { return QuestionStore.getState(); }

    renderSimilar() {
        const result = new Fuse(this.props.questions, { keys: [ "message" ] })
            .search(this.props.keywords.join(" ").slice(0, 32));
        if (!result.length) {
            return <div className="text-muted text-center m-y-lg">No similar question.</div>;
        }
        return (
            <div>
                <h5 className="text-muted m-b">Similar Question(s)</h5>
                {
                    result.map(q =>
                        <QuestionListItem key={q.id} question={q} onSearch={this.props.onSearch}/>
                    )
                }
            </div>
        );
    }

    renderItem(data) {
        if (this.props.sortOrder === "date") {
            return _.chain(data)
                .sortByOrder(q => q.createdAt, "desc")
                .map(q => <QuestionListItem key={q.id} question={q} onSearch={this.props.onSearch}/>)
                .value();
        }
        if (this.props.sortOrder === "vote") {
            return _.chain(data)
                .sortByOrder(q => (q.upVote - q.downVote), "desc")
                .map(q => <QuestionListItem key={q.id} question={q} onSearch={this.props.onSearch}/>)
                .value();
        }
        return _.chain(data)
            .sortByOrder(q => q.score, "desc")
            .map(q => <QuestionListItem key={q.id} question={q} onSearch={this.props.onSearch}/>)
            .value();
    }

    renderDefault() {
        let result = this.props.questions;
        if (!result.length) {
            return <div className="text-muted text-center m-y-lg">No question avaiable.</div>;
        }

        if (this.props.keywords.length && this.props.keywords[0]) {
            result = new Fuse(this.props.questions, { keys: [ "message" ] })
                .search(this.props.keywords.join(" ").slice(0, 32));
        }
        if (!result.length) {
            return <div className="text-muted text-center m-y-lg">No question matches your search keyword(s).</div>;
        }
        return (
            <div className="question-list">{ this.renderItem(result) }</div>
        );
    }

    render() {
        if (this.props.isLoading) {
            return <div className="text-muted text-center m-y-lg">Loading questions...</div>;
        }
        if (this.props.keywords.length > 0 && this.props.mode === "similar") {
            return this.renderSimilar();
        }
        return this.renderDefault();
    }
}

export default QuestionList;
