import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.oneOfType([
                React.PropTypes.arrayOf(React.PropTypes.node),
                React.PropTypes.node
            ])
    };
    render() {
        return (
            <div className="site">
                <Navbar />
                <main className="site-content">
                    { this.props.children }
                </main>
                <Footer />
            </div>
        );
    }
}

export default App;
