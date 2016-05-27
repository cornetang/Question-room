import React from "react";
import { Link } from "react-router";

export class PageNotFound extends React.Component {
    render() {
        return (
            <div className="page page-room">
                <div className="container text-center p-y-lg">
                    <img className="img-not-found m-y-lg" src="/img/404.png" />
                    <p><Link to="/">Go back to home...</Link></p>
                </div>
            </div>
        );
    }
}

export default PageNotFound;
