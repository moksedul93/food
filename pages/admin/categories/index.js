import {addCategory, updateCategory} from "../../../app/features/categories"
import {SwalLoading} from "../../../components/common/swal-loading"
import AdminLayout from "../../../components/layouts/admin-layout"
import {fetchCategories} from "../../../app/slices/categories"
import InputFile from "../../../components/input/input-file"
import {useDispatch, useSelector} from "react-redux"
import {uploadImage} from "../../../app/functions"
import React, {useEffect, useState} from "react"
import {EditOutlined} from "@ant-design/icons"
import Card from "../../../components/card"
import {Form, Modal, Table} from "antd"
import {Input} from "semantic-ui-react"
import Swal from "sweetalert2"

const Categories = () => {
    let [editForm] = Form.useForm()
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);

    const dispatch = useDispatch()
    let categories = useSelector(state => state.categories)
    console.log('categories selector',categories)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    })

    useEffect(() => {
        getCategories(1, 10)
    }, [])

    const getCategories = (page, size) => {
        dispatch(fetchCategories({page, size})).then(({payload}) => {
            setPagination({
                current: page,
                pageSize: size,
                total: payload.data.totalDocs
            })
        })
    }

    const handleTableChange = pagination => {
        getCategories(pagination.current, pagination.pageSize)
    }

    let columns = [
        {title: '#', dataIndex: 'key', key: 'key'},
        {title: 'Thumb Image', dataIndex: 'image_url', key: 'image_url', render: (url) => <img src={url} height={40} alt=""/>},
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {
            title: 'Action', render: category => {
                const handleEdit = category => {
                    setEdit(true)
                    editForm.setFieldsValue({_id: category._id, name: category.name, image_url: []})
                    if (typeof category.image_url === 'string' && category.image_url.length > 5) {
                        editForm.setFieldsValue({ image_url: [{uid: '-1', name: 'image.png', status: 'done', url: category.image_url }]
                        })
                    }
                }
                return (
                    <EditOutlined onClick={() => handleEdit(category)} style={{fontSize: 20, cursor: 'pointer'}}/>
                )
            }
        }
    ]


    return (
        <AdminLayout>
            <div className="row" id="category_body">
                <div className="col-lg-12">
                    <Card>
                        <div className="card-header">
                            <h4 className="d-inline">Food Categories</h4>
                            <div className="card-header-action">
                                <button className="btn btn-primary" onClick={() => setAdd(true)}>Add New</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    pagination={pagination}
                                    onChange={handleTableChange}
                                    loading={categories.loading}
                                    dataSource={categories.data.map((category, index) => {
                                        return {
                                            key: ( pagination.current-1 ) * pagination.pageSize + index + 1,
                                            ...category
                                        }
                                    })}/>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <AddForm visible={add} setVisible={setAdd} getCategories={getCategories}/>
            <EditForm visible={edit} setVisible={setEdit} form={editForm} getCategories={getCategories} pagination={pagination}/>
        </AdminLayout>
    )
}

export default Categories

const AddForm = ({visible, setVisible, getCategories}) => {
    let [form] = Form.useForm()

    const handleAdd = async category => {
        setVisible(false)
        SwalLoading()
        let image_url = ''
        if (category.image_url.length > 0) {
            let {originFileObj} = category.image_url[0]
            image_url = await uploadImage(originFileObj)
        }
        category.image_url = image_url
        let {error, msg} = await addCategory(category)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Category added', 'success')
            getCategories(1, 10)
        }
    }

    return (
        <Modal title="Add Category" visible={visible} onCancel={() => setVisible(false)} footer={null} centered>
            <Form
                layout="vertical"
                requiredMark={false}
                form={form}
                onFinish={handleAdd}>
                <Form.Item
                    label="Category Name"
                    name="name"
                    className="form-group"
                    rules={[
                        {required: true, message: 'Please insert a category name'}
                    ]}
                >
                    <Input size="large" style={{width: '100%'}}/>
                </Form.Item>
                <InputFile form={form} name='image_url' aspect={250 / 200}/>
                <button className="btn btn-primary">Add Category</button>
            </Form>
        </Modal>
    )
}

const EditForm = ({visible, setVisible, form, getCategories, pagination}) => {
    const handleUpdate = async category => {
        setVisible(false)
        SwalLoading()
        let image_url = ''
        if (category.image_url.length > 0) {
            if (category.image_url[0].uid === '-1') {
                image_url = category.image_url[0].url
            } else {
                let {originFileObj} = category.image_url[0]
                image_url = await uploadImage(originFileObj)
            }
        }
        category.image_url = image_url
        let {error, msg} = await updateCategory(category)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Category updated', 'success')
            getCategories(pagination.current, pagination.pageSize)
        }
    }
    return (
        <Modal title="Edit Category" visible={visible} onCancel={() => setVisible(false)} footer={null} centered>
            <Form
                layout="vertical"
                requiredMark={false}
                form={form}
                onFinish={handleUpdate}>
                <Form.Item name="_id" style={{display: "none"}}><Input/></Form.Item>
                <Form.Item
                    label="Category Name"
                    name="name"
                    className="form-group"
                    rules={[
                        {required: true, message: 'Please insert a category name'}
                    ]}
                >
                    <Input size="large" style={{width: '100%'}}/>
                </Form.Item>
                <InputFile form={form} name='image_url' aspect={250 / 200}/>
                <button className="btn btn-primary">Update Category</button>
            </Form>
        </Modal>
    )
}