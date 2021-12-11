import {verifyAgent} from "../../components/agent";
import AgentLayout from "../../components/layouts/agent-layout";
import React from "react";
import Card from "../../components/common/card";

const App = props => {
    return (
        <AgentLayout agent={props.agent}>
            <div className="section-header">
                <h1>Dashboard</h1>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <Card/>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-danger">
                            <i className="fas fa-hand-holding-usd"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Payouts</h4>
                            </div>
                            <div className="card-body">
                                79,686.00
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-warning">
                            <i className="fas fa-utensils"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Restaurant</h4>
                            </div>
                            <div className="card-body">
                                31
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-success">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Customers</h4>
                            </div>
                            <div className="card-body">
                                219
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="card card-statistic-2">
                        <div className="card-stats">
                            <div className="card-stats-title">Order Statistics

                            </div>
                            <div className="card-stats-items">
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">44</div>
                                    <div className="card-stats-item-label">In Pending</div>
                                </div>
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">3</div>
                                    <div className="card-stats-item-label">In Processing</div>
                                </div>
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">11</div>
                                    <div className="card-stats-item-label">Completed</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-icon shadow-primary bg-primary">
                            <i className="fas fa-archive"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Orders</h4>
                            </div>
                            <div className="card-body">
                                60
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="card card-statistic-2">
                        <div className="card-stats">
                            <div className="card-stats-title">Todays order Statistics

                            </div>
                            <div className="card-stats-items">
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">0</div>
                                    <div className="card-stats-item-label">In Pending</div>
                                </div>
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">0</div>
                                    <div className="card-stats-item-label">In Processing</div>
                                </div>
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">0</div>
                                    <div className="card-stats-item-label">Completed</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-icon shadow-primary bg-primary">
                            <i className="fas fa-archive"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Orders</h4>
                            </div>
                            <div className="card-body">
                                0
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="card card-statistic-2">
                        <div className="card-stats">
                            <div className="card-stats-title">Payout Statistics

                            </div>
                            <div className="card-stats-items">
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">32</div>
                                    <div className="card-stats-item-label">In Pending</div>
                                </div>
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">32</div>
                                    <div className="card-stats-item-label">In Pending</div>
                                </div>
                                <div className="card-stats-item">
                                    <div className="card-stats-item-count">4</div>
                                    <div className="card-stats-item-label">Completed</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-icon shadow-primary bg-primary">
                            <i className="fas fa-archive"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Payouts</h4>
                            </div>
                            <div className="card-body">
                                37
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AgentLayout>
    )
}

export default App


export async function getServerSideProps(context) {
    let agent = await verifyAgent(context);
    return {
        props: {
            agent
        }
    }
}
