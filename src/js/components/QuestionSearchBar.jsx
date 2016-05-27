import React from "react";
import _ from "lodash";

export class QuestionSearchBar extends React.Component {
    static propTypes = { stringQuery: React.PropTypes.string, onSearch: React.PropTypes.func }
    state = { value: this.props.stringQuery };

    handleChange = (e) => {
        const input = e.target.value;
        if (!input) this.clearForm();
        this.setState({ value: input });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSearch(this.state.value.split(" ").map(w => _.trimLeft(w, "#")), "search");
    }

    clearForm = () => {
        this.setState({ value: "" });
        this.props.onSearch([], "search");
    }

    render() {
        return (
            <div>
                <p className="side-heading text-muted">Search</p>
                <form className="m-b input-group question-search-form" onSubmit={ this.handleSubmit }>
                    <input className="form-control question-searchbar"
                        type="search"
                        value={ this.state.value }
                        placeholder="Enter #hashtags"
                        onChange={ this.handleChange } />
                    {
                        this.state.value ?
                        <button className="input-group-addon icon-reset"
                            type="reset"
                            onClick={ this.clearForm }>
                            <i className="fa fa-times" />
                        </button> : null
                    }
                    <button className="input-group-addon icon-search"
                        type="submit">
                        <i className="fa fa-search" />
                    </button>
                </form>
            </div>
        );
    }
}

export default QuestionSearchBar;
