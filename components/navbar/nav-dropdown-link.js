import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import Cookies from "js-cookie";


const NavDropDownLink = props => {

    const ref = useRef(null);
    const router = useRouter();
    const [active, setActive] = useState(router.pathname == props.href);

    useEffect(()=> {
        if(active) {
            ref.current.parentElement.parentElement.classList.add("active");

            if( Cookies.get("sidebar") !== "mini") {
                ref.current.parentElement.style.display = 'block';
            }
        }
    },[active])


    return (
        <li ref={ref}>
            <Link href={props.href}>
                <a tabIndex="-1" className={ active ? "nav-link active" : "nav-link" }>{props.title}</a>
            </Link>
        </li>
    )
}

export default NavDropDownLink