import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import connectToStores from "alt/utils/connectToStores";
import Chart from "chart.js";
import StatActions from "../actions/StatActions";
import StatStore from "../stores/StatStore";

@connectToStores
export class StatPage extends React.Component {
    static propTypes = {
        params: React.PropTypes.object.isRequired,
        basicStat: React.PropTypes.object,
        weekStat: React.PropTypes.object
    }
    state = { isLoading: true, canvas: null }

    static getStores() { return [ StatStore ]; }
    static getPropsFromStores() { return StatStore.getState(); }

    componentDidMount() {
        StatActions.fetchWeekStat(this.props.params.roomId, () => {
            const canvas = ReactDOM.findDOMNode(this.refs.weekStat);
            const ctx = canvas.getContext("2d");
            const data = this.props.weekStat;
            const chartData = {
                labels: _.keys(data),
                datasets: [
                    { data: _.values(data).map(obj => obj.number) }
                ]
            };
            console.log(chartData);
            new Chart(ctx).Line(chartData, { scaleBeginAtZero: true });
            this.setState({ isLoading: false });
        });
        StatActions.fetchBasicStat(this.props.params.roomId);
    }

    renderStatView() {
        return (
                <div className="page page-room">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-3" style={{ width: "8rem" }}>
                                Total questions: { this.props.basicStat.questionTotal }<br />
                                Total comments: { this.props.basicStat.commentTotal }
                            </div>
                            <div className="col-xs-3" style={{ width: "8rem" }}>
                                Total upvotes: { this.props.basicStat.upVoteTotal}<br />
                                Total downvotes: {this.props.basicStat.downVoteTotal}
                            </div>
                            <div className="col-xs-3" style={{ width: "8rem" }}>
                                Total tags: { this.props.basicStat.tagTotal}
                            </div>
                            <canvas className="col-xs-12 m-t-md" ref="weekStat" style={{ width: "100%" }} />
                        </div>
                    </div>
                </div>
        );
    }
    render() {
        return this.renderStatView();
    }
}

export default StatPage;
