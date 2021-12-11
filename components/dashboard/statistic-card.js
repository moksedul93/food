import React from "react";

const StatisticCard = ({title, pending, processing, success}) => {
    return (
        <div className="card card-statistic-2">
            <div className="card-stats">
                <div className="card-stats-title">{title} Statistics</div>
                <div className="card-stats-items">
                    <div className="card-stats-item">
                        <div className="card-stats-item-count">{pending}</div>
                        <div className="card-stats-item-label">In Pending</div>
                    </div>
                    <div className="card-stats-item">
                        <div className="card-stats-item-count">{processing}</div>
                        <div className="card-stats-item-label">In Processing</div>
                    </div>
                    <div className="card-stats-item">
                        <div className="card-stats-item-count">{success}</div>
                        <div className="card-stats-item-label">Completed</div>
                    </div>
                </div>
            </div>
            <div className="card-icon shadow-primary bg-primary">
                <i className="fas fa-archive"/>
            </div>
            <div className="card-wrap">
                <div className="card-header">
                    <h4>Total {title}</h4>
                </div>
                <div className="card-body">
                    {+pending + success + processing}
                </div>
            </div>
        </div>
    )
}
export default StatisticCard