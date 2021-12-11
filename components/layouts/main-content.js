import React from "react";

const MainContent = props => {


    return (
        <div className="main-content" style={{minHeight: "865px"}}>
            <section className="section">
                <section className="section">
                    {props.children}
                </section>
            </section>
        </div>
    )
}

export default MainContent