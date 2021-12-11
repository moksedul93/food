import TimeInput from 'material-ui-time-picker'
import React from "react";

const InputTime = props => {
    return (
        <div className="form-group">
            <label>{props.label}</label>
            <TimeInput
                mode='12h'
                value={props.time}
                inputComponent = "input"
                className="form-control"
                onChange={props.setTime}
            />
        </div>
    )
}

export default InputTime