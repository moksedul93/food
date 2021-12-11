import React from "react";
import ReactChipInput from "react-chip-input";


const InputChip = props => {

    const addChip = value => {
        const chips = props.chips.slice();
        chips.push(value);
        props.setChips(chips);
    };
    const removeChip = index => {
        const chips = props.chips.slice();
        chips.splice(index, 1);
        props.setChips(chips);
    };


    return (
        <div className="form-group">
            <label>{props.label}</label>
            <ReactChipInput
                classes={"input-custom-chip"}
                chips={props.chips}
                onSubmit={value => addChip(value)}
                onRemove={index => removeChip(index)}
            />
        </div>
    )
}

export default InputChip