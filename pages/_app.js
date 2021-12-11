import React from "react";
import PreLoader from "../components/common/preloader";
import '../public/assets/css/preloader.css'
import 'semantic-ui-css/semantic.min.css'
import 'antd/dist/antd.css'
import '../public/assets/css/bootstrap.min.css'
import '../public/assets/css/all.css'
import '../public/assets/css/components.css'
import '../public/assets/css/style.css'
import './style.css'


import {Provider} from "react-redux";
import store from "../app/store";

function MyApp({ Component, pageProps }) {
    return(
        <Provider store={store}>
            <PreLoader/>
            <Component {...pageProps} />
        </Provider>
    )
}

export default MyApp
