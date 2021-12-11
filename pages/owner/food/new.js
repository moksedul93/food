import React, {useEffect, useState} from "react";
import OwnerLayout from "../../../components/layouts/owner-layout";
import Card from "../../../components/card";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import {Form, Space, Input, Select} from "antd";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {uploadImage} from "../../../app/functions";
import {SwalLoading} from "../../../components/common/swal-loading";
import InputFile from "../../../components/input/input-file";
import {fetchOwnerRestaurants} from "../../../app/slices/restaurants";
import {addFood} from "../../../app/features/foods";


const App = () => {
    let [form] = Form.useForm()
    const dispatch = useDispatch()
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if (!loaded) {
            setLoaded(true)
            dispatch(fetchOwnerRestaurants({status: 'approved'}))
        }
    })
    const restaurants = useSelector(state => state.restaurants)
    const [categories, setCategories] = useState([])
    const onRestaurantSelect = value => {
        restaurants.data.map(restaurant => {
            if (restaurant._id === value) {
                setCategories(restaurant.food_categories)
            }
        })
    }

    const onSubmit = async food => {
        SwalLoading()
        let dish_img = ''
        if (food.dish_img.length > 0) {
            let {originFileObj} = food.dish_img[0]
            dish_img = await uploadImage(originFileObj)
        }
        food.description = food.description || ''
        food.dish_img = dish_img
        food.price = +food.price
        food.price_and_size = food.price_and_size || []
        food.price_and_size.map(variation => {
            variation.price = +variation.price
        })
        let {error, msg} = await addFood(food)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Food added', 'success')
            form.resetFields();
        }
    }

    return (
        <OwnerLayout>
            <div className="section-header">
                <h3>Add a new Product</h3>
            </div>
            <Form layout="vertical" requiredMark={false} form={form} onFinish={onSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <Card header="Food Information">
                            <Form.Item
                                label="Restaurant"
                                name="restaurant_id"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please select a restaurant'}
                                ]}
                            >
                                <Select size="large" onSelect={onRestaurantSelect}>
                                    {restaurants.data.map(restaurant => (
                                        <Select.Option key={restaurant._id}
                                                       value={restaurant._id}>{restaurant.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Food Category"
                                name="food_categories_id"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please select a food category'}
                                ]}
                            >
                                <Select size="large">
                                    {categories.map(category => (
                                        <Select.Option key={category._id}
                                                       value={category._id}>{category.name}</Select.Option>
                                    ))}
                                </Select>

                            </Form.Item>

                            <Form.Item
                                label="Food Name"
                                name="name"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please insert food name'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>

                            <Form.Item
                                label="Food Price"
                                name="price"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please insert food price'},
                                    {
                                        pattern: /^\$?(?=\(.*\)|[^()]*$)\(?\d{1,3}(,?\d{3})?(\.\d\d?)?\)?$/,
                                        message: 'Please insert valid food price'
                                    },
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="Food Description"
                                name="description"
                                rules={[
                                    {required: true, message: 'Please insert description'}
                                ]}
                            >
                                <Input.TextArea size="large" rows={3}/>
                            </Form.Item>
                        </Card>
                    </div>
                    <div className="col-md-5">
                        <Card>
                            <div className="card-header">
                                <h4 style={{color: '#6c757d'}}>Food Variations</h4>
                            </div>
                            <div className="card-body">
                                <Form.List name="price_and_size" className="form-group">
                                    {(fields, {add, remove}) => (
                                        <>
                                            {fields.map(field => (
                                                <Space key={field.key} size="large"
                                                       style={{display: 'flex', marginBottom: 8}}
                                                       align="baseline">
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'size']}
                                                        fieldKey={[field.fieldKey, 'size']}
                                                        rules={[{required: true, message: 'Insert Size'}]}
                                                    >
                                                        <Input placeholder="Size"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'price']}
                                                        fieldKey={[field.fieldKey, 'price']}
                                                        rules={[
                                                            {required: true, message: 'Insert Price'},
                                                            {
                                                                pattern: /^\$?(?=\(.*\)|[^()]*$)\(?\d{1,3}(,?\d{3})?(\.\d\d?)?\)?$/,
                                                                message: 'Please insert valid price'
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Price"/>
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <div style={{float: "left"}}>
                                                    <Button type="dashed" onClick={() => add()} block
                                                            icon={<PlusOutlined/>}>
                                                        Add Variation
                                                    </Button>
                                                </div>

                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </div>
                        </Card>
                        <Card header="Food Image">
                            <InputFile form={form} name='dish_img' aspect={1} required/>
                            <Button variant="primary" type="submit">Add Food</Button>
                        </Card>
                    </div>
                </div>
            </Form>
        </OwnerLayout>
    )
}

export default App
