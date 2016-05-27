import React from "react";
import RoomSearchBar from "../components/RoomSearchBar";

export class HomePage extends React.Component {
    static propTypes = { history: React.PropTypes.object };

    render() {
        return (
            <div className="page page-home">
                <div className="jumbotron home-cover">
                    <div className="container">
                        <h1 className="m-y-lg text-center">Any question? Just ask here!</h1>
                        <RoomSearchBar history={ this.props.history } />
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
