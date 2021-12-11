import React, {useEffect} from "react";
import AgencyLayout from "../../components/layouts/agency-layout";
import {fetchDashboardData} from "../../app/slices/owner";
import {useDispatch, useSelector} from "react-redux";
import Card from "../../components/dashboard/card";
import StatisticCard from "../../components/dashboard/statistic-card";

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchDashboardData({}))
    }, [])

    const owner = useSelector(state => state.owner)
    const orders = {}
    const todayOrders = {}
    const payouts = {}
    owner.dashboard?.ownerOrderStatistics?.map(order => {
        orders[order._id] = order.count
    })
    owner.dashboard?.ownerTodayOrderStatistics?.map(order => {
        todayOrders[order._id] = order.count
    })
    owner.dashboard?.ownerPayoutsStatistics?.map(order => {
        payouts[order._id] = order.count
    })

    return (
        <AgencyLayout>
            <div className="section-header">
                <h1>Dashboard</h1>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <Card
                        className="bg-primary"
                        title="Total Earnings"
                        value={owner.dashboard?.ownerTotalEarnings || 0}
                        iconClassName="fas fa-money-bill"/>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <Card
                        className="bg-success"
                        title="Today's Earnings"
                        value={owner.dashboard?.ownerTotalEarnings || 0}
                        iconClassName="fas fa-dollar-sign"/>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <Card
                        className="bg-danger"
                        title="Total Payouts"
                        value={owner.dashboard?.ownerTotalPayouts || 0}
                        iconClassName="fas fa-hand-holding-usd"/>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <Card
                        className="bg-warning"
                        title="Total Restaurant"
                        value={owner.dashboard?.ownerTotalRestaurant || 0}
                        iconClassName="fas fa-utensils"/>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <StatisticCard title="Order" pending={orders.pending || 0} processing={(orders.accepted || 0) + (orders.delivered || 0)} success={orders.paid || 0}/>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <StatisticCard title="Today's Order" pending={todayOrders.pending || 0} processing={(todayOrders.accepted || 0) + (todayOrders.delivered || 0)} success={todayOrders.paid || 0}/>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <StatisticCard title="Payout" pending={payouts.pending || 0} processing={0} success={payouts.success || 0}/>
                </div>
            </div>
        </AgencyLayout>
    )
}

export default App
