import InputPlacesMap from "../../../components/input/input-places-map"
import {SwalLoading} from "../../../components/common/swal-loading"
import OwnerLayout from "../../../components/layouts/owner-layout"
import {fetchCategories} from "../../../app/slices/categories"
import InputFile from "../../../components/input/input-file"
import {fetchPlans} from "../../../app/slices/plans"
import {useDispatch, useSelector} from "react-redux"
import {uploadImage} from "../../../app/functions"
import React, {useEffect, useState} from "react"
import Button from "react-bootstrap/Button"
import Card from "../../../components/card"
import {Form, Input,Switch, Select} from 'antd'
import {useRouter} from "next/router"
import Swal from "sweetalert2"
import {getRestaurant, updateRestaurant} from "../../../app/features/restaurant";

const App = () => {
    const [openingTime,setOpeningTime]=useState('');
    const [closingTime,setClosingTime]=useState('');
    const [resturant,setResturant]=useState({});
    console.log("opentime",openingTime)
    console.log("closetime",closingTime)

    let router = useRouter()
    const [form] = Form.useForm()
    let dispatch = useDispatch()
    let [refresh, setRefresh] = useState()
    let reload = () => setRefresh(!refresh)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        dispatch(fetchCategories({page: 0, size: 0}))
        getRestaurant(id).then(({error, data}) => {
            
            // console.log("restaurantinfo",data)
            setOpeningTime(data?.opening_hour)
            setClosingTime(data?.closing_hour)
            
            if (error) {
                router.push('/user').then(() => {
                })
            } else {
                let restaurant = data
                form.setFieldsValue({
                    ...restaurant,                   
                    food_categories: restaurant.food_categories.map(category => category._id),
                    plan: restaurant.plan.title,
                    cover_img: [],
                    thumb_img: []
                })
                if (restaurant.cover_img.length > 5) {
                    form.setFieldsValue({
                        cover_img: [
                            {
                                uid: '-1',
                                name: 'image.png',
                                status: 'done',
                                url: restaurant.cover_img,
                            }
                        ]
                    })
                }
                if (restaurant.thumb_img.length > 5) {
                    form.setFieldsValue({
                        thumb_img: [
                            {
                                uid: '-1',
                                name: 'image.png',
                                status: 'done',
                                url: restaurant.thumb_img,
                            }
                        ]
                    })
                }
                reload()
            }
        })
    }, [])
    let categories = useSelector(state => state.categories.data)

    const handleSubmit = async restaurant => {
        SwalLoading()
        let cover_img = '', thumb_img = ''
        if (restaurant.cover_img && restaurant.cover_img.length > 0) {
            if (restaurant.cover_img[0].uid === '-1') {
                cover_img = restaurant.cover_img[0].url
            } else {
                let {originFileObj} = restaurant.cover_img[0]
                cover_img = await uploadImage(originFileObj)
            }
        }
        if (restaurant.thumb_img && restaurant.thumb_img.length > 0) {
            if (restaurant.thumb_img[0].uid === '-1') {
                thumb_img = restaurant.thumb_img[0].url
            } else {
                let {originFileObj} = restaurant.thumb_img[0]
                thumb_img = await uploadImage(originFileObj)
            }
        }
        restaurant.thumb_img = thumb_img
        restaurant.cover_img = cover_img
        restaurant.opening_hour=openingTime;
        restaurant.closing_hour=closingTime; 
        restaurant.description = restaurant.description || ""
        restaurant.password = restaurant.password || ""
        restaurant.tags = restaurant.tags || []
        restaurant.food_categories = []
        restaurant.address = {
            address: restaurant.address.address,
            location: {lat: restaurant.address.location.lat, lng: restaurant.address.location.lng}
        }
        let {error, msg} = await updateRestaurant(restaurant)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Restaurant Updated', 'success')
        }
    }

    return (
        <OwnerLayout>
            <div className="section-header">
                <h3>Restaurant Details</h3>
            </div>
            <Form layout="vertical" requiredMark={false} form={form} onFinish={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <Card header="Restaurant Information">
                            <Form.Item name="_id" className="d-none"><Input/></Form.Item>
                            <Form.Item
                                label="Restaurant Name"
                                name="name"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please insert restaurant name'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>

                            <Form.Item label="Description" name="description">
                                <Input.TextArea size="large" rows={3}/>
                            </Form.Item>
                            <Form.Item
                                label="Plan"
                                name="plan"
                                className="form-group"
                            >
                                <Input size="large" disabled/>
                            </Form.Item>
                            <Form.Item
                                label="Food Categories"
                                name="food_categories"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please select categories'}
                                ]}
                            >
                                <Select size="large" mode="multiple" virtual={false} disabled>
                                    {categories.map(category => (
                                        <Select.Option key={category._id}
                                                       value={category._id}>{category.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Tags" name="tags" className="form-group">
                                <Select mode="tags" size="large" tokenSeparators={[',']}
                                        dropdownStyle={{display: 'none'}} style={{width: '100%'}}> </Select>
                            </Form.Item>
                        </Card>
                    </div>

                    <div className="col-md-4">
                        <Card header="Additional Information">

                            <Form.Item
                                label="Average Cost for Single Meal"
                                name="price_type"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please select a price type'}
                                ]}
                            >
                                <Select size="large">
                                    <Select.Option value="$">$ - Less than 150</Select.Option>
                                    <Select.Option value="$$">$$ - Between 150 to 500</Select.Option>
                                    <Select.Option value="$$$">$$$ - Greater than 500</Select.Option>
                                </Select>
                            </Form.Item>

                            <InputPlacesMap label="Restaurant Location" form={form}/>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Cover Image</label>
                                        <InputFile form={form} name='cover_img' aspect={4 / 1}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Thumb Image</label>
                                        <InputFile form={form} name='thumb_img' aspect={4 / 3}/>
                                    </div>
                                </div>
                            </div>

                        </Card>
                    </div>

                    <div className="col-md-4">
                      <Card header="Opening and Closing Hour">
                        <Form.Item
                            label="Opening Hour"
                            name="opening_hour"
                            className="form-group"
                            rules={[
                            {
                                required: true,
                                message: "Please insert Restaurant opening time",
                            }
                            ]}
                        >
                            
                            <Input size="large" type="time" value={openingTime} onChange={e=>setOpeningTime(e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            label="Closing Hour"
                            name="closing_hour"
                            className="form-group"
                            rules={[
                            {
                                required: true,
                                message: "Please insert Restaurant closing time",
                            }
                            ]}
                        >
                            <Input size="large" type="time" value={closingTime} onChange={e=>setClosingTime(e.target.value)}/>
                        </Form.Item>
                        </Card>

                        <Card header="Discount %">
                            <Form.Item
                                label="Discount given by Restaurant"
                                name="discount_given_by_restaurant"
                                className="form-group"
                            >
                                <Input size="large" disabled/>
                            </Form.Item>
                            <Form.Item
                                label="Discount given by Admin"
                                name="discount_given_by_admin"
                                className="form-group"
                            >
                                <Input size="large" disabled/>
                            </Form.Item>
                        </Card>

                        <Card header="Login">
                            <Form.Item
                                label="Username"
                                name="user"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please insert restaurant username'},
                                    {min: 3, message: 'Username should be at least 3 characters'},
                                    {pattern: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/, message: 'Not valid username'},
                                ]}
                            >
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
                            <Button type="submit" variant="primary">Update Restaurant</Button>
                        </Card>
                    </div>
                </div>
            </Form>
        </OwnerLayout>
    )
}

export default App
