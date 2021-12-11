import React from "react";

const InputTextArea = props => {
    let label = props.label || "Pass Label Props";

    const handleChange = e => props.setValue(e.currentTarget.value);

    return (
        <div className="form-group">
            <label>{label}</label>
            <textarea className="form-control description" style={{maxHeight: 80}} value={props.value} onChange={handleChange}/>
        </div>
    )
}

export default InputTextArea