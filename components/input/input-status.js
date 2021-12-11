import React from "react";

const InputStatus = props => {

    const handleSelect = e => props.setStatus(e.currentTarget.value);
    const isSelected = value => props.status === value;


    return (
        <div className="form-group">
            <label>Status</label>
            <select className="form-control" name="status" onChange={handleSelect} style={{height: '120%'}}>
                <option value="pending" selected={isSelected('pending')}>Pending</option>
                <option value="approved" selected={isSelected('approved')}>Approved</option>
                <option value="suspended" selected={isSelected('suspended')}>Suspended</option>
                <option value="cancelled" selected={isSelected('cancelled')}>Cancelled</option>
            </select>
        </div>
    )
}

export default InputStatus