import { createStore } from "alt/utils/decorators";
import alt from "../alt";
import StatActions from "../actions/StatActions";

@createStore(alt)
export class StatStore {
    state = { basicStat: {}, weekStat: {} }
    constructor() {
        this.bindListeners({
            fetchBasicStat: StatActions._onFetchingBasicStatSuccess,
            fetchWeekStat: StatActions._onFetchingWeekStatSuccess
        });
    }
    fetchBasicStat = (stat) => { this.setState({ basicStat: stat }); }
    fetchWeekStat = (stat) => { this.setState({ weekStat: stat.weeklyStat }); }
}

export default StatStore;
