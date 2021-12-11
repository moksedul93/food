import {SwalLoading} from "../../../components/common/swal-loading";
import AdminLayout from "../../../components/layouts/admin-layout";
import Card from "../../../components/card";
import Button from "react-bootstrap/Button";
import React, {useEffect} from "react";
import {Form, Input} from "antd";
import Swal from "sweetalert2";
import {
    getSettings,
    updateMinimumOrderAmount,
    updateCashbackPercentage,
    updateLateTime, updateMapApiKey,
    updateRiderCost, updateSSLInformation,
    updateVat
} from "../../../app/features/settings";

const App = () => {
    let [vat] = Form.useForm()
    let [sms] = Form.useForm()
    let [ssl] = Form.useForm()
    let [time] = Form.useForm()
    let [rider] = Form.useForm()
    let [google] = Form.useForm()
    let [cashback] = Form.useForm()
    let [minimum_order_amount] = Form.useForm()

    useEffect(() => {
        setForms()
    })

    const setForms = () => {
        getSettings().then(({error, data}) => {
            if (!error) {
                vat.setFieldsValue(data)
                sms.setFieldsValue(data)
                ssl.setFieldsValue(data)
                time.setFieldsValue(data)
                rider.setFieldsValue(data)
                google.setFieldsValue(data)
                cashback.setFieldsValue(data)
                minimum_order_amount.setFieldsValue(data)
            }
        })
    }

    const onMinimumOrderSubmit = async value => {
        SwalLoading()
        let {error, msg} = await updateMinimumOrderAmount(+value.minimum_order_amount)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully Updated', 'success')
            setForms()
        }
    }

    const onCashbackSubmit = async value => {
        SwalLoading()
        let {error, msg} = await updateCashbackPercentage(+value.customer_cashback_percentange)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully Updated', 'success')
            setForms()
        }
    }
    const onSslSubmit = async ssl => {
        SwalLoading()
        let {error, msg} = await updateSSLInformation(ssl)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully Updated', 'success')
            setForms()
        }
    }
    const onTimeSubmit = async value => {
        SwalLoading()
        let {error, msg} = await updateLateTime({
            restaurant_time: +value.restaurant_extra_time,
            rider_time: +value.rider_extra_time
        })
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully Updated', 'success')
            setForms()
        }
    }
    const onVatSubmit = async value => {
        SwalLoading()
        let {error, msg} = await updateVat({
            customer_vat: +value.customer_vat,
            restaurant_vat: +value.restaurant_vat
        })
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully Updated', 'success')
            setForms()
        }

    }
    const onRiderSubmit = async value => {
        SwalLoading()
        let {error, msg} = await updateRiderCost(+value.rider_cost)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully Updated', 'success')
            setForms()
        }
    }
    const onGoogleSubmit = async value => {
        SwalLoading()
        let {error, msg} = await updateMapApiKey(value.google_map_api_key)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Successfully Updated', 'success')
            setForms()
        }
    }

    return (
        <AdminLayout>
            <div className="section-header">
                <h3>Settings</h3>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item">admin</div>
                    <div className="breadcrumb-item">settings</div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-4">
                <Card header="Minimum Order Amount">
                        <Form form={minimum_order_amount} layout="vertical" onFinish={onMinimumOrderSubmit} requiredMark={false}>
                            <Form.Item
                                name='minimum_order_amount'
                                rules={[
                                    {required: true, message: 'Please provide minimum order amount'},
                                    {pattern: /^[0-9]\d*$/, message: 'Please provide valid amount'}
                                ]}
                            >
                                <Input size="large" suffix="BDT"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>
                    <Card header="Rider Cost">
                        <Form form={rider} layout="vertical" onFinish={onRiderSubmit} requiredMark={false}>
                            <Form.Item
                                name='rider_cost'
                                rules={[
                                    {required: true, message: 'Please provide a amount'},
                                    {pattern: /^[0-9]\d*$/, message: 'Please provide valid amount'}
                                ]}
                            >
                                <Input size="large" suffix="BDT"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>
                    <Card header="Cashback Percentage">
                        <Form form={cashback} layout="vertical" onFinish={onCashbackSubmit} requiredMark={false}>
                            <Form.Item
                                name='customer_cashback_percentange'
                                rules={[
                                    {required: true, message: 'Please provide cashback'},
                                    {pattern: /^[0-9]\d*$/, message: 'Please provide valid amount'}
                                ]}
                            >
                                <Input size="large" suffix="%"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>
                    
                    <Card header="VAT">
                        <Form form={vat} layout="vertical" onFinish={onVatSubmit} requiredMark={false}>
                            <Form.Item
                                label="Restaurant VAT"
                                name='restaurant_vat'
                                rules={[
                                    {required: true, message: 'Please provide a amount'},
                                    {pattern: /^[0-9]\d*$/, message: 'Please provide valid amount'}
                                ]}
                            >
                                <Input size="large" suffix="%"/>
                            </Form.Item>
                            <Form.Item
                                label="Customer VAT"
                                name='customer_vat'
                                rules={[
                                    {required: true, message: 'Please provide a amount'},
                                    {pattern: /^[0-9]\d*$/, message: 'Please provide valid amount'}
                                ]}
                            >
                                <Input size="large" suffix="%"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card header="Extra Time">
                        <Form form={time} layout="vertical" onFinish={onTimeSubmit} requiredMark={false}>
                            <Form.Item
                                label="Restaurant Extra Time"
                                name='restaurant_extra_time'
                                rules={[
                                    {required: true, message: 'Please provide extra time'},
                                    {pattern: /^[0-9]\d*$/, message: 'Please provide valid amount'}
                                ]}
                            >
                                <Input size="large" suffix="Min"/>
                            </Form.Item>
                            <Form.Item
                                label="Rider Extra Time"
                                name='rider_extra_time'
                                rules={[
                                    {required: true, message: 'Please provide extra time'},
                                    {pattern: /^[0-9]\d*$/, message: 'Please provide valid amount'}
                                ]}
                            >
                                <Input size="large" suffix="Min"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>

                    <Card header="SMS Gateway">
                        <Form form={sms} layout="vertical" onFinish={() => {}} requiredMark={false}>
                            <Form.Item
                                label="API Url"
                                name='sms_api_url'
                                rules={[
                                    {required: true, message: 'Please provide extra time'},
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="Username"
                                name='sms_api_username'
                                rules={[
                                    {required: true, message: 'Please provide store id'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name='sms_api_password'
                                rules={[
                                    {required: true, message: 'Please provide cashback'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>


                </div>
                <div className="col-md-4">
                    <Card header="SSL Commerez">
                        <Form form={ssl} layout="vertical" onFinish={onSslSubmit} requiredMark={false}>
                            <Form.Item
                                label="Store ID"
                                name='ssl_commerez_store_id'
                                rules={[
                                    {required: true, message: 'Please provide store id'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="Store Password"
                                name='ssl_commerez_store_password'
                                rules={[
                                    {required: true, message: 'Please provide cashback'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="Currency"
                                name='ssl_commerez_currency'
                                rules={[
                                    {required: true, message: 'Please provide currency'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="City"
                                name='ssl_commerez_cus_city'
                                rules={[
                                    {required: true, message: 'Please provide current city'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item
                                label="Country"
                                name='ssl_commerez_cus_country'
                                rules={[
                                    {required: true, message: 'Please provide current country'}
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>
                    <Card header="Google API Key">
                        <Form form={google} layout="vertical" onFinish={onGoogleSubmit} requiredMark={false}>
                            <Form.Item
                                name='google_map_api_key'
                                rules={[
                                    {required: true, message: 'Please provide a amount'},
                                ]}
                            >
                                <Input size="large"/>
                            </Form.Item>
                            <Button variant="primary" type="submit">Update</Button>
                        </Form>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}
export default App