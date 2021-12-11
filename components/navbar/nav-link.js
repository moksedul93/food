import React, {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";


const NavLink = props => {
    const router = useRouter();
    const [active, setActive] = useState(router.pathname == props.href);

    function handleClick() {
        document.querySelectorAll(".sidebar-menu li").forEach(menu => {
            menu.classList.remove("active")
        })
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.remove("d-block")
        })
        setActive(!active);
    }

    return (
        <li className={ active ? "active" : ''} onClick={handleClick}>
            <Link href={props.href}>
                <a className={ props.disabled ? "nav-link nav-link-disabled" :"nav-link"} >
                    <i className={props.iconClassName}></i> <span>{props.title}</span>
                </a>
            </Link>
        </li>
    )
}

export default NavLink
