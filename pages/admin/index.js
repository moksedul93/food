import React, {useEffect, useState} from "react";
import AdminLayout from "../../components/layouts/admin-layout";
import NewUsers from "../../components/admin/dashboard/new-users";
import {useDispatch} from "react-redux";
import NewRestaurants from "../../components/admin/dashboard/new-restaurants";
import NewAgents from "../../components/admin/dashboard/new-agents";
import NewAgencies from "../../components/admin/dashboard/agency";
import NewRequests from "../../components/admin/dashboard/new-requests";
import {fetchOwners} from "../../app/slices/owners";
import {fetchRestaurants} from "../../app/slices/restaurants";
import {fetchAgencies} from "../../app/slices/agencies";
import {fetchTransactions} from "../../app/slices/transactions";

const App = () => {
    let dispatch = useDispatch()
    useEffect(() => {
        Notification.requestPermission()
        dispatch(fetchOwners({status: 'pending', page: 1, size: 5}))
        dispatch(fetchRestaurants({status: 'pending', page: 1, size: 5}))
        dispatch(fetchAgencies({status: 'pending', page: 1, size: 5}))
        dispatch(fetchTransactions({status: 'pending', page: 1, size: 5}))

    }, [])


    return (
        <AdminLayout>
            <div className="section-header">
                <h1>Dashboard</h1>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
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


            <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                    <NewUsers/>
                    <NewAgents/>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                    <NewRestaurants/>
                    <NewRequests/>
                    <NewAgencies/>
                </div>
            </div>
        </AdminLayout>
    )
}


export default App
