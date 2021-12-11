import React, {useRef, useState} from "react";


const NavDropDown = props => {

    const [active, setActive] = useState(false);

    const ref= useRef(null)

    function handleClick(e) {
        document.querySelectorAll(".sidebar-menu li").forEach(menu => {
            menu.classList.remove("active")
        })
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.style.display = 'none';
        })
        setActive(!active);
    }

    return (
        <li className={active ? 'dropdown active' : 'dropdown'} onClick={handleClick} ref={ref}>
            <a className={props.disabled ? 'nav-link has-dropdown cursor-pointer nav-link-disabled' : 'nav-link has-dropdown cursor-pointer'} data-toggle="dropdown">
                <i className={props.iconClassName}></i>
                <span>{props.title}</span>
            </a>
            <ul className="dropdown-menu" style={{ border: 0 , display: active ? 'block' : ""}}>
                {props.children}
            </ul>
        </li>
    )
}

export default NavDropDown
