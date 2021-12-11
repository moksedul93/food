import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Card from "../../../components/card";
import {Modal, Select, Table} from "antd";
import AdminLayout from "../../../components/layouts/admin-layout";
import {fetchSettings} from "../../../app/slices/settings";
import {fetchOrders} from "../../../app/slices/orders";

const Orders = () => {
    const dispatch = useDispatch()
    const [order, setOrder] = useState()
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState(undefined)

    let orders = useSelector(state => state.orders)
    let settings = useSelector(state => state.settings)

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    })

    useEffect(() => {
        dispatch(fetchSettings({}))
        const urlParams = new URLSearchParams(window.location.search)
        let status = urlParams.get('status')
        setStatus(status)
        getOrders(status || '', 1, 10, urlParams.get('id'))
    }, [])

    const getOrders = (status, page, size, current) => {
        dispatch(fetchOrders({status, page, size})).then(({payload}) => {
            setPagination({
                current: page,
                pageSize: size,
                total: payload.data.totalDocs
            })
            if (current) {
                payload.data.docs.map(order => {
                    if (current === order._id) {
                        setOrder(formatOrder(order))
                        setShow(true)
                    }
                })
            }
        })
    }

    const formatOrder = order => {
        return {
            name: order.customer.first_name + " " + order.customer.last_name,
            mobile: order.customer.mobile,
            items_length: order.items.length,
            payment_type: order.payment_type,
            total: order.total || 0,
            status: order.status,
            _id: order._id,
            items: order.items,
            sub_total: order.sub_total,
            delivery_charge: order.delivery_charge,
            vat: order.vat || 0,
            customer_discount_amount: order.customer_discount_amount || 0,
            cashback: order.cashback || 0,
            restaurant: order.restaurant,
            restaurant_due: calculateRestaurantDue(order.base_price_total, order.restaurant),
            rider_cost: order.delivery_charge * 0.5,
            total_vat: (order.vat || 0) + ((order.base_price_total * settings.restaurant_vat * 0.01) || 0),
            address: order.delivery_info.address.address
        }
    }

    let columns = [
        {title: '#', dataIndex: 'key'},
        {title: 'Customer Name', dataIndex: 'name'},
        {title: 'Customer Mobile', dataIndex: 'mobile'},
        {title: 'Items', dataIndex: 'items_length'},
        {title: 'Total', dataIndex: 'total', className: 'text-right', render: total => total.toFixed(2)},
        {
            title: 'Status', dataIndex: 'status', className: 'text-center', render: status => (
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
                        <div className="badge badge-pill badge-danger mt-3">Canceled</div>
                    )}
                </>
            )
        },
        {
            title: 'Action', render: order => (
                <a className="text-primary table-action c-pointer" onClick={() => handleShow(order)}><i
                    className="fa fa-eye"/></a>
            )
        }
    ]

    const handleShow = order => {
        setOrder(order)
        setShow(true)
    }

    const statusUpdate = value => {
        setStatus(value)
        getOrders(value || '', 1, 10)
    }
    const handleTableChange = pagination => {
        getOrders( status || '', pagination.current, pagination.pageSize )
    }

    const calculateRestaurantDue = (total, restaurant) => {
        let commission = (restaurant && restaurant.plan && restaurant.plan.commision) ? (total * restaurant.plan.commision * 0.01) : 0
        let vat = (restaurant && restaurant.vat && settings.restaurant_vat) ? (total * settings.restaurant_vat * 0.01) : 0
        let rider = (restaurant && restaurant.rider_cost && settings.rider_cost) ? settings.rider_cost : 0
        return (total - commission - vat - rider) || 0
    }

    return (
        <AdminLayout>
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
                        <Order order={order} show={show} setShow={setShow} settings={settings}/>
                        <Table
                            columns={columns}
                            pagination={pagination}
                            loading={orders.loading}
                            onChange={handleTableChange}
                            dataSource={orders.data.map((order, index) => {
                                return {
                                    key: ( pagination.current-1 ) * pagination.pageSize + index + 1,
                                    ...formatOrder(order)
                                }
                            })}/>
                    </div>
                </div>
            </Card>
        </AdminLayout>
    )
}

