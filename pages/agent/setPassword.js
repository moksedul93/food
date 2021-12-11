import React, {useRef} from "react";
import AuthForm from "../../components/form/auth-form";
import Swal from "sweetalert2";
import {Form, Input} from "antd";
import {useRouter} from "next/router";
import Link from 'next/link'
// import {ownerLogin} from "../app/features/owner";

const SetPassword = () => {
    let form = useRef()
    let router = useRouter()

    const handleSubmit = async owner => {
        owner.phone = "+880" + owner.phone
        let {error, msg} = await ownerLogin(owner)
        if(error) {
            await Swal.fire('Error', msg, 'error');
        } else {
            await router.push('/owner')
        }
    }
    return (
        <AuthForm title="SetPassword">
            <Form
                layout="vertical"
                requiredMark={false}
                ref={form}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="New Password"
                    name="New password"
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size="large"/>
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="Confirm password"
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size="large"/>
                </Form.Item>

                <div className="row">                    
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary btn-submit w-100 mt-2">Confirm</button>
                    </div>
                    
                </div>
            </Form>
        </AuthForm>
    )
}

export default SetPassword