import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../components/card";
import { Modal, Select, Table } from "antd";
import RiderLayout from "../../../components/layouts/rider-layout";
import Button from "react-bootstrap/Button";
import { SwalLoading } from "../../../components/common/swal-loading";
import Swal from "sweetalert2";
import { fetchRestaurantOrders } from "../../../app/slices/orders";
import { fetchAllOrdersByRider } from "../../../app/slices/rider";
import { updateOrder } from "../../../app/features/orders";
import InputPlacesMap from "../../../components/input/input-places-map"


const Orders = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [order, setOrder] = useState(undefined);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('pending');
    const [proceedAction, setProceedAction] = useState('');

    let orders = useSelector(state => state.riderOrders);
    useEffect(() => {
        getOrders(status);
    }, []);

    const getOrders = async (status) => {
        await dispatch(fetchAllOrdersByRider({ status }));
    };

    let columns = [
        { title: '#', dataIndex: 'key' },
        { title: 'Customer Name', dataIndex: 'customer', render: customer => `${customer.first_name} ${customer.last_name}` },
        { title: 'Customer Mobile', dataIndex: ['customer', 'mobile'] },
        { title: 'Items', dataIndex: 'items', render: items => items.length },
        { title: 'Total', dataIndex: 'base_price_total' },
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
            title: 'Action',
            render: order => {
                const handleShow = () => {
                    setOrder(order)
                    setShow(true)
                }
                return (
                    <a className="text-primary table-action c-pointer" onClick={handleShow}><i
                        className="fa fa-eye" /></a>
                )

            }
        }
    ]

    // const acceptOrder = async () => {
    //     setShow(false);
    //     SwalLoading();
    //     console.log(e)
    //     return;
    //     let { error, msg } = await updateOrder(order._id, 'accepted')
    //     if (error) {
    //         await Swal.fire('Error', msg, 'error')
    //     } else {
    //         await Swal.fire('Success', 'Order accepted Successfully', 'success')
    //         getOrders(status)
    //     }
    // };

    // const cancelOrder = async () => {
    //     setShow(false)
    //     SwalLoading()
    //     let { error, msg } = await updateOrder(order._id, 'cancelled')
    //     if (error) {
    //         await Swal.fire('Error', msg, 'error')
    //     } else {
    //         await Swal.fire('Success', 'Order Cancelled Successfully', 'success')
    //         getOrders(status || '')
    //     }
    // };
    async function handleProceed() {
        if (!proceedAction) return await Swal.fire('Error', 'Please select an action', 'error');
        setShow(false);
        SwalLoading();
        const { error, msg } = await updateOrder(order._id, proceedAction);
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            statusUpdate(proceedAction);
            await Swal.fire('Success', `Order ${proceedAction} Successfully`, 'success');
        }
    };

    function handleChangeProceed(action) {
        setProceedAction(action);
    };

    const statusUpdate = value => {
        setStatus(value)
        getOrders(value)
    };

    return (
        <RiderLayout>
            <Card>
                <div className="card-header d-flex justify-content-lg-between">
                    <h3 style={{ color: '#6c757d' }}>Orders</h3>
                    <Select style={{ width: 200 }} onChange={statusUpdate} allowClear value={status}
                        onClear={() => setStatus(undefined)} placeholder="Status" size="large">
                        <Select.Option id="1" value="pending">Pending</Select.Option>
                        <Select.Option id="2" value="accepted">Accepted</Select.Option>
                        <Select.Option id="3" value="paid">Complete</Select.Option>
                        <Select.Option id="4" value="cancelled">Cancelled</Select.Option>
                    </Select>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Order
                            order={order}
                            show={show}
                            setShow={setShow}
                            handleChangeProceed={handleChangeProceed}
                            handleProceed={handleProceed}
                        // acceptOrder={acceptOrder}
                        // cancelOrder={cancelOrder}
                        />
                        <Table
                            columns={columns}
                            loading={orders.loading}
                            rowKey='_id'
                            dataSource={orders.data.map((order, index) => order)}
                        />
                    </div>
                </div>
            </Card>
        </RiderLayout>
    )
}

export default Orders;

const Order = ({ order, show, setShow, handleProceed, handleChangeProceed, }) => {

    return (
        <Modal title="Order" visible={show} onCancel={() => setShow(false)} footer={null}>
            {order &&
                <>
                    <div className="mb-4" style={{ fontSize: 18 }}>
                        <p className="mb-0">Customer Name: {order.customer.first_name + ' ' + order.customer.last_name} <b></b></p>
                        <p>Mobile: {order.customer.mobile}<b></b></p>
                        <p>Address: {order.delivery_info.address.address}<b></b></p>
                        <p>Location: lat: {order.delivery_info.address?.location.lat}, lng: {order.delivery_info.address?.location.lng}<b></b></p>
                        {/* <InputPlacesMap label="Customer Location"/> */}
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
                                {order?.items?.map((item, index) => (
                                    <tr key={item._id}>
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
                        <p className="mb-1"><b>Subtotal: {order.sub_total}</b> </p>
                        <p className="text-danger mb-1">
                            <b>Discount: {order.customer_discount_amount}</b> </p>
                        <p className="mb-1"><b>Total: {order.total}</b></p>
                    </div>
                    {/* {order.status === 'pending' && ( */}
                    <Select onChange={handleChangeProceed} style={{ width: 200 }} allowClear
                        placeholder="Status" size="large">
                        <Select.Option id="2" value="accepted">Accept Order</Select.Option>
                        <Select.Option id="3" value="paid">Drop Off</Select.Option>
                        <Select.Option id="4" value="cancelled">Cancelled</Select.Option>
                    </Select>
                    <>
                        <Button variant="primary" className="mt-3 px-3" onClick={handleProceed}>Proceed</Button>
                    </>
                    {/* )} */}
                </>
            }
        </Modal>
    )
}