import React, {useState} from "react";
import InputDefault from "../../components/input/input-default";
import InputPhone from "../../components/input/input-phone";
import InputEmail from "../../components/input/input-email";
import InputPassword from "../../components/input/input-password";
import InputReplace from "../../components/input/input-replace";
import Link from "next/link";
import Swal from "sweetalert2";
import {UrqlClient} from "../../components/urql/urql-provider";
import Router from "next/router";
import InputFullAddress from "../../components/input/input-formated-address";

const App = props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [nid, setNid] = useState("");
    const [address, setAddress] = useState("");
    const [areaType, setAreaType] = useState("");

    const [area, setArea] = useState({
        division: '',
        district: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        if(firstName == '' || lastName == '' || phone == '' || phoneError || emailError || nid == '' || address == '' || area.district == '') {
            Swal.fire(
                'Warning',
                'Please provide required field',
                'warning'
            )
        } else {
            let query = `
                mutation($rider: RiderInput!){
                    addRider(riderInput: $rider) {
                        error
                        msg
                    }
                }
            `
            let rider = {
                first_name: firstName,
                last_name: lastName,
                mobile: "+880" + phone,
                password: password,
                email: email,
                national_id: nid,
                owner_address: address,
                residential_or_municipal: areaType,
                ...area

            }

            let client = UrqlClient();
            let result = await client.mutation(query, {rider}).toPromise();

            if(result.error) {
                Swal.fire(
                    'error',
                    'Request Error',
                    'error'
                )
            } else if(result.data.addRider.error) {
                Swal.fire(
                    'error',
                    result.data.addRider.msg,
                    'error'
                )
            } else {
                Swal.fire(
                    'Success',
                    "Successful Registered",
                    "success"
                ).then(result => {
                    Router.reload();
                })
            }
        }
    }


    return (
        <div className="wrapper bg-image">
            <form className="register-form">
                <div className="text-center mb-5">
                    <h1 className="card-title font-italic">Register as Rider</h1>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <InputDefault label="First Name" value={firstName} setValue={setFirstName}/>
                    </div>
                    <div className="col-md-6">
                        <InputDefault label="Last Name" value={lastName} setValue={setLastName}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <InputPhone phone={phone} setPhone={setPhone} error={phoneError} setError={setPhoneError} />
                    </div>
                    <div className="col-md-6">
                        <InputPassword password={password} setPassword={setPassword} minLength={8}/>
                    </div>
                </div>

                <InputEmail email={email} setEmail={setEmail} error={emailError} setError={setEmailError}/>
                <InputReplace label="NID No." value={nid} setValue={setNid} replace={/\D/g}/>
                <InputDefault label="Street Address" value={address} setValue={setAddress}/>
                <InputFullAddress value={area} setValue={setArea} setType={setAreaType}/>
                <div className="row">
                    <div className="col-6">
                        <button type="button" className="btn btn-primary btn-submit" onClick={handleRegister}>Register</button>
                    </div>
                    <div className="col-6 text-right pt-3">
                        <Link href="/rider/login">
                            <a className="text-primary c-pointer" style={{textDecoration: 'none'}}>Already have an Account?</a>
                        </Link>
                    </div>
                </div>


            </form>
        </div>
    )
}

export default App
