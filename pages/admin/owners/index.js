import AdminLayout from "../../../components/layouts/admin-layout";
import React, {useEffect, useState} from "react";
import Card from "../../../components/card";
import {Form, Input, Modal, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {Table} from 'antd'
import {EyeOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import Swal from "sweetalert2";
import {SwalLoading} from "../../../components/common/swal-loading";
import Link from "next/link";
import {fetchOwners} from "../../../app/slices/owners";
import {updateOwner} from "../../../app/features/owners";

const {Option} = Select;

const Owners = () => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [status, setStatus] = useState()
    const [show, setShow] = useState(false)

    let owners = useSelector(state => state.owners)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        let status = urlParams.get('status')
        setStatus(status)
        getOwners(status, 1, 10, urlParams.get('id'))
    }, [])

    const getOwners = (status, page, size, current) => {
        dispatch(fetchOwners({status, page, size})).then(({payload}) => {
            setPagination({
                current: page,
                pageSize: size,
                total: payload.data.totalDocs
            })
            if (current) {
                payload.data.docs.map(owner => {
                    if (current === owner._id) {
                        currentOwner(owner)
                    }
                })
            }
        })
    }
    const currentOwner = owner => {
        form.setFieldsValue({
            ...owner,
            mobile: owner.mobile.replace('+880', ''),
            rejection_msg: (owner.status === 'cancelled' || owner.status === 'suspended') ?  owner.rejection_msg : ''
        })
        setShow(true)
    }

    const handleStatusChange = value => {
        setStatus(value)
        getOwners( value, 1, 10 )
    }

    const handleTableChange = pagination => {
        getOwners( status || '', pagination.current, pagination.pageSize )
    }

    let columns = [
        {title: '#', dataIndex: 'key'},
        {title: 'First Name', dataIndex: 'first_name'},
        {title: 'Last Name', dataIndex: 'last_name'},
        {title: 'Mobile', dataIndex: 'mobile'},
        {title: 'Email', dataIndex: 'email'},
        {
            title: 'Status',
            dataIndex: 'status',
            render: status => (
                <>
                    {status === 'pending' && (
                        <div className="badge badge-pill badge-danger mt-3">Pending</div>
                    )}
                    {status === 'approved' && (
                        <div className="badge badge-pill badge-primary mt-3">Approved</div>
                    )}
                    {status === 'suspended' && (
                        <div className="badge badge-pill badge-secondary mt-3">Suspended</div>
                    )}
                    {status === 'cancelled' && (
                        <div className="badge badge-pill badge-dark mt-3">Cancelled</div>
                    )}
                </>
            ),
        },
        {
            title: 'Action',
            render: user => (
                <>
                    <Link href={"/admin/products/all?id=" + user._id}>
                        <ShoppingCartOutlined className="px-2 py-1 c-pointer rounded bg-primary text-white mr-3"
                                              style={{fontSize: 18}}/>
                    </Link>
                    <EyeOutlined className="px-2 py-1 c-pointer rounded bg-primary text-white" style={{fontSize: 18}}
                                 onClick={() => currentOwner(user)}/>
                </>

            ),
        },
    ]


    return (
        <AdminLayout>
            <Card>
                <div className="card-header">
                    <h3 style={{color: '#6c757d'}}>Owners</h3>
                    <Select
                        className="position-absolute"
                        aria-placeholder="Status"
                        value={status}
                        onChange={handleStatusChange}
                        style={{width: 170, right: 26, float: "right"}}
                        size="large" placeholder="Status" allowClear>
                        <Select.Option value="pending">Pending</Select.Option>
                        <Select.Option value="approved">Approved</Select.Option>
                        <Select.Option value="cancelled">Cancelled</Select.Option>
                        <Select.Option value="suspended">Suspended</Select.Option>
                    </Select>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table
                            className="table"
                            columns={columns}
                            pagination={pagination}
                            loading={owners.loading}
                            onChange={handleTableChange}
                            dataSource={owners.data.map((owner, index) => {
                                return {
                                    key: ( pagination.current-1 ) * pagination.pageSize + index + 1,
                                    ...owner
                                }
                            })}/>
                    </div>
                </div>
            </Card>
            <UpdateOwner visible={show} setVisible={setShow} form={form} getOwners={getOwners} pagination={pagination} status={status}/>
        </AdminLayout>
    )
}

export default Owners


const UpdateOwner = ({visible, setVisible, form, getOwners, pagination, status}) => {
    const [reload, setReload] = useState(false)
    const handleSubmit = async owner => {
        setVisible(false)
        SwalLoading()
        owner.email = owner.email || ''
        owner.password = owner.password || ''
        owner.mobile = '+880' + owner.mobile
        const {error, msg} = await updateOwner(owner)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Owner updated successfully', 'success')
            getOwners(status, pagination.current, pagination.pageSize, null)
        }
    }


    return (
        <Modal title="Owner Details" style={{top: 20}} visible={visible} onCancel={() => setVisible(false)}
               footer={null}>
            <div>
                <Form layout="vertical" requiredMark={false} form={form} onFinish={handleSubmit}>
                    <Form.Item className="d-none" name="_id"><Input/></Form.Item>

                    <Form.Item
                        label="First Name"
                        name="first_name"
                        className="form-group"
                        rules={[
                            {required: true, message: 'Please provide your first name'}
                        ]}>
                        <Input size="large"/>
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="last_name"
                        className="form-group"
                        rules={[
                            {required: true, message: 'Please provide your last name'}
                        ]}>
                        <Input size="large"/>
                    </Form.Item>


                    <Form.Item
                        label="Phone Number"
                        name="mobile"
                        className="form-group"
                        rules={
                            [
                                {required: true, message: 'Please input your phone number!'},
                                {pattern: /\d\d\d\d\d\d\d\d\d\d/, message: 'Please input a valid phone number!'}
                            ]
                        }
                    >
                        <Input addonBefore="+880" maxLength={10} size="large"/>
                    </Form.Item>


                    <Form.Item
                        label="Email (Optional)"
                        name="email"
                        className="form-group"
                        rules={[
                            {
                                pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                                message: 'Please input a valid Email!'
                            }
                        ]}>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        className="form-group"
                        rules={
                            [
                                {min: 6, message: 'Password must have 8 characters!'}
                            ]
                        }>
                        <Input.Password size="large"/>
                    </Form.Item>
                    <Form.Item
                        label="NID"
                        name="national_id"
                        className="form-group"
                        rules={
                            [
                                {required: true, message: 'Please input your NID Number!'},
                                {pattern: /^(0|[1-9][0-9]*)$/, message: 'Please input valid NID Number!'}
                            ]
                        }>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="owner_address"
                        className="form-group"
                        rules={[
                            {required: true, message: 'Please provide your Address'}
                        ]}>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        className="form-group"
                        rules={[
                            {required: true, message: 'Please provide your Status'}
                        ]}>
                        <Select size="large" onChange={() => setReload(!reload)}>
                            <Option id="pending" value="pending">Pending</Option>
                            <Option id="approved" value="approved">Approved</Option>
                            <Option id="cancelled" value="cancelled">Cancelled</Option>
                            <Option id="suspended" value="suspended">Suspended</Option>
                        </Select>
                    </Form.Item>

                    {(form.getFieldValue('status') === 'cancelled' || form.getFieldValue('status') === 'suspended') && (
                        <Form.Item
                            label="Note"
                            name="rejection_msg">
                            <Input.TextArea rows={2} size="large"/>
                        </Form.Item>
                    )}

                    <button type="submit" className="btn btn-primary">Update</button>
                </Form>
            </div>
        </Modal>
    )
}
