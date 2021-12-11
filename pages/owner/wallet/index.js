import React from "react";
import OwnerLayout from "../../../components/layouts/owner-layout";
import Card from "../../../components/card";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Swal from "sweetalert2";
import {Form, Input, Modal, Select, Table} from 'antd';
import Button from "react-bootstrap/Button";
import {SwalLoading} from "../../../components/common/swal-loading";
import {fetchOwnerRestaurants} from "../../../app/slices/restaurants";
import {fetchWallet} from "../../../app/slices/wallet";
import {transferAllBalance, transferBalance, withdrawBalance} from "../../../app/features/wallet";
import moment from "moment";

const App = () => {
    const [form] = Form.useForm();
    const [withdrawForm] = Form.useForm();
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [reload, setReload] = useState(false)
    useEffect(() => {
        dispatch(fetchOwnerRestaurants({status: ''}))
        dispatch(fetchWallet({}))
    }, [])
    const restaurants = useSelector(state => state.restaurants)
    const wallet = useSelector(state => state.wallet)
    const withdraws = wallet.transactions?.filter(transaction => transaction.debit_or_credit === 'credit')
    const transfers = wallet.transactions?.filter(transaction => transaction.debit_or_credit === 'debit')

    const handleSubmit = async formData => {
        SwalLoading()
        let {error, msg} = await transferBalance(formData)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Balance Transferred', 'success')
            dispatch(fetchWallet({}))
            dispatch(fetchOwnerRestaurants({status: ''}))
            form.resetFields();
        }
    }

    const onWithdraw = async value => {
        setShow(false)
        SwalLoading()
        let {error, msg} = await withdrawBalance(+value.amount)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Balance Transferred', 'success')
            dispatch(fetchWallet({}))
            dispatch(fetchOwnerRestaurants({status: ''}))
            withdrawForm.resetFields();
        }
    }

    const handleTransferAll = async () => {
        let {isConfirmed} = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to transfer all the balance to your wallet!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Transfer All!'
        })
        if (isConfirmed) {
            SwalLoading()
            let {error, msg} = await transferAllBalance()
            if (error) {
                await Swal.fire('Error', msg, 'error')
            } else {
                await Swal.fire('Success', 'All Balance Transferred', 'success')
                dispatch(fetchWallet({}))
                dispatch(fetchOwnerRestaurants({status: ''}))
            }
        }
    }


    const handlePrint = (id) => {
        let style = document.createElement("style");
        style.media = "print"
        style.innerHTML = `    
        table, th, td {
            font-size: 12px;
            border-collapse: collapse;
            min-width: 60px;
            text-align: left;
            padding: 10px 0;
        }
        table {
            width: 100%;
            padding: 5px;
            border: 1px solid rgba(0,0,0,.2);
        }
        table table {
            border: none;
        }
        th {
            padding: 5px;
            border: 1px solid rgba(0,0,0,.2);
        }
        td {
            padding: 5px;
            border: 1px solid rgba(0,0,0,.2);
        }
        .print-btn {
            display: none;
        }
        p {
            margin: 10px 0;
        }
        `
        let content = document.querySelector(`#${id}`);
        let pri = document.querySelector("#print-frame").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.head.appendChild(style);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    const onRestaurantSelect = value => {
        restaurants.data.map(restaurant => {
            if (restaurant._id === value) {
                form.setFieldsValue({
                    balance: restaurant.balance
                })
                setReload(!reload)
            }
        })
    }

    const onTransferChange = () => {
        try {
            let balance = form.getFieldValue('balance')
            let transfer = form.getFieldValue('transfer')
            form.setFieldsValue({
                remaining: (+balance - +transfer)
            })
        } catch (e) {

        }
    }

    const formattedDate = timestamp => {
        return moment(timestamp).local().format('D/M/yy hh:mm a')
    }


    return (
        <OwnerLayout>
            <div className="section-header">
                <h1>My Wallet</h1>
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title">Balance</h5>
                                    <p className="card-body h2">{wallet.balance?.toFixed(2)} TK</p>
                                    <a onClick={() => setShow(true)} className="btn btn-primary text-white">Withdraw
                                        Request</a>
                                </div>
                            </div>
                            <Modal title="Withdraw Balance" visible={show} onCancel={() => setShow(false)} footer={null}
                                   centered>
                                <Form
                                    layout="vertical"
                                    form={withdrawForm}
                                    onFinish={onWithdraw}
                                    requiredMark={false}>
                                    <Form.Item
                                        label="Withdraw Amount"
                                        name="amount"
                                        className="form-group mb-2"
                                        rules={[
                                            {required: true, message: 'Please insert transfer amount'},
                                            () => ({
                                                validator(_, value) {
                                                    if (value) {
                                                        if (isNaN(+value)) {
                                                            return Promise.reject('Please input a Number');
                                                        }
                                                        if (+value < 1) {
                                                            return Promise.reject('Not valid transfer amount')
                                                        }
                                                        if (+value > 500) {
                                                            return Promise.reject('You don\'t have sufficient balance!');
                                                        }
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input size="large" style={{width: '100%'}}/>
                                    </Form.Item>
                                    <button type="submit" className="btn btn-primary">Withdraw</button>
                                </Form>
                            </Modal>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title">Restaurant Total</h5>
                                    <p className="card-body h2">{wallet.restaurant_balace?.toFixed(2)} TK</p>
                                    <a onClick={handleTransferAll} className="btn btn-primary text-white">Transfer
                                        All</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-2">
                            <Form layout="vertical" requiredMark={false} form={form} onFinish={handleSubmit}>
                                <Card header="Transfer Balance">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <Form.Item
                                                label="Restaurant"
                                                name="restaurant_id"
                                                className="form-group"
                                                rules={[
                                                    {required: true, message: 'Please select a restaurant'},
                                                    {min: 1, message: 'Please select a restaurant'}
                                                ]}
                                            >
                                                <Select size="large" onSelect={onRestaurantSelect}>
                                                    {restaurants.data.map(restaurant => (
                                                        <Select.Option key={restaurant._id}
                                                                       value={restaurant._id}>{restaurant.name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <Form.Item
                                                label="Current balance"
                                                name="balance"
                                                className="form-group"
                                            >
                                                <Input size="large"
                                                       disabled={form.getFieldValue('restaurant_id') && form.getFieldValue('restaurant_id').length > 0 && true}/>
                                            </Form.Item>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <Form.Item
                                                label="Transfer Amount"
                                                name="transfer"
                                                className="form-group"
                                                rules={[
                                                    {required: true, message: 'Please insert transfer amount'},
                                                    ({getFieldValue}) => ({
                                                        validator(_, value) {
                                                            let balance = getFieldValue('balance')
                                                            if (value) {
                                                                if (isNaN(+value)) {
                                                                    return Promise.reject('Please input a Number');
                                                                }
                                                                if (+value < 1) {
                                                                    return Promise.reject('Not valid transfer amount')
                                                                }
                                                                if (+value > +balance) {
                                                                    return Promise.reject('You don\'t have sufficient balance!');
                                                                }
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input size="large" onChange={onTransferChange}
                                                       disabled={!form.getFieldValue('restaurant_id') || (form.getFieldValue('restaurant_id').length < 24 && true)}/>
                                            </Form.Item>

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <Form.Item
                                                label="Remaining"
                                                name="remaining"
                                                className="form-group"
                                            >
                                                <Input size="large" disabled/>
                                            </Form.Item>

                                        </div>
                                    </div>
                                    <Button type="submit" className="mb-3" variant="primary">Transfer Now</Button>
                                </Card>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <Card>
                        <div className="card-header d-flex justify-content-lg-between">
                            <h3 style={{color: '#6c757d'}}>All Withdraws</h3>
                            <div className="d-flex align-items-end">
                                <button className="btn btn-primary px-4 py-1 rounded"
                                        onClick={() => handlePrint('withdraw-report')}>Print
                                </button>
                            </div>
                        </div>
                        <div className="card-body" id="withdraw-report">
                            <h3 class="d-none" style={{textAlign: 'center', marginBottom: 10}}>WithDraw Report</h3>
                            <div className="table-responsive" style={{maxHeight: 400}}>
                                <Table pagination={false}
                                       columns={[
                                           {title: '#', dataIndex: 'key'},
                                           {title: 'Date', dataIndex: 'date'},
                                           {title: 'Amount', dataIndex: 'amount', className: 'text-right'},
                                           {title: 'Current Balance', dataIndex: 'c_balance', className: 'text-center'},
                                           {
                                               title: 'Previous Balance',
                                               dataIndex: 'p_balance',
                                               className: 'text-center'
                                           },
                                           {
                                               title: 'Status',
                                               dataIndex: 'status',
                                               className: 'text-center text-capitalize'
                                           },
                                       ]}
                                       dataSource={withdraws?.map((transition, index) => {
                                           return {
                                               key: index + 1,
                                               type: transition.debit_or_credit,
                                               amount: transition.amount.toFixed(2),
                                               c_balance: transition.current_balance.toFixed(2),
                                               p_balance: transition.previous_balance.toFixed(2),
                                               status: transition.status,
                                               date: formattedDate(+transition.createdAt)
                                           }
                                       })}/>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="card-header d-flex justify-content-lg-between">
                            <h3 style={{color: '#6c757d'}}>All Transfers</h3>
                            <div className="d-flex align-items-end">
                                <button className="btn btn-primary px-4 py-1 rounded"
                                        onClick={() => handlePrint('transfer-report')}>Print
                                </button>
                            </div>
                        </div>
                        <div className="card-body" id="transfer-report">
                            <h3 class="d-none" style={{textAlign: 'center', marginBottom: 10}}>All Transfer Report</h3>
                            <div className="table-responsive" style={{maxHeight: 400}}>
                                <Table pagination={false}
                                       columns={[
                                           {title: '#', dataIndex: 'key', key: 'key'},
                                           {title: 'Date', dataIndex: 'date'},
                                           // {title: 'Restaurant Name', dataIndex: 'name'},
                                           {
                                               title: 'Amount',
                                               dataIndex: 'amount',
                                               key: 'amount',
                                               className: 'text-right'
                                           },
                                           {
                                               title: 'Current Balance',
                                               dataIndex: 'c_balance',
                                               key: 'c_balance',
                                               className: 'text-center'
                                           },
                                           {
                                               title: 'Previous Balance',
                                               dataIndex: 'p_balance',
                                               key: 'p_balance',
                                               className: 'text-center'
                                           },
                                       ]}
                                       dataSource={transfers?.map((transition, index) => {
                                           return {
                                               key: index + 1,
                                               type: transition.debit_or_credit,
                                               name: transition.user_or_restaurant.name,
                                               amount: transition.amount.toFixed(2),
                                               c_balance: transition.current_balance.toFixed(2),
                                               p_balance: transition.previous_balance.toFixed(2),
                                               date: formattedDate(+transition.createdAt)
                                           }
                                       })}/>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <iframe id="print-frame" className="order-report"
                    style={{width: 0, height: 0, position: "absolute"}}/>
        </OwnerLayout>
    )
}

export default App
