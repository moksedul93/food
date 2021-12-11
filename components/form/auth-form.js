import React from "react";

const AuthForm = props => {
    return (
        <div className="wrapper bg-image">
            <div className="login-form">
                <div className="text-center mb-3">
                    <h2 className="card-title font-italic">{props.title}</h2>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default AuthForm