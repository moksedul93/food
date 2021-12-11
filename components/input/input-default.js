import React from "react";

const InputDefault = props => {
    let label = props.label || "Pass Label Props";
    let type = props.type || "text";

    const handleChange = e => props.setValue(e.currentTarget.value);

    return (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} className="form-control" value={props.value} onChange={handleChange}/>
        </div>
    )
}

export default InputDefault