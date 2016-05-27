import React from "react";
import Dropzone from "react-dropzone";
import Spinner from "react-spinner";
import QuestionStore from "../stores/QuestionStore";
import QuestionActions from "../actions/QuestionActions";
import { countWords, findFreqWords } from "../util/WordAlg";

export class QuestionForm extends React.Component {
    static propTypes = {
        roomId: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func
    };

    state = {
        isUploading: false,
        isSimilarSearchEnable: true,
        keywords: [],
        wordCount: 0,
        message: "",
        images: []
    };

    static getStores() { return [ QuestionStore ]; }
    static getPropsFromStores() { return QuestionStore.getState(); }

    addHashtag = (word) => {
        this.processText(this.state.message.replace(new RegExp(word, "g"), "#" + word));
    }

    handleChange = (e) => {
        const input = e.target.value;
        const msgRef = this.refs.message;
        if (msgRef.scrollHeight > msgRef.offsetHeight) ++msgRef.rows;
        else if (input === "") msgRef.rows = 2;
        this.processText(input);
    }

    processText(input) {
        const keywords = findFreqWords(input, 3);
        this.setState({
            wordCount: countWords(input),
            keywords: keywords,
            message: input });
        if (this.state.isSimilarSearchEnable) {
            this.props.onChange(keywords, "similar");
        }
    }

    handleDrop = (files) => { this.setState({ images: files }); }

    handleSubmit = (e) => {
        e.preventDefault();
        const message = this.refs.message.value.trim();
        if (!message) { return; }
        this.setState({ isUploading: true });

        QuestionActions.add(
            { roomId: this.props.roomId, message },
            this.state.images[0],
            () => { this.clearForm(); }
        );
    }

    clearForm = () => {
        this.setState({
            wordCount: 0,
            isUploading: false,
            keywords: [],
            message: "",
            images: [] });
        this.props.onChange([]);
    }

    toggleSimilarSearch = () => {
        const curState = this.state.isSimilarSearchEnable;
        if (curState) this.props.onChange([], "search");
        this.setState({ isSimilarSearchEnable: !curState });
    }

    render() {
        return (
            <form className="question-form p-b-md"
                onSubmit={ this.handleSubmit }>
                {
                    this.state.isUploading ?
                        <div className="form-spinner-container"><Spinner /></div> : null
                }
                <label className="sr-only">Message</label>
                <textarea ref="message"
                    className="form-control input-bundle-textarea"
                    value={ this.state.message }
                    placeholder="Ask any question here..."
                    rows={ 2 }
                    onChange={ this.handleChange } />
                <div className="form-control input-bundle-stat text-muted">
                    <small>
                        <span className="hidden-xs-down hashtag-suggestion pull-left">
                            { this.state.keywords.length > 0 ?
                                "Suggested hashtag: " : null }
                            { this.state.keywords.map(k =>
                                <a
                                    key={k}
                                    className="suggested-tag"
                                    onClick={this.addHashtag.bind(this, k)}>
                                    {"#" + k}
                                </a>) }</span>
                        <span>
                            { this.state.wordCount }
                        </span> words
                    </small>
                </div>
                {
                    this.state.images.length > 0 ?
                        <div className="input-bundle-preview text-right">
                            {
                                this.state.images.map(f =>
                                    <img key={ f.name }
                                        className="image-preview"
                                        src={ f.preview } />)
                            }
                        </div> : null
                }
                <div className="input-bundle-bottom text-right">
                    <Dropzone className="btn-toolbar pull-left"
                        accept="image/gif, image/jpeg, image/png"
                        onDrop={ this.handleDrop }
                        multiple={false}>
                        <i className="fa fa-picture-o" />
                    </Dropzone>
                    <div className="btn-toolbar pull-left">
                        <i className="fa fa-tasks" />
                    </div>
                    <button type="submit"
                        className="btn btn-primary pull-right btn-post">Post</button>
                    <button type="reset"
                        className="btn btn-secondary pull-right btn-clear"
                        onClick={ this.clearForm }>Clear</button>
                    <div className="btn-toolbar btn-similar pull-right"
                        onClick={ this.toggleSimilarSearch }>
                        <i className={ this.state.isSimilarSearchEnable ?
                            "fa fa-check-square" : "fa fa-square" } /> <small>Show similar questions</small>
                    </div>
                </div>
            </form>
        );
    }
}

export default QuestionForm;
