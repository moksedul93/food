import React from "react";

const InputFloatNumber = props => {
    let label = props.label || "Pass Label Props";
    let type = props.type || "text";

    const handleChange = e => props.setValue(e.currentTarget.value.replace(/[^1234567890.]/, ""));

    return (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} className="form-control" value={props.value} onChange={handleChange}/>
        </div>
    )
}

export default InputFloatNumber