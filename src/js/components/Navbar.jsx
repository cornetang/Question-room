import React from "react";
import { Link } from "react-router";

export class Navbar extends React.Component {
    static propTypes = { className: React.PropTypes.string };

    getClassName() {
        return "navbar navbar-fixed-top".concat(
            this.props.className ? " " + this.props.className : "");
    }
    render() {
        return (
            <header className={ this.getClassName() }>
                <div className="container">
                    <span className="navbar-brand">
                        <Link to="/"><div className="navbar-brand-img" /></Link>
                    </span>
                </div>
            </header>
        );
    }
}

export default Navbar;
