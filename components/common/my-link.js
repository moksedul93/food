import React from "react";
import Link from "next/link";


const MyLink = props => {
    return (
        <Link href={ props.href || "#!"}>
            <a className={props.className}>
                {props.children}
            </a>
        </Link>
    )
}

export default MyLink