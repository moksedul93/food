import React, { useRef, useState,useEffect } from "react";
import AuthForm from "../components/form/auth-form";
import Swal from "sweetalert2";
import { Form, Input } from "antd";
import OtpInput from 'react-otp-input';
import { useRouter } from "next/router";
import {verifyOtp} from "../components/admin/user/user";
import Link from 'next/link';
import { ownerLogin } from "../app/features/owner";



const Oto = () => {
    let form = useRef();
    let router = useRouter();
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(120);


    useEffect(() => {
        const timerId = setInterval(() => {
            setTimer((timer) => timer - 1);
        }, 1000);
        if (timer <= 0) clearInterval(timerId)
        return () => clearInterval(timerId);
    });

    const handleSubmit = async () => {
        const { user } = router.query;
        const { error, msg } = await verifyOtp("+88" + user, +otp);
        if (error) {
            await Swal.fire('Error', msg, 'error');
        }
        else {
            router.push({ pathname: '/setPassword', query: { user } });
        };
        // owner.phone = "+880" + owner.phone
        // let {error, msg} = await ownerLogin(owner)
        // if(error) {
        //     await Swal.fire('Error', msg, 'error');
        // } else {
        //     await router.push('/owner')
        // }
    }
    return (
        <AuthForm title="Enter your verification code here">
            <Form
                layout="vertical"
                requiredMark={false}
                ref={form}
                onFinish={handleSubmit}
            >
                <div className="time_left" style={{ textAlign: "center", paddingTop: "10px" }}>
                    <h6 style={{ fontSize: "16px", fontWeight: "500" }}>Time Left</h6>
                    <ul style={{ padding: "0" }}>
                        <li style={{ fontSize: "16px", fontWeight: "600", listStyle: "none" }}>
                        <span>{Math.floor(timer / 60)+':'+Math.floor(timer % 60)}</span>
                            {/* <span>01</span> : <span>53</span> */}
                        </li>
                    </ul>
                </div>
                <div className="otp_input">
                    <OtpInput
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        numInputs={4}
                        separator={<span>-</span>}
                    />
                </div>

                <div className="row">
                    <div className="col-12 text-center" style={{ marginTop: "30px" }}>
                        <button type="submit" disabled={!timer} className="btn btn-primary btn-submit w-100 mt-2">Confirm</button>
                    </div>
                </div>
            </Form>
        </AuthForm>
    )
}

export default Oto