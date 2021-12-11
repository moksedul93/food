import React, { useState } from "react";
import { Checkbox } from 'semantic-ui-react'
import Link from "next/link";
import AuthForm from "../../components/form/auth-form";
import InputPhone from "../../components/input/input-phone";
import InputPassword from "../../components/input/input-password";
import Swal from "sweetalert2";
import { SwalLoading } from "../../components/common/swal-loading";
import Router from "next/router";
import Cookies from "js-cookie";
import { agentLogin } from "../../components/agent";

const App = props => {
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (phoneError) {
            Swal.fire(
                'Warning',
                'Please provide valid Phone',
                'warning'
            )
        } else {
            SwalLoading();
            let result = await agentLogin("+880" + phone, password);
            if (result.error) {
                Swal.fire(
                    'error',
                    result.msg,
                    'error'
                )
            } else {
                Swal.close();
                Cookies.set('fja_token', result.token);
                Router.push("/agent");
            }
        }
    }


    return (
        <AuthForm title="Agent Login">
            <InputPhone phone={phone} setPhone={setPhone} error={phoneError} setError={setPhoneError} />
            <InputPassword password={password} setPassword={setPassword} />

            <div className="row">

                <div className="col-6 pt-3">
                    <Link href="/agent/register">
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
        </AuthForm>
    )
}

export default App
