import React from "react";
import connectToStores from "alt/utils/connectToStores";
import { Link } from "react-router";

import RoomSocialButtons from "../components/RoomSocialButtons";
import QuestionSearchBar from "../components/QuestionSearchBar";

import RoomActions from "../actions/RoomActions";
import RoomStore from "../stores/RoomStore";

import QuestionForm from "../components/QuestionForm";
import QuestionList from "../components/QuestionList";

export class InfoColumn extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        location: React.PropTypes.object
    }

    render() {
        return (
            <div>
                <h3 className="text-muted m-b">{ this.props.name }</h3>
                <div className="row">
                    <div className="col-xs-4 col-lg-12 hidden-sm-down">
                        <h6>Popular tags</h6>
                        <ul className="list-unstyled text-muted">
                            <li>#Testing1</li>
                            <li>#Testing2</li>
                            <li>#Testing2</li>
                        </ul>
                    </div>
                    <div className="col-xs-4 col-lg-12 hidden-sm-down">
                        <h6>People are also in...</h6>
                        <ul className="list-unstyled text-muted">
                            <li>ECON2123</li>
                            <li>ACCT2200</li>
                            <li>ENGG1130</li>
                        </ul>
                    </div>
                    <div className="col-xs-4 col-lg-12 hidden-sm-down">
                        <RoomSocialButtons location={ this.props.location } />
                    </div>
                </div>
            </div>
        );
    }
}

@connectToStores
export class RoomPage extends React.Component {
    static propTypes = {
        params: React.PropTypes.object.isRequired,
        location: React.PropTypes.object.isRequired,
        isLoading: React.PropTypes.bool.isRequired,
        name: React.PropTypes.string,
        id: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
                React.PropTypes.arrayOf(React.PropTypes.node),
                React.PropTypes.node
            ])
    };
    state = { isLoading: true, keywords: [], mode: "search", sortOrder: "default" };

    constructor(props) {
        super(props);
        RoomActions.fetch(this.props.params.roomId);
    }

    componentDidMount() {
        const { query } = this.props.location || "";
        if (query.search) this.onSearch([ query.search ]);
    }

    static getStores() { return [ RoomStore ]; }
    static getPropsFromStores() { return RoomStore.getState(); }

    onSearch = (keywords, mode = "search") => {
        this.setState({ keywords, mode });
    }

    sortByDefault = () => { this.setState({ sortOrder: "default" }); }
    sortByVote = () => { this.setState({ sortOrder: "vote" }); }
    sortByDate = () => { this.setState({ sortOrder: "date" }); }

    togglePresentationMode = () => {
        if (this.state.mode !== "presentation") {
            document.body.className = "noscroll";
            this.setState({ mode: "presentation" });
        } else {
            document.body.className = "";
            this.setState({ mode: "search" });
        }
    }

    renderRoomView() {
        const { query } = this.props.location || "";
        return (
                <div className="page page-room">
                    { this.props.children }
                    <div className="container">
                        <div className="fixed-flex-container">
                            <div className="col-fixed-left">
                                <InfoColumn name={ this.props.name } location={ this.props.location } />
                            </div>
                            <div className="col-flex">
                                <div className="row">
                                    <section className="col-xs-12 question-form-container">
                                        <QuestionForm roomId={ this.props.id } onChange={ this.onSearch } />
                                    </section>
                                    <section className={"col-xs-12 question-list-container".concat(this.state.mode === "presentation" ? " list-presentation" : "")}>
                                        {
                                            this.state.mode === "presentation" ?
                                                <div className="btn-presentation-close" onClick={this.togglePresentationMode}><i className="fa fa-2x fa-times" /></div> :
                                                null
                                        }
                                        <QuestionList sortOrder={this.state.sortOrder}
                                            roomId={ this.props.id }
                                            keywords={ this.state.keywords }
                                            mode={ this.state.mode }
                                            onSearch={this.onSearch} />
                                    </section>
                                </div>
                            </div>
                            <div className="m-b col-fixed-right">
                                <QuestionSearchBar ref="qsb" stringQuery={query.search} onSearch={this.onSearch} />
                                <div>
                                    <p className="side-heading text-muted">Sort by</p>
                                    <div className="m-b btn-group btn-group-sm btn-group-sort">
                                        <button type="button" className={"btn btn-primary-outline" + (this.state.sortOrder === "default" ? " active" : "")} onClick={this.sortByDefault}>Default</button>
                                        <button type="button" className={"btn btn-primary-outline" + (this.state.sortOrder === "vote" ? " active" : "")} onClick={this.sortByVote}>Vote</button>
                                        <button type="button" className={"btn btn-primary-outline" + (this.state.sortOrder === "date" ? " active" : "")} onClick={this.sortByDate}>Date</button>
                                    </div>
                                </div>

                                <div className="hidden-sm-down">
                                    <p className="side-heading text-muted">Room Statistics</p>
                                    <div className="m-b btn-group btn-group-sm">
                                        <Link to={"/room/" + this.props.params.roomId + "/stat"}><button type="button" className="btn btn-success">View</button></Link>
                                    </div>
                                </div>

                                <p className="hidden-md-down side-heading text-muted">Presentation Mode</p>
                                <div className="hidden-md-down m-b btn-group btn-group-sm">
                                    <button
                                        type="button"
                                        className="btn btn-info"
                                        onClick={this.togglePresentationMode}>Turn On</button>
                                </div>

                                <p className="hidden-md-down side-heading text-muted">Sponsored Ad</p>
                                <div className="hidden-md-down m-b">
                                    <a target="_blank" href="http://ideamag.net">
                                        <img className="img-responsive" src="/img/imad.png" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
    renderNotFoundView() {
        return (
            <div className="page page-room">
                <div className="container text-center p-y-lg">
                    <img className="img-not-found m-y-lg" src="/img/room-not-found.png" />
                    <p><Link to="/">Go back to home...</Link></p>
                </div>
            </div>
        );
    }
    renderLoadingView() {
        return (
            <div className="page page-room">
                <div className="container text-center p-y-lg">
                    <p className="text-muted m-y-lg p-y-lg">Loading...</p>
                </div>
            </div>
        );
    }
    render() {
        if (this.props.isLoading) {
            return this.renderLoadingView();
        } else if ("id" in this.props && this.props.id) {
            return this.renderRoomView();
        }
        return this.renderNotFoundView();
    }
}

export default RoomPage;
