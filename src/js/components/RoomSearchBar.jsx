import React from "react";
import _ from "lodash";
import connectToStores from "alt/utils/connectToStores";
import Modal from "react-modal";
import Autosuggest from "react-autosuggest";
import RoomSearchActions from "../actions/RoomSearchActions";
import RoomSearchStore from "../stores/RoomSearchStore";
import RoomActions from "../actions/RoomActions";
import RoomStore from "../stores/RoomStore";

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(64, 64, 64, 0.3)",
        zIndex: 1100
    },
    content: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        order: 1,
        height: "9rem",
        maxWidth: "32rem",
        margin: "11rem auto 0",
        color: "#555",
        border: "1px solid #ccc",
        background: "rgba(240, 240, 240, 0.95)",
        overflow: "hidden",
        WebkitOverflowScrolling: "touch",
        borderRadius: 0,
        outline: "none",
        padding: "1.2rem",
        textAlign: "center"
    }
};

@connectToStores
export class RoomSearchBar extends React.Component {
    static propTypes = {
        rooms: React.PropTypes.arrayOf(React.PropTypes.object),
        history: React.PropTypes.object.isRequired
    }
    state = { modalIsOpen: false, value: "", room: null };

    constructor(props) {
        super(props);
        RoomSearchActions.fetchAll();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.willEnter) {
            this.props.history.pushState({}, "/room/" + nextProps.willEnter);
        }
    }

    static getStores() { return [ RoomSearchStore, RoomStore ]; }
    static getPropsFromStores() {
        return _.merge({},
            RoomSearchStore.getState(),
            { willEnter: RoomStore.getState().id });
    }

    getHint() {
        if (this.state.roomFounded) {
            return "Room found. You can enter the room now.";
        }
        return this.state.value.length > 0 && this.state.value.length < 6 ?
            "This name is too short." :
            "Type a name to enter/create a room.";
    }

    getSuggestions = (input, cb) => {
        const regex = new RegExp("^" + input, "i");
        cb(null, this.props.rooms.filter(room => regex.test(room.name)).slice(0, 8));
    }
    getSuggestionValue = (room) => { return room.name; }
    renderSuggestion = (room, input) => {
        return (
            <span>
                <strong>{ room.name.slice(0, input.length) }</strong>
                { room.name.slice(input.length) }
            </span>
        );
    }

    openModal = () => { this.setState({ modalIsOpen: true }); }
    closeModal = () => { this.setState({ modalIsOpen: false }); }
    enterRoom = () => { RoomActions.add({ name: this.state.value }); }

    handleChange = (input) => {
        this.setState({ value: input });
        if (input) {
            const room = _.findWhere(this.props.rooms, { name: input });
            if (room && "id" in room && room.id) {
                this.setState({ roomFounded: room });
            } else {
                this.setState({ roomFounded: null });
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.roomFounded) {
            this.props.history.pushState({}, "/room/" + this.state.roomFounded.id);
        } else if (this.state.value && this.state.value.length > 5) {
            this.openModal();
        }
    }

    render() {
        const inputAttr = {
            type: "search",
            className: "form-control input-search",
            placeholder: "Tell me your room name...",
            onChange: this.handleChange
        };
        return (
            <form className="form-search p-t-md" onSubmit={ this.handleSubmit }>
                <p className="form-search-hint text-center">
                    { this.getHint() }</p>
                <div className="input-group">
                    <label className="sr-only">Search Room</label>
                    <Autosuggest suggestions={ this.getSuggestions }
                        suggestionValue={ this.getSuggestionValue }
                        suggestionRenderer={ this.renderSuggestion }
                        value={ this.state.value }
                        showWhen={ input => input.trim().length > 0 }
                        inputAttributes={ inputAttr } />
                    <span className="input-group-btn input-group-btn-search">
                        <button type="submit"
                            className="btn btn-primary">Enter</button>
                    </span>
                </div>
                <Modal isOpen={ this.state.modalIsOpen }
                    onRequestClose={ this.closeModal }
                    style={ modalStyles }>
                    <p>A new room { `"${this.state.value}"` } will be created. Are you sure?</p>
                    <p className="btn-group-inline m-y-0">
                        <button type="button"
                            className="btn btn-primary btn-square"
                            onClick={ this.enterRoom }>Okay</button>
                        <button type="button"
                            className="btn btn-secondary btn-square"
                            onClick={ this.closeModal }>Close</button>
                    </p>
                </Modal>
            </form>
        );
    }
}

export default RoomSearchBar;
