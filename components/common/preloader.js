import React, { useEffect} from "react";
import {useRouter} from "next/router";
import {Spin} from "antd";

function PreLoader() {
    const router = useRouter()

    useEffect(() => {
        const preloaderOff = () => {
            window.setTimeout(()=> {
                document.querySelector('.preloader').style.display = 'none';
            }, 300);
        }
        function routeChangeStart(url) {
            document.querySelector('.preloader').style.display = 'flex';
        }
        router.events.on( 'routeChangeStart', routeChangeStart);
        preloaderOff();

    })

    return (
        <div className="preloader">
            <i className="fas fa-spinner fa-spin text-primary" style={{fontSize: 70}}></i>
        </div>
    )
}

export default PreLoader
