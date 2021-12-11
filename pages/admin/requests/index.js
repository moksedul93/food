import AdminLayout from "../../../components/layouts/admin-layout";
import Card from "../../../components/card";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Modal, Select, Table, Form, Input} from "antd";
import {SwalLoading} from "../../../components/common/swal-loading";
import Swal from "sweetalert2";
import {fetchTransactions} from "../../../app/slices/transactions";
import {updateTransaction} from "../../../app/features/transactions";

const {Option} = Select;

const App = () => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState('pending')
    const [transaction, setTransaction] = useState({})

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        let id = urlParams.get('id')
        getTransactions(status, 1, 10, id)
    }, [])


    const getTransactions = (status, page, size, current) => {
        dispatch(fetchTransactions({status, page, size})).then(({payload}) => {
            setPagination({
                current: page,
                pageSize: size,
                total: payload.data.totalDocs
            })
            if (current && current.length === 24) {
                payload.data.docs.map(transaction => {
                    if (transaction._id === current) {
                        setTransaction({
                            name: transaction.user_or_restaurant.first_name + " " + transaction.user_or_restaurant.last_name,
                            mobile: transaction.user_or_restaurant.mobile,
                            amount: transaction.amount.toFixed(2),
                            p_balance: transaction.previous_balance.toFixed(2),
                            c_balance: transaction.current_balance.toFixed(2),
                        })
                        form.setFieldsValue(transaction)
                        setShow(true)
                    }
                })
            }
        })
    }


    const handleStatusChange = value => {
        dispatch(fetchTransactions({status: value, page: 1, size: 10}))
        setStatus(value)
    }

    const handleTableChange = pagination => {
        getTransactions(status, pagination.current, pagination.pageSize)
    }

    const handleUpdateTransaction = async transaction => {
        setShow(false)
        SwalLoading()
        let {error, msg} = await updateTransaction(transaction)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Plan update Successfully', 'success')
            getTransactions(status , pagination.current, pagination.pageSize)
        }
    }

    let transactions = useSelector(state => state.transactions)
    let columns = [
        {title: '#', dataIndex: 'key'},
        {title: 'Owner Name', dataIndex: 'name'},
        {title: 'Owner Mobile', dataIndex: 'mobile', className: 'text-center'},
        {title: 'Amount', dataIndex: 'amount', className: 'text-right'},
        {title: 'Previous Balance', dataIndex: 'p_balance', className: 'text-right'},
        {title: 'Current Balance', dataIndex: 'c_balance', className: 'text-right'},
        {
            title: 'Status',
            dataIndex: 'status',
            className: 'text-center',
            render: status => (
                <>
                    {status === 'pending' && (
                        <div className="badge badge-pill badge-danger mt-3">Pending</div>
                    )}
                    {status === 'success' && (
                        <div className="badge badge-pill badge-primary mt-3">Success</div>
                    )}
                </>
            )
        },
        {
            title: 'Action',
            render: transaction => (
                <a className="text-primary table-action c-pointer" onClick={() => {
                    setTransaction(transaction)
                    form.setFieldsValue(transaction)
                    setShow(true)
                }}><i className="fa fa-eye"/> </a>
            )
        },

    ]


    return (
        <AdminLayout>
            <div className="row">
                <div className="col-12 mt-2">
                    <Card>
                        <div className="card-header flex justify-content-between">
                            <h3>Transactions</h3>
                            <Select size="large" value={status} onChange={handleStatusChange} style={{width: 150}}>
                                <Option value="pending">Pending</Option>
                                <Option value="success">Success</Option>
                            </Select>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <Table columns={columns} pagination={pagination} loading={transaction.loading} onChange={handleTableChange}
                                       dataSource={transactions.data.map((transaction, index) => {
                                           return {
                                               _id: transaction._id,
                                               key: index + 1,
                                               name: transaction.user_or_restaurant.first_name + " " + transaction.user_or_restaurant.last_name,
                                               mobile: transaction.user_or_restaurant.mobile,
                                               amount: transaction.amount.toFixed(2),
                                               p_balance: transaction.previous_balance.toFixed(2),
                                               c_balance: transaction.current_balance.toFixed(2),
                                               status: transaction.status,
                                               reason: transaction.reason
                                           }
                                       })}/>
                            </div>
                        </div>

                        <Modal title="Transaction Details" visible={show} onCancel={() => setShow(false)} footer={null}>
                            <div style={{fontSize: 16}}>
                                <p>Owner Name: <b>{transaction.name}</b></p>
                                <p>Owner Mobile: <b>{transaction.mobile}</b></p>
                                <p>Requested Amount: <b>{transaction.amount}</b></p>
                                <p>Current Balance: <b>{transaction.c_balance}</b></p>
                                <p>Previous Balance: <b>{transaction.p_balance}</b></p>
                                <Form layout="vertical" requiredMark={false} form={form}
                                      onFinish={handleUpdateTransaction}>
                                    <Form.Item name="_id" className="d-none"><input/></Form.Item>
                                    <Form.Item label="Status" name="status">
                                        <Select size="large">
                                            <Option value="pending">Pending</Option>
                                            <Option value="success">Success</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Reason" name="reason">
                                        <Input.TextArea size={"large"}/>
                                    </Form.Item>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </Form>
                            </div>
                        </Modal>

                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}

export default App
