import React, { useRef } from "react";
import AuthForm from "../components/form/auth-form";
import Swal from "sweetalert2";
import { Form, Input } from "antd";
import { useRouter } from "next/router";
import Link from 'next/link'
import { ownerLogin } from "../app/features/owner";
import { forgotPassword } from "../components/admin/user/user";
import jwt_decode from "jwt-decode";



const SetPassword = () => {
    let form = useRef()
    let router = useRouter()

    async function handleSubmit({ password, cPassword }) {
        if (password !== cPassword) {
            await Swal.fire('Error', 'Password and confirm password field does not match.', 'error');
        } else {
            const { user } = router.query;
            const { error, msg, token } = await forgotPassword('+88' + user, password);
            if (error) await Swal.fire('Error', msg, 'error');
            else {
                const decoded = jwt_decode(token);
                router.push(`${decoded?.type}/login`);
            };
        };

        // owner.phone = "+880" + owner.phone
        // let {error, msg} = await ownerLogin(owner)
        // if(error) {
        //     await Swal.fire('Error', msg, 'error');
        // } else {
        //     await router.push('/owner')
        // }
    };

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
                    name="password"
                    className="form-group"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your new password',
                        },
                        {
                            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                            message: 'Password should contain at least one digit, lower case, upper case, 8 characters long'
                        }
                    ]}
                >
                    <Input.Password size="large" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="cPassword"
                    className="form-group"
                    rules={[{ required: true, message: 'Please enter confirm your password!' }]}
                >
                    <Input.Password size="large" />
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