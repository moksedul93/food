import AdminLayout from "../../../components/layouts/admin-layout";
import React, {useEffect, useState} from "react";
import Card from "../../../components/card";
import {Form, Input, Modal, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {Table} from 'antd'
import {EyeOutlined} from "@ant-design/icons";
import Swal from "sweetalert2";
import {SwalLoading} from "../../../components/common/swal-loading";
import {fetchAgencies} from "../../../app/slices/agencies";
import {updateAgency} from "../../../app/features/agencies";

const {Option} = Select;

const Agencies = () => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [status, setStatus] = useState(undefined)
    const [show, setShow] = useState(false)

    let agencies = useSelector(state => state.agencies)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        setStatus(urlParams.get('status'))
        let status = urlParams.get('status')
        setStatus(status)
        getAgencies(status || '', 1, 10, urlParams.get('id'))
    }, [])

    const getAgencies = (status, page, size, current) => {
        dispatch(fetchAgencies({status, page, size})).then(({payload}) => {
            setPagination({
                current: page,
                pageSize: size,
                total: payload.data.totalDocs
            })
            if (current) {
                payload.data.docs.map(agency => {
                    if (current === agency._id) {
                        currentAgency(agency)
                        setShow(true)
                    }
                })
            }
        })
    }


    const handleStatusChange = value => {
        dispatch(fetchAgencies({status: value || ''}))
        setStatus(value)
    }
    const handleTableChange = pagination => {
        getAgencies( status || '', pagination.current, pagination.pageSize )
    }

    const currentAgency = agency => {
        form.setFieldsValue({
            ...agency,
            mobile: agency.mobile.replace('+880', ''),
            rejection_msg: (agency.status === 'cancelled' || agency.status === 'suspended') ?  agency.rejection_msg : ''
        })
        setShow(true)
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
                    {status === 'pending' && (<div className="badge badge-pill badge-danger mt-3">Pending</div>)}
                    {status === 'approved' && (<div className="badge badge-pill badge-primary mt-3">Approved</div>)}
                    {status === 'suspended' && (<div className="badge badge-pill badge-secondary mt-3">Suspended</div>)}
                    {status === 'cancelled' && (<div className="badge badge-pill badge-dark mt-3">Cancelled</div>)}
                </>
            ),
        },
        {
            title: 'Action',
            render: agency => (
                <EyeOutlined className="px-2 py-1 c-pointer rounded bg-primary text-white" style={{fontSize: 18}}
                             onClick={() => currentAgency(agency)}/>
            ),
        },
    ]


    return (
        <AdminLayout>
            <Card>
                <div className="card-header">
                    <h3 style={{color: '#6c757d'}}>Agencies</h3>
                    <Select
                        className="position-absolute"
                        aria-placeholder="Status"
                        value={status}
                        onChange={handleStatusChange}
                        style={{width: 170, right: 26, float: "right"}}
                        size="large" placeholder="Status" allowClear>
                        <Select.Option id="1" value="pending">Pending</Select.Option>
                        <Select.Option id="2" value="approved">Approved</Select.Option>
                        <Select.Option id="3" value="cancelled">Cancelled</Select.Option>
                        <Select.Option id="4" value="suspended">Suspended</Select.Option>
                    </Select>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table
                            className="table"
                            columns={columns}
                            pagination={pagination}
                            loading={agencies.loading}
                            onChange={handleTableChange}
                            dataSource={agencies.data.map((agency, index) => {
                                return {
                                    key: ( pagination.current-1 ) * pagination.pageSize + index + 1,
                                    ...agency
                                }
                            })}/>
                    </div>
                </div>
            </Card>

            <Agency visible={show} setVisible={setShow} form={form} getAgencies={getAgencies} status={status} pagination={pagination}/>

        </AdminLayout>
    )
}

export default Agencies


const Agency = ({visible, setVisible, form, getAgencies, pagination, status}) => {
    const [reload, setReload] = useState(false)
    const handleSubmit = async agency => {
        setVisible(false)
        SwalLoading()
        agency.email = agency.email || ''
        agency.password = agency.password || ''
        agency.mobile = '+880' + agency.mobile
        const {error, msg} = updateAgency({agency})
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Agency updated successfully', 'success')
            getAgencies(status, pagination.current, pagination.pageSize, null)
        }
    }


    return (
        <Modal title="Agency Details" style={{top: 20}} visible={visible} onCancel={() => setVisible(false)}
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
                                {min: 8, message: 'Password must have 8 characters!'}
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