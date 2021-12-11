import React, {useState, useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import {useRouter} from "next/router";

function RouteLoader() {

    const router = useRouter()
    const [show, setShow] = useState(false);

    useEffect(function (){
        function routeChangeStart(url) {
            setShow(true);
        }
        function routeChangeComplete(url) {
            setShow(false);
        }
        router.events.on( 'routeChangeStart', routeChangeStart);
        router.events.on( 'routeChangeComplete', routeChangeComplete);

    }, [ show ]);

    let loaderStyle = {
        padding: '200px auto',
        background: 'transparent'
    }

    return (
        <Modal show={show} centered={true} id="loading-modal">
            <div className="modal-body text-center">
                <div className="loader"/>
                <div clas="loader-txt" style={{color: '#ffffff'}}>
                    <p>Loading...</p>
                </div>
            </div>
        </Modal>
    )
}

export default RouteLoader