import React from "react";
import CardActionFilter from "./action-filter";

const Card = props => {
    return (
        <div className="card">
            { props.header ? (
                <>
                    <div className="card-header">
                        <h5>{props.header}</h5>
                    </div>
                    <div className="card-body">
                        {props.children}
                    </div>
                </>

            ) : props.children
            }
        </div>
    )
}

export default Card