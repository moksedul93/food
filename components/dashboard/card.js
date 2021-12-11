import React from "react";

const Card = ({title, className, iconClassName, value}) => {
    return (
        <div className="card card-statistic-1">
            <div className={`card-icon ${className || ''}`}>
                <i className={iconClassName}/>
            </div>
            <div className="card-wrap">
                <div className="card-header">
                    <h4>{title}</h4>
                </div>
                <div className="card-body">
                    {value}
                </div>
            </div>
        </div>
    )
}

export default Card