import OwnerLayout from "../../../components/layouts/owner-layout";
import React, {useEffect, useState} from "react";
import {fetchCategories} from "../../../app/slices/categories";
import {useDispatch, useSelector} from "react-redux";
import {fetchOneRestaurant} from "../../../app/slices/restaurant";
import Card from "../../../components/card";
import {Form, Modal, Select, Table} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import Swal from "sweetalert2";
import {addRestaurantFoodCategory, deleteRestaurantFoodCategory} from "../../../app/features/categories";

const Categories = () => {
    let dispatch = useDispatch()
    const [add, setAdd] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        dispatch(fetchCategories({page: 0, size: 0}))
        dispatch(fetchOneRestaurant({id}))
    }, [])

    let restaurant = useSelector(state => state.restaurant.data)
    let categories = useSelector(state => state.categories.data)
    let columns = [
        {title: '#', dataIndex: 'key', key: 'key'},
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {title: 'Foods', dataIndex: 'foods', render: foods => foods?.length},
        {
            title: 'Action', render: category => {
                return (
                    <DeleteOutlined onClick={() => handleDelete(category)} style={{fontSize: 20, cursor: 'pointer'}}/>
                )
            }
        }
    ]

    const handleAdd = async value => {
        let {category} = value
        let previous = restaurant.food_categories.find(food_category => food_category._id === category)
        if(previous) {
            await Swal.fire('Error', 'Category already exists', 'error')
            return;
        }
        category = categories.find(food_category => food_category._id === category)
        let {error, msg} = await addRestaurantFoodCategory(restaurant._id, category._id, category.name)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Category added', 'success')
            dispatch(fetchOneRestaurant({id: restaurant._id}))
            setAdd(false)
        }
    }

    const handleDelete = async category => {
        let {isConfirmed} = await Swal.fire({
            title: 'Warning',
            icon: 'warning',
            html: `<p>Are You want to delete the category?<br/>
                    ${category.foods.length > 0 ?
                        `You have ${category.foods.length} ${category.foods.length > 1 ? 'foods' : 'food' } in this category.<br/> All will be removed.`:
                        ''}</p>`,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
        })
        if(isConfirmed) {
            let {error, msg} = await deleteRestaurantFoodCategory(restaurant._id, category._id)
            if (error) {
                await Swal.fire('Error', msg, 'error')
            } else {
                await Swal.fire('Success', 'Category removed', 'success')
                dispatch(fetchOneRestaurant({id: restaurant._id}))
                setAdd(false)
            }
        }
    }

    return (
        <OwnerLayout>
            <div className="row" id="category_body">
                <div className="col-lg-12">
                    <Card>
                        <div className="card-header">
                            <h4 className="d-inline">{restaurant?.name}'s food Categories</h4>
                            <div className="card-header-action">
                                <button className="btn btn-primary" onClick={() => setAdd(true)}>Add New</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={restaurant?.food_categories?.map((category, index) => {
                                        return {
                                            key: index + 1,
                                            ...category
                                        }
                                    })}/>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Modal title="Add Category" visible={add} onCancel={() => setAdd(false)} footer={null} centered>
                <Form layout="vertical" requiredMark={false} onFinish={handleAdd}>
                    <Form.Item label="Category" name="category" rules={[{required: true, message: 'Select a category'}]}>
                        <Select
                            size="large"
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {categories.map(category => (
                                <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <button className="btn btn-primary">Add Category</button>
                </Form>
            </Modal>
        </OwnerLayout>
    )
}
export default Categories