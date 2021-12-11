import RestaurantLayout from "../../components/layouts/restaurant-layout";
import React, {useEffect, useState} from "react";
import Swal from 'sweetalert2'
import {Modal} from "react-bootstrap";
import {Radio} from "semantic-ui-react";
import {SwalLoading} from "../../components/common/swal-loading";
import {useDispatch, useSelector} from "react-redux";
import NewOrders from "../../components/restaurant/dashboard/orders/new";
import {fetchRestaurant, fetchRestaurantDashboard} from "../../app/slices/restaurant";
import {updateRestaurantStatus} from "../../app/features/restaurant";
import StatisticCard from "../../components/dashboard/statistic-card";
import OwnerLayout from "../../components/layouts/owner-layout";

const App = props => {
    const [show, setShow] = useState(false);
    let dispatch = useDispatch()
    let restaurant = useSelector(state => state.restaurant)
    useEffect(() => {
        dispatch(fetchRestaurantDashboard({}))
    }, [])

    const handleActive = async () => {
        SwalLoading();
        let {error, msg} = await updateRestaurantStatus(!restaurant.active);
        if(error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await dispatch(fetchRestaurant({}))
            await Swal.fire('Success', "successfully Updated", 'success' )
        }
    }

    const orders = {}
    const todayOrders = {}
    restaurant.dashboard?.restaurantOrderStatistics?.map(order => {
        orders[order._id] = order.count
    })
    restaurant.dashboard?.restaurantTodayOrderStatistics?.map(order => {
        todayOrders[order._id] = order.count
    })

    return (
        <>
            <Modal show={show} size="sm" onHide={()=>setShow(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Restaurant Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-6 text-right">
                                {restaurant.active ? (
                                    <p style={{color:'#007bff', fontSize: 20}}>Active</p>
                                ): (
                                    <p className="text-danger" style={{fontSize: 20}}>Not Active</p>
                                )}
                            </div>
                            <div className="col-6 mt-1">
                                <Radio className="d-inline" toggle checked={restaurant.active} onClick={handleActive}/>
                            </div>
                        </div>
                    </Modal.Body>

            </Modal>
            <RestaurantLayout restaurant={props.restaurant}>
                <div className="section-header">
                    <h1>Dashboard</h1>
                    <div className="section-header-breadcrumb mr-5">
                        <h5>Restaurant Status: <a className="d-inline text-primary ml-2 c-pointer" onClick={()=>setShow(true)}>
                            {restaurant.active ? (
                                <p className="d-inline" style={{color:'#007bff'}}>Active</p>
                            ): (
                                <p className="d-inline text-danger">Not Active</p>
                            )}
                        </a> </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <StatisticCard title="Order" pending={orders.pending || 0} processing={(orders.accepted || 0) + (orders.delivered || 0)} success={orders.paid || 0}/>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <StatisticCard title="Today's Order" pending={todayOrders.pending || 0} processing={(todayOrders.accepted || 0) + (todayOrders.delivered || 0)} success={todayOrders.paid || 0}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                        <NewOrders/>
                    </div>
                </div>

            </RestaurantLayout>
        </>
    )
}

export default App

