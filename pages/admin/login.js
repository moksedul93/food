import AuthForm from "../../components/form/auth-form"
import {adminLogin} from "../../app/features/admin";
import {useRouter} from "next/router"
import React, {useRef} from "react"
import {Form, Input} from "antd"
import Cookies from 'js-cookie'
import Swal from "sweetalert2"
import Link from "next/dist/client/link";



const App = () => {
    let form = useRef()
    let router = useRouter()

    const handleSubmit = async value => {
        value.phone = "+880" + value.phone
        let {error, token, msg} = await adminLogin(value)
        if(error) {
            await Swal.fire('Error', msg, 'error');
        } else {
            Cookies.set('fja_token', token)
            await router.push('/admin')
        }
    };

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
                    <Input addonBefore="+880" maxLength={10} size="large"/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size="large"/>
                </Form.Item>
                <div className="row">
                   
                    <div className="col-6 pt-3">
                        <Link href="/admin/register">
                            <a className="text-primary c-pointer" style={{textDecoration: 'none'}}>Create Account?</a>
                        </Link>
                    </div>
                    <div className="col-6 text-right pt-3">
                        <Link href="/verifyPhone">
                            <a className="text-primary c-pointer" style={{textDecoration: 'none'}}>Forget Password</a>
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

export default App