export default Orders

const Order = ({order, show, setShow, settings}) => {
    let profit = order ? order.total - order.cashback - order.restaurant_due - order.rider_cost - order.total_vat - (order.total * 0.03) : 0


    return (
        <Modal title="Order" visible={show} onCancel={() => setShow(false)} footer={null} width={700} style={{top: 20}}>
            {order && (
                <>
                    <div className="mb-4" style={{fontSize: 16}}>
                        <p className="mb-0">Restaurant Name: <b>{order.restaurant.name}</b></p>
                        <p className="mb-0">Customer Name: <b>{order.name}</b></p>
                        <p className="mb-0">Mobile: <b>{order.mobile}</b></p>
                        <p className="mb-0">Address: <b>{order.address}</b></p>
                        <p>Payment Method: <b>{order.payment_type === 'cod' ? 'COD' : 'Wallet'}</b></p>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Base Price</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td className="text-right">{item.base_price.toFixed(2)}</td>
                                    <td className="text-right">{item.price.toFixed(2)}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-right">{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <hr className="mt-0 mb-2 p-0"/>
                    <div className="row mr-3">
                        <div className="ml-auto col-md-7">
                            <p className="mb-1">Subtotal: <b className="float-right"> {order.sub_total.toFixed(2)} </b>
                            </p>
                            <p className="mb-1 text-danger">Discount: (A: {order.restaurant.discount_given_by_admin}% +
                                R: {order.restaurant.discount_given_by_restaurant}%)<b
                                    className="float-right"> -{order.customer_discount_amount.toFixed(2)} </b></p>
                            <p className="mb-1">Delivery Charge: <b
                                className="float-right"> {order.delivery_charge.toFixed(2)} </b></p>
                            <p className="mb-1"> Customer Vat: ({settings.customer_vat}%)<b
                                className="float-right"> {order.vat.toFixed(2)} </b></p>
                            <hr className="mt-0 mb-2 p-0"/>
                            <p className="mb-1">Customer Paid Amount: <b
                                className="float-right"> {order.total.toFixed(2)} </b></p>
                            {order.status === 'paid' && (
                                <>
                                    <p className="mb-1 text-danger">Cashback:
                                        ({settings.customer_cashback_percentange}%) <b
                                            className="float-right"> -{order.cashback.toFixed(2)} </b></p>
                                    <p className="mb-1 text-danger">Restaurant Due: <b
                                        className="float-right"> -{order.restaurant_due.toFixed(2)} </b></p>
                                    <p className="mb-1 text-danger">Vat: (R: {settings.restaurant_vat}% +
                                        C: {settings.customer_vat}%)) <b
                                            className="float-right"> -{order.total_vat.toFixed(2)} </b></p>
                                    <p className="mb-1 text-danger">Rider Cost: (50%) <b
                                        className="float-right"> -{order.rider_cost.toFixed(2)} </b></p>
                                    <p className="mb-1 text-danger">SSL Cost: (3%) <b
                                        className="float-right"> -{(order.total * 0.03).toFixed(2)} </b></p>
                                    <hr className="mt-0 mb-2 p-0"/>
                                    <p className={`mb-1 ${profit >= 0 ? '' : 'text-danger'}`}>Foodjocky Total: <b
                                        className="float-right"> {profit.toFixed(2)} </b></p>
                                    <p className="mb-1 text-danger">Overhead:(15%)<b
                                        className="float-right"> -{(profit * 0.15).toFixed(2)} </b></p>
                                    <hr className="mt-0 mb-2 p-0"/>
                                    <p className={`mb-1 ${(profit - profit * 0.15) >= 0 ? '' : 'text-danger'}`}>Profit: <b
                                        className="float-right"> {(profit - profit * 0.15).toFixed(2)} </b></p>

                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </Modal>
    )
}