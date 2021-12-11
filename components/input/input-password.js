import React, {useState} from "react";

const InputPassword = props => {

    let minLength = props.minLength || 0;

    const [invalidPass, setInvalidPass] = useState(false);
    const handlePasswordChange = e => {
        let pass = e.currentTarget.value;
        props.setPassword(pass);
        if(pass.length > 0 && pass.length < minLength) {
            setInvalidPass(true);
        } else {
            setInvalidPass(false);
        }
    }

    return (
        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={props.password} onChange={handlePasswordChange}/>
            {invalidPass && ( <span className="invalid-feedback d-block ml-2">Password must be {minLength} character long</span>)}
        </div>
    )
}

export default InputPassword