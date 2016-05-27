import { createStore } from "alt/utils/decorators";
import alt from "../alt";
import RoomActions from "../actions/RoomSearchActions";

@createStore(alt)
export class RoomSearchStore {
    state = { rooms: [] };

    constructor() {
        this.bindListeners({ fetchAll: RoomActions._onFetchingSuccess });
    }

    fetchAll = (rooms) => { this.setState({ rooms: rooms }); }
}

export default RoomSearchStore;
