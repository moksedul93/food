import {SwalLoading} from "../../../components/common/swal-loading";
import AdminLayout from "../../../components/layouts/admin-layout";
import {addPlan, updatePlan} from "../../../app/features/plans";
import {Form, Input, Modal, Select, Table} from "antd";
import {fetchPlans} from "../../../app/slices/plans";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import Card from "../../../components/card";
import Swal from "sweetalert2";

let {Option} = Select

const Plans = () => {
    let dispatch = useDispatch()
    let [editForm] = Form.useForm()
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    useEffect(() => {
        dispatch(fetchPlans({}))
    })
    const plans = useSelector(state => state.plans)


    let columns = [
        {title: '#', dataIndex: 'key'},
        {title: 'Title', dataIndex: 'title'},
        {title: 'Commission', dataIndex: 'commision', render: commission => `${commission} %`},
        {title: 'Feature', dataIndex: 'feature', className: 'text-capitalize'},
        {
            title: 'Action', render: plan => {
                return (
                    <a className="table-action c-pointer text-primary mr-2" onClick={() => {
                        setEdit(true)
                        editForm.setFieldsValue(plan)
                    }}>
                        <i className="fas fa-edit" style={{fontSize: 17}}/>
                    </a>
                )
            }
        },
    ]

    return (
        <AdminLayout>
            <div className="row" id="category_body">
                <div className="col-lg-12">
                    <Card>
                        <div className="card-header">
                            <h4 className="d-inline">Plans</h4>
                            <div className="card-header-action">
                                <button className="btn btn-primary" onClick={() => setAdd(true)}>Add New</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={plans.data.map((plan, index) => {
                                    return {
                                        key: index + 1,
                                        ...plan
                                    }
                                })}/>
                            </div>
                        </div>
                        <AddPlan visible={add} setVisible={setAdd}/>
                        <EditPlan visible={edit} setVisible={setEdit} form={editForm}/>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Plans

const AddPlan = ({visible, setVisible}) => {
    let [form] = Form.useForm()
    let dispatch = useDispatch()

    const handleAddPlan = async plan => {
        plan.commision = +plan.commision
        setVisible(false)
        SwalLoading()
        let {error, msg} = await addPlan(plan)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Plan added Successfully', 'success')
            dispatch(fetchPlans({}))
            form.resetFields()
        }
    }


    return (
        <Modal title="Add Plan" visible={visible} onCancel={() => setVisible(false)} footer={null}>
            <Form layout="vertical" form={form} onFinish={handleAddPlan} requiredMark={false}>
                <Form.Item
                    label="Title"
                    name='title'
                    rules={[
                        {required: true, message: 'Please provide a Title'},
                    ]}
                >
                    <Input size="large"/>
                </Form.Item>
                <Form.Item
                    label="Commission"
                    name='commision'
                    rules={[
                        {required: true, message: 'Please provide a percentage'},
                        {pattern: /^[1-9]\d*$/, message: 'Please provide valid percentage'}
                    ]}
                >
                    <Input size="large" suffix="%"/>
                </Form.Item>
                <Form.Item
                    label="Featured"
                    name="feature"
                    className="form-group"
                    rules={[
                        {required: true, message: 'Please provide feature'}
                    ]}>
                    <Select size="large">
                        <Option value="top">Top</Option>
                        <Option value="basic">Basic</Option>
                    </Select>
                </Form.Item>
                <button className="btn btn-primary">Add Plan</button>
            </Form>
        </Modal>
    )
}

const EditPlan = ({visible, setVisible, form}) => {
    const dispatch = useDispatch()

    const handleUpdatePlan = async plan => {
        plan.commision = +plan.commision
        setVisible(false)
        SwalLoading()
        let {error, msg} = await updatePlan(plan)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Plan update Successfully', 'success')
            dispatch(fetchPlans({}))
        }
    }

    return (
        <Modal title="Edit Plan" visible={visible} onCancel={() => setVisible(false)} footer={null}>
            <Form layout="vertical" form={form} onFinish={handleUpdatePlan} requiredMark={false}>
                <Form.Item name="_id" hidden><input/></Form.Item>
                <Form.Item
                    label="Title"
                    name='title'
                    rules={[
                        {required: true, message: 'Please provide a Title'},
                    ]}
                >
                    <Input size="large"/>
                </Form.Item>
                <Form.Item
                    label="Commission"
                    name='commision'
                    rules={[
                        {required: true, message: 'Please provide a percentage'},
                        {pattern: /^[1-9]\d*$/, message: 'Please provide valid percentage'}
                    ]}
                >
                    <Input size="large" suffix="%"/>
                </Form.Item>
                <Form.Item
                    label="Featured"
                    name="feature"
                    className="form-group"
                    rules={[
                        {required: true, message: 'Please provide feature'}
                    ]}>
                    <Select size="large">
                        <Option value="top">Top</Option>
                        <Option value="basic">Basic</Option>
                    </Select>
                </Form.Item>
                <button className="btn btn-primary">Update Plan</button>
            </Form>
        </Modal>
    )
}