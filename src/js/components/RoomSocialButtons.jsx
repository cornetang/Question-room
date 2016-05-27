import React from "react";

export const SocialButtons = (props) =>
    <div>
        <h6>Share this room</h6>
        <ul className="list-inline text-muted">
            <li>
                <a className="btn btn-social-media btn-fb"
                    type="icon_link"
                    target="_blank"
                    href={ "http://www.facebook.com/sharer/sharer.php?u=http://qweet.github.io" + props.location.pathname } >
                    <i className="fa fa-lg fa-facebook" />
                </a>
            </li>
            <li>
                <a className="btn btn-social-media btn-tw"
                    type="icon_link"
                    target="_blank"
                    href={ "https://twitter.com/intent/tweet?url=http://qweet.github.io" + props.location.pathname } >
                    <i className="fa fa-lg fa-twitter" />
                </a>
            </li>
            <li>
                <a className="btn btn-social-media btn-at"
                    href={ "mailto:?body=http://qweet.github.io" + props.location.pathname } >
                    <i className="fa fa-lg fa-at" />
                </a>
            </li>
        </ul>
    </div>;

export default SocialButtons;
