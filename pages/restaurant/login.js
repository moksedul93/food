import React from "react";
import Link from "next/link";
import AuthForm from "../../components/form/auth-form";
import Swal from "sweetalert2";
import { SwalLoading } from "../../components/common/swal-loading";
import { useRouter } from "next/router";
import { Form, Input } from "antd";
import { restaurantLogin } from "../../app/features/restaurant";

const Login = () => {
    let router = useRouter()
    const handleSubmit = async restaurant => {
        SwalLoading()
        let { error, msg } = await restaurantLogin(restaurant)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            Swal.close()
            await router.push('/restaurant')
        }
    }

    return (
        <AuthForm title="Restaurant Login">
            <Form
                layout="vertical"
                requiredMark={false}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Username"
                    name="user"
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input size="large" />
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
                        <Link href="/restaurant/register">
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

export default Login