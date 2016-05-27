import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router";

import history from "./history";
import alt from "./alt";
import RoomStore from "./stores/RoomStore";
import QuestionStore from "./stores/QuestionStore";
import CommentStore from "./stores/CommentStore";

import App from "./containers/App";
import HomePage from "./containers/HomePage";
import RoomPage from "./containers/RoomPage";
import StatPage from "./containers/StatPage";
import PageNotFound from "./containers/PageNotFound";
import QuestionView from "./containers/QuestionView";

import { solveBrowserCompat } from "./BrowserCompat";

solveBrowserCompat();

ReactDOM.render(
    <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
        <Route path="/" component={App} >
            <IndexRoute component={HomePage} />
            <Route path="room/:roomId/stat" component={StatPage} />
            <Route path="room">
                <Route path=":roomId" component={RoomPage}
                    onLeave={() => {
                        alt.recycle(RoomStore);
                        alt.recycle(QuestionStore);
                    }}>
                    <Route path="question/:questionId" component={QuestionView}
                        onLeave={() => { alt.recycle(CommentStore); }} />
                </Route>
            </Route>
            <Route path="*" component={PageNotFound} />
        </Route>
    </Router>, document.getElementById("react-app"));
