import React, {useEffect} from 'react';
import Link from 'next/link'
import { Scrollbars } from 'react-custom-scrollbars';
import Cookies from 'js-cookie'
import {useRouter} from "next/router";

const Navbar = props => {
    const router = useRouter()

    useEffect(() => {
        document.body.onload = () => {
            if(document.body.clientWidth <= 1025 ) {
                props.setLayout("sidebar-gone");
            }
        }
        if( document.body.clientWidth > 1025 && Cookies.get("sidebar") === "mini") {
            props.setLayout("sidebar-mini");
        }
        document.onclick = e => {
            if(e.clientX > 250 && document.body.clientWidth <= 1025  && props.layout === "sidebar-show") {
                props.setLayout("sidebar-gone");
            }
        }
        document.body.onresize = () => {
            if(document.body.clientWidth > 1025 ) {
                if(props.layout !== "sidebar-mini") {
                    props.setLayout("");
                }
            } else {
                if(props.layout == "sidebar-mini" || props.layout == "") {
                    props.setLayout("sidebar-gone");
                }
            }
        }
        router.events.on('routeChangeComplete', e => {
            if(document.body.clientWidth <= 1025 ) {
                props.setLayout("sidebar-gone");
            }
        });
        document.body.setAttribute('class', props.layout);

    }, [props.layout]);

    return (
        <div>
            <div className="main-sidebar" tabIndex="1" style={{overflow: "hidden", outline: "none"}}>
                <aside id="sidebar-wrapper">
                    <div className="sidebar-brand">
                        <Link href={props.href}>
                            <a>{props.siteTitle || (<img href={props.siteIcon}/>)}</a>
                        </Link>
                    </div>
                    <div className="sidebar-brand sidebar-brand-sm">
                        <Link href={props.href}>
                            <a>{props.siteTitleMini}</a>
                        </Link>
                    </div>

                    {props.layout == "sidebar-mini" ? (
                        <ul className="sidebar-menu" >
                            {props.children}
                        </ul>

                    ) : (

                        <Scrollbars
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            thumbMinSize={30}
                            universal={true}
                            style={{ width: 250, height: '93vh' }}>
                            <ul className="sidebar-menu" >
                                {props.children}
                            </ul>
                        </Scrollbars>

                    )}

                </aside>
            </div>
        </div>
    )
}

export default Navbar
