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
import {useRouter} from "next/router";
import InputFile from "../../../components/input/input-file";
import {getFood, updateFood} from "../../../app/features/foods";
import {fetchOwnerRestaurants} from "../../../app/slices/restaurants";

const App = () => {
    let [form] = Form.useForm()
    const router = useRouter()
    const dispatch = useDispatch()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const restaurant_id = urlParams.get('restaurant_id')
        const category_id = urlParams.get('category_id')
        getFood({
            _id: id,
            restaurant_id: restaurant_id,
            food_categories_id: category_id
        }).then(({error, data}) => {
            if (error) {
                router.push('/user/products/all').then(() => {
                })
            } else {
                let food = data
                form.setFieldsValue(food)
                if (food.dish_img.length > 5) {
                    form.setFieldsValue({
                        'dish_img': [
                            {
                                uid: '-1',
                                name: 'image.png',
                                status: 'done',
                                url: food.dish_img,
                            }
                        ]
                    })
                }
                dispatch(fetchOwnerRestaurants({status: 'approved'})).then(({payload}) => {
                    payload.data.forEach(restaurant => {
                        restaurant.food_categories.forEach(category => {
                            category.foods.forEach(aFood => {
                                if (aFood._id === food._id) {
                                    form.setFieldsValue({
                                        restaurant_id: restaurant._id,
                                        food_categories_id: category._id
                                    })
                                    setCategories(restaurant.food_categories)
                                }
                            })
                        })
                    })
                })
            }
        })

    }, [])
    const restaurants = useSelector(state => state.restaurants)

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
            if (food.dish_img[0].uid === '-1') {
                dish_img = food.dish_img[0].url
            } else {
                let {originFileObj} = food.dish_img[0]
                dish_img = await uploadImage(originFileObj)
            }
        }
        food.dish_img = dish_img
        food.description = food.description || ''
        food.price = +food.price
        food.price_and_size = food.price_and_size.map(variation => {
            return {
                size: variation.size,
                price: +variation.price
            }
        })
        let {error, msg} = await updateFood(food)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Food added', 'success')
        }

    }


    return (
        <OwnerLayout>
            <div className="section-header">
                <h3>Edit Food</h3>
            </div>
            <Form layout="vertical" requiredMark={false} form={form} onFinish={onSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <Card header="Food Information">
                            <Form.Item name="_id" hidden><Input/></Form.Item>
                            <Form.Item name="dish_img" hidden><Input/></Form.Item>

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
                            <InputFile form={form} name='dish_img' aspect={1} requried/>
                            <Button variant="primary" type="submit">Update</Button>
                        </Card>
                    </div>
                </div>
            </Form>
        </OwnerLayout>
    )
}

export default App
