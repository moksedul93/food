import React, {useState} from "react";
import {Toast} from "react-bootstrap";
import Link from "next/link";

const BootstrapToast = props => {
    const [show, setShow] = useState(true);

    return (
        <Toast show={show} onClose={e => setShow(false)}>
            <Toast.Header>
                <strong className="mr-auto text-primary">{props.header}</strong>
                {/*<small>2 seconds ago</small>*/}
            </Toast.Header>
            <Toast.Body>
                {props.children}
                <div className="text-center" >
                    <Link href={props.href}>
                        <a className="text-primary c-pointer" onClick={e => setShow(false)}>Show</a>
                    </Link>
                </div>
            </Toast.Body>
        </Toast>
    )
}

export default BootstrapToast

