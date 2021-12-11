import React from "react";

const Card = pops => {
    return (
        <div className="card card-statistic-1">
            <div className="card-icon bg-primary">
                <i className="fas fa-money-bill"></i>
            </div>
            <div className="card-wrap">
                <div className="card-header">
                    <h4>Total Earnings</h4>
                </div>
                <div className="card-body">
                    8,181.13
                </div>
            </div>
        </div>
    )
}

export default Card