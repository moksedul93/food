import React, { useRef } from "react";
import AuthForm from "../../components/form/auth-form";
import Swal from "sweetalert2";
import { Form, Input } from "antd";
import { useRouter } from "next/router";
import Link from 'next/link'
// import {ownerLogin} from "../app/features/owner";

const RiderLogin = () => {
    let form = useRef()
    let router = useRouter()

    const handleSubmit = async owner => {
        owner.phone = "+880" + owner.phone
        let { error, msg } = await ownerLogin(owner)
        if (error) {
            await Swal.fire('Error', msg, 'error');
        } else {
            await router.push('/rider')
        }
    }
    return (
        <AuthForm title="Login">
            <Form
                layout="vertical"
                requiredMark={false}
                ref={form}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Phone Number"
                    name="phone"
                    className="form-group"
                    rules={
                        [
                            { required: true, message: 'Please input your phone number!' },
                            { pattern: /\d\d\d\d\d\d\d\d\d\d/, message: 'Please input a valid phone number!' }
                        ]
                    }
                >
                    <Input addonBefore="+880" maxLength={10} size="large" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size="large" />
                </Form.Item>

                <div className="row">

                    <div className="col-6 pt-3">
                        <Link href="/agency/register">
                            <a className="text-primary c-pointer" style={{ textDecoration: 'none' }}>Create Account?</a>
                        </Link>
                    </div>
                    <div className="col-6 text-right pt-3">
                        <Link href="/verifyPhone">
                            <a className="text-primary c-pointer" style={{ textDecoration: 'none' }}>Forget Password</a>
                        </Link>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary btn-submit w-100 mt-2">Login</button>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <Link href="https://foodjocky.com/login">
                        <a className="text-primary c-pointer">Login as Customer?</a>
                    </Link>
                </div>
            </Form>
        </AuthForm>
    )
}

export default RiderLogin