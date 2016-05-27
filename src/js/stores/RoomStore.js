import { createStore } from "alt/utils/decorators";
import _ from "lodash";
import alt from "../alt";
import RoomActions from "../actions/RoomActions";

@createStore(alt)
export class RoomStore {
    state = { isLoading: true }

    constructor() {
        this.bindListeners({
            fetch: RoomActions._onFetchingSuccess,
            error: RoomActions._onFetchingFailed,
            add: RoomActions._onAddingSuccess
        });
    }

    fetch = (room) => { this.setState(_.assign(room, { isLoading: false })); }
    add = (room) => { this.setState(_.assign(room, { isLoading: false })); }
    error = () => { this.setState({ isLoading: false }); }
}

export default RoomStore;
