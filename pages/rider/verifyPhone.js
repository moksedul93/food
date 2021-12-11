import React, {useRef} from "react";
import AuthForm from "../../components/form/auth-form";
import Swal from "sweetalert2";
import {Form, Input} from "antd";
import {useRouter} from "next/router";
import Link from 'next/link'
// import {ownerLogin} from "../app/features/owner";

const VerifyPhone = () => {
    let form = useRef()
    let router = useRouter()

    const handleSubmit = async owner => {
        // owner.phone = "+880" + owner.phone
        // let {error, msg} = await ownerLogin(owner)
        // if(error) {
        //     await Swal.fire('Error', msg, 'error');
        // } else {
        //     await router.push('/owner')
        // }
    }
    return (
        <AuthForm title="Verify Phone">
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
                            { required: true, message:'Please input your phone number!' },
                            { pattern: /\d\d\d\d\d\d\d\d\d\d/, message: 'Please input a valid phone number!' }
                        ]
                    }
                >
                    <Input addonBefore="+880" maxLength={10} size="large"/>
                </Form.Item>
                <div className="row">
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary btn-submit w-100 mt-2">Get OTP</button>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <Link href="/rider/login">
                        <a className="text-primary c-pointer">Back to Login</a>
                    </Link>
                </div>
            </Form>
        </AuthForm>
    )
}

export default VerifyPhone