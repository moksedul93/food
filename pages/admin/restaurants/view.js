import React, {useEffect, useState} from "react";
import AdminLayout from "../../../components/layouts/admin-layout";
import Card from "../../../components/card";
import {useDispatch, useSelector} from "react-redux";
import {Form, Input, Select, Switch} from "antd";
import Map from "../../../components/map";
import Swal from "sweetalert2";
import {SwalLoading} from "../../../components/common/swal-loading";
import {fetchPlans} from "../../../app/slices/plans";
import {getRestaurant, updateRestaurantByAdmin} from "../../../app/features/restaurant";
const {Option} = Select

const App = () => {
    let [form] = Form.useForm()
    let dispatch = useDispatch()
    const [loaded, setLoaded] = useState(false)
    const [reload, setReload] = useState(false)
    const [restaurant, setRestaurant] = useState()
    useEffect(() => {
        if (!loaded) {
            setLoaded(true)
            dispatch(fetchPlans({}))
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
           getRestaurant(id).then(({error, data}) => {
               if(!error) {
                   setRestaurant(data)
                   form.setFieldsValue({
                       _id: data._id,
                       user: data.user,
                       password: '',
                       name: data.name,
                       restaurant_or_homemade: data.restaurant_or_homemade,
                       plan:  data.plan ? data.plan._id : null,
                       discount_given_by_restaurant: data.discount_given_by_restaurant,
                       discount_given_by_admin: data.discount_given_by_admin,
                       status: data.status,
                       vat: data.vat || false,
                       rider_cost: data.rider_cost || false,
                   })
                   if(data.status === 'cancelled' || data.status === 'suspended') {
                       form.setFieldsValue({rejection_msg: data.rejection_msg})
                   }
               }

            })
        }
    })
    let plans = useSelector(state => state.plans.data)


    const onFinish = async restaurant => {
        SwalLoading();
        restaurant.discount_given_by_restaurant = +restaurant.discount_given_by_restaurant
        restaurant.discount_given_by_admin = +restaurant.discount_given_by_admin
        restaurant.rejection_msg = restaurant.rejection_msg ? restaurant.rejection_msg : ''
        let {error, msg} = await updateRestaurantByAdmin(restaurant)
        if(error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully updated', 'success')
            setLoaded(false)
        }
    }


    return (
        <AdminLayout>
            <div className="section-header">
                <h1>Restaurant</h1>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <Card header="Restaurant Information">
                        <Form layout="vertical" form={form} requiredMark={false} onFinish={onFinish}>
                            <Form.Item name="_id" style={{display: 'none'}}><input/></Form.Item>
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
                                        { min: 8, message: 'Password must have 8 characters!' }
                                    ]
                                }>
                                <Input.Password size="large"/>
                            </Form.Item>
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
                            <Form.Item
                                label="Restaurant Type"
                                name="restaurant_or_homemade"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please select restaurant type'}
                                ]}
                            >
                                <Select size="large">
                                    <Select.Option value="restaurant">Restaurant</Select.Option>
                                    <Select.Option value="homemade">Homemade</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Plan"
                                name="plan"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please select a plan'}
                                ]}
                            >
                                <Select size="large">
                                    {plans.map(plan => (
                                        <Select.Option key={plan._id} value={plan._id}>{plan.title}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Discount given by Restaurant"
                                name="discount_given_by_restaurant"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please insert Restaurant discount amount'},
                                    {pattern: /^\d*$/, message: 'Please insert valid amount'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="Discount given by Admin"
                                name="discount_given_by_admin"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please insert Admin discount amount'},
                                    {pattern: /^\d*$/, message: 'Please insert valid amount'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Item name="vat" style={{display: 'inline-block'}} initialValue={false} valuePropName="checked">
                                        <Switch/>
                                    </Form.Item>
                                    <label className="ml-2 font-weight-bold" style={{color: '#34395e', marginTop: 6}}>Restaurant VAT</label>
                                </div>
                                <div className="col-6">
                                    <Form.Item name="rider_cost" style={{display: 'inline-block'}} initialValue={false} valuePropName="checked">
                                        <Switch/>
                                    </Form.Item>
                                    <label className="ml-2 font-weight-bold" style={{color: '#34395e', marginTop: 6}}>Rider Cost</label>
                                </div>
                            </div>

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
                            ) }
                            <button className="btn btn-primary col-12" type="submit" >Update</button>
                        </Form>
                    </Card>
                </div>
                <div className="col-md-7">
                    <Card header="Additional Information Information">
                        <div className="row">
                            {restaurant && (
                                <>
                                    <div className="col-6">
                                        <div>
                                            <b className="d-inline-block">Location: </b>
                                            <p className="d-inline-block ml-2">{restaurant.address.address}</p>
                                        </div>
                                        <div>
                                            <b className="d-inline-block">Type: </b>
                                            <p className="d-inline-block ml-2 text-capitalize">{restaurant.restaurant_or_homemade}</p>
                                        </div>
                                        <div>
                                            <b className="d-inline-block">Categories: </b>
                                            <p className="d-inline-block ml-2">
                                                {/*{categoryList.join(', ')}*/}
                                            </p>
                                        </div>

                                        <div>
                                            <b className="d-inline-block">Tags: </b>
                                            <p className="d-inline-block ml-2">
                                                {restaurant.tags.join(', ')}
                                            </p>
                                        </div>

                                    </div>
                                    <div className="col-6" style={{paddingBottom: 5}}>
                                        <Map height={405} width={425} lat={restaurant.address.location.lat} lng={restaurant.address.location.lng}>

                                        </Map>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )

}

export default App

