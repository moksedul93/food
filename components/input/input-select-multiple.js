import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const InputSelectMultiple = props => {
    const handleChange = (e, select) => props.setValue(select.value);

    return (
        <div className="form-group">
            <label>{props.label}</label>
            <Dropdown fluid multiple selection options={props.options} value={props.value} onChange={handleChange} disabled={props.disabled}/>
        </div>
    )
}

export default InputSelectMultiple
