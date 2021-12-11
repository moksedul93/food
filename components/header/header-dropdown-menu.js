import Header from "./index";
import React, {useState} from "react";

const HeaderDropDownMenu = props => {
    const toggle = e => {
        document.querySelector('#header-right-dropdown-menu').classList.toggle('d-block');
    }


    return (
        <li className="dropdown">
            <a className="nav-link dropdown-toggle nav-link-lg nav-link-user header-link" onClick={toggle}>
            <img src={props.icon} alt=""
                 className="rounded-circle mr-1"/>

            <div className="d-sm-none d-lg-inline-block">{props.title}</div></a>
            <div className="dropdown-menu dropdown-menu-right" id="header-right-dropdown-menu">
                {props.children}
            </div>
        </li>
    )
}

export default HeaderDropDownMenu