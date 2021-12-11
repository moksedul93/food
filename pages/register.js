import {SwalLoading} from "../components/common/swal-loading"
import {ownerRegister} from "../app/features/owner"
import  {useRouter} from "next/router"
import {Form, Input} from "antd"
import Swal from "sweetalert2"
import Link from "next/link"
import React from "react"

const App = () => {
    let router = useRouter()
    const handleSubmit = async user => {
        SwalLoading()
        user.mobile = '+880' + user.mobile
        user.email = user.email ? user.email : ''
        let {error, msg} = await ownerRegister(user)
        if(error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', <p className="text-center">Your account is created... <br/>Wait for admin confirmation</p>, 'success')
            await router.push('/login')
        }
    }

    return (
        <div className="wrapper bg-image">
            <div className="register-form">
                <div className="text-center mb-3">
                    <h1 className="card-title font-italic">Register</h1>
                </div>
                <Form
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handleSubmit}
                >
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="First Name"
                                name="first_name"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please provide your first name'}
                                ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Last Name"
                                name="last_name"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please provide your last name'}
                                ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item
                        label="Phone Number"
                        name="mobile"
                        className="form-group"
                        rules={
                            [
                                { required: true, message: 'Please input your phone number!' },
                                { pattern: /\d\d\d\d\d\d\d\d\d\d/, message: 'Please input a valid phone number!' }
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
                            { pattern:  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, message: 'Please input a valid Email!' }
                        ]}>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        className="form-group"
                        rules={
                            [
                                { required: true, message: 'Please input your password!' },
                                { min: 8, message: 'Password must have 8 characters!' }
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
                                { required: true, message: 'Please input your NID Number!' },
                                { pattern: /^(0|[1-9][0-9]*)$/, message: 'Please input valid NID Number!' }
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

                    <div className="row">
                        <div className="col-6">
                            <button className="btn btn-primary btn-submit">Register</button>
                        </div>
                        <div className="col-6 text-right pt-3">
                            <Link href="/login">
                                <a className="text-primary c-pointer" style={{textDecoration: 'none'}}>Already have an Account?</a>
                            </Link>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default App