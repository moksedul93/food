import AuthForm from "../form/auth-form";
import React, {useState} from "react";

const InputPhone = props => {
    const handlePhoneChange = e => {
        let number = e.currentTarget.value.replace(/\D/g, '');
        props.setPhone(number);
        if(number.length > 0 && number.length != 10) {
            props.setError(true);
        } else {
            props.setError(false);
        }
    }

    return (
        <div className="form-group">
            <label htmlFor="name">Phone Number</label>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">+880</span>
                </div>
                <input type="text" value={props.phone} onChange={handlePhoneChange} className={ props.error ? "form-control is-invalid" :  "form-control"} readOnly={props.readOnly}/>
            </div>
            {props.error && ( <span className="invalid-feedback d-block ml-2">Provide a valid phone number!</span>)}
        </div>
    )
}

export default InputPhone