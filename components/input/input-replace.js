import React from "react";

const InputReplace = props => {
    let label = props.label || "Pass Label Props";
    let type = props.type || "text";
    let replace = props.replace || '';

    const handleChange = e => props.setValue(e.currentTarget.value.replace(replace, ''));

    return (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} className="form-control" value={props.value} onChange={handleChange}/>
        </div>
    )
}

export default InputReplace