import React from "react";

const App = props => {
    return (
        <h1>Hello</h1>

    )
}

export async function getServerSideProps(context) {
    context.res.writeHeader(307, { Location: "/login" })
    context.res.end();
    return {
        props: {

        }
    }
}

export default App
