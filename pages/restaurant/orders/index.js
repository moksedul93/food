import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Card from "../../../components/card";
import {Modal, Select, Table} from "antd";
import RestaurantLayout from "../../../components/layouts/restaurant-layout";
import Button from "react-bootstrap/Button";
import {SwalLoading} from "../../../components/common/swal-loading";
import Swal from "sweetalert2";
import {fetchRestaurantOrders} from "../../../app/slices/orders";
import {updateOrder} from "../../../app/features/orders";

const Orders = () => {
    const dispatch = useDispatch()
    const [order, setOrder] = useState()
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState(undefined)

    let orders = useSelector(state => state.orders)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        let status = urlParams.get('status')
        setStatus(status)
        getOrders(status, urlParams.get('id'))
    }, [])

    const getOrders = (status, current) => {
        dispatch(fetchRestaurantOrders({status: status || ''})).then(({payload}) => {
            if(current && current.length === 24) {
                payload.data.map(order => {
                    if(order._id === current) {
                        setOrder(order)
                        setShow(true)
                    }
                })
            }
        })
    }

    let columns = [
        {title: '#', dataIndex: 'key'},
        {title: 'Customer Name', dataIndex: 'customer', render: customer => `${customer.first_name} ${customer.last_name}`},
        {title: 'Customer Mobile', dataIndex: ['customer', 'mobile']},
        {title: 'Items', dataIndex: 'items', render: items => items.length},
        {title: 'Total', dataIndex: 'base_price_total'},
        {
            title: 'Status', dataIndex: 'status', render: status => (
                <>
                    {status === 'pending' && (
                        <div className="badge badge-pill badge-warning mt-3">Pending</div>
                    )}
                    {status === 'accepted' && (
                        <div className="badge badge-pill badge-primary mt-3">Accepted</div>
                    )}
                    {status === 'delivered' && (
                        <div className="badge badge-pill badge-secondary mt-3">Delivered</div>
                    )}
                    {status === 'paid' && (
                        <div className="badge badge-pill badge-success mt-3">Paid</div>
                    )}
                    {status === 'cancelled' && (
                        <div className="badge badge-pill badge-danger mt-3">Cancelled</div>
                    )}
                </>
            )
        },
        {
            title: 'Action', render: order =>{
                const handleShow = () => {
                    setOrder(order)
                    setShow(true)
                }
                return (
                    <a className="text-primary table-action c-pointer" onClick={handleShow}><i
                        className="fa fa-eye"/></a>
                )

            }
        }
    ]

    const acceptOrder = async () => {
        setShow(false)
        SwalLoading()
        let {error, msg} = await updateOrder(order._id,'accepted')
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Order accepted Successfully', 'success')
            getOrders(status || '')
        }
    }
    const cancelOrder = async () => {
        console.log('cancelclicked')
        setShow(false)
        SwalLoading()
        let {error, msg} = await updateOrder(order._id,'cancelled')
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Order Cancelled Successfully', 'success')
            getOrders(status || '')
        }
    }

    const statusUpdate = value => {
        setStatus(value)
        getOrders(value)
    }
    return (
        <RestaurantLayout>
            <Card>
                <div className="card-header d-flex justify-content-lg-between">
                    <h3 style={{color: '#6c757d'}}>Orders</h3>
                    <Select style={{width: 200}} onChange={statusUpdate} allowClear value={status}
                            onClear={() => setStatus(undefined)} placeholder="Status" size="large">
                        <Select.Option id="1" value="pending">Pending</Select.Option>
                        <Select.Option id="2" value="accepted">Accepted</Select.Option>
                        <Select.Option id="3" value="paid">Complete</Select.Option>
                        <Select.Option id="4" value="cancelled">Cancelled</Select.Option>
                    </Select>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Order order={order} show={show} setShow={setShow} acceptOrder={acceptOrder} cancelOrder={cancelOrder}/>
                        <Table columns={columns} loading={orders.loading}
                               dataSource={orders.data.map((order, index) => {
                                   return {
                                       key: index + 1,
                                       ...order
                                   }
                               })}/>
                    </div>
                </div>
            </Card>
        </RestaurantLayout>
    )
}

export default Orders

const Order = ({order, show, setShow, acceptOrder,cancelOrder}) => {
    return (
        <Modal title="Order" visible={show} onCancel={() => setShow(false)} footer={null}>
            {order && (
                <>
                    <div className="mb-4" style={{fontSize: 18}}>
                        <p className="mb-0">Customer Name: <b>{order.customer.first_name} {order.customer.last_name}</b></p>
                        <p>Mobile: <b>{order.customer.mobile}</b></p>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.items && order.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.base_price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.base_price * item.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-left">
                        <p className="mb-1"><b>Subtotal: </b> {order.base_price_sub_total}</p>
                        <p className="text-danger mb-1">
                            <b>Discount: </b> -{order.base_price_sub_total - order.base_price_total}</p>
                        <p className="mb-1"><b>Total: </b> {order.base_price_total}</p>
                    </div>
                    {order.status === 'pending' && (
                        <>
                        <Button variant="danger" className="mt-3 px-3 mx-3" onClick={cancelOrder}>Cancel Order</Button>
                        <Button variant="primary" className="mt-3 px-3" onClick={acceptOrder}>Accept Order</Button>
                        </>
                    )}
                </>
            )}
        </Modal>
    )
}