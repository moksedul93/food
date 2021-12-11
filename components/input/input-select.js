import React from "react";
import {Select} from "semantic-ui-react";

const InputSelect = props => {

    const handleSelect = ( e, data ) => props.setValue(data.value);
    const options = props.options || []

    return (
        <div className="form-group">
            {props.label && (<label>{props.label}</label>) }
            <Select fluid search={props.search} options={options} value={props.value} onChange={handleSelect} placeholder={props.placeholder || ''} disabled={props.disabled}/>
        </div>
    )
}

export default InputSelect
