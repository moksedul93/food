import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from "react";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8"/>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width,initial-scale=1"/>
                </Head>
                <body>
                <Main />

                </body>
            </Html>
        )
    }
}

export default MyDocument