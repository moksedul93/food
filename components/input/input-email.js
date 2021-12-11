import React from "react";

const InputEmail = props => {
    const handleEmailChange = e => {
        let email = e.currentTarget.value;
        props.setEmail(email);
        emailValidityCheck(email);
    }
    function emailValidityCheck(email) {
        if(email.length == 0 ) {
            props.setError(false);
        } else {
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            props.setError(!reg.test(email));
        }
    }

    return (
        <div className="form-group">
            <label>Email(Optional)</label>
            <input type="text" className="form-control" value={props.email} onChange={handleEmailChange}/>
            {props.error && ( <span className="invalid-feedback d-block ml-2">Provide a valid Email!</span>)}
        </div>
    )
}

export default InputEmail