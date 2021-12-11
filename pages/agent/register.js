import React, {useState} from "react";
import InputDefault from "../../components/input/input-default";
import InputPhone from "../../components/input/input-phone";
import InputEmail from "../../components/input/input-email";
import InputPassword from "../../components/input/input-password";
import InputReplace from "../../components/input/input-replace";
import Link from "next/link";
import InputArea from "../../components/input/input-area";
import Swal from "sweetalert2";
import {UrqlClient} from "../../components/urql/urql-provider";
import Router from "next/router";
import InputSelect from "../../components/input/input-select";
import {getAllAgentPlans} from "../../components/admin/agents";

const App = props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [nid, setNid] = useState("");
    const [tradeLicense, setTradeLicense] = useState("");
    const [address, setAddress] = useState("");
    const [areaType, setAreaType] = useState("");
    const [workArea, setWorkArea] = useState("");

    const [area, setArea] = useState({
        division: '',
        district: '',
    });

    const handleWorkAreaChange = value => {
        setWorkArea(value);
        if(value == 'municipal' || value == 'ward') {
            setAreaType('municipal');
        } else  if(value == 'upazila' || value == 'union' || value == 'village') {
            setAreaType('residential');
        }
    }


    const workAreaList = props.agentsPlans.map(plan => {
        return {
            text: plan.name,
            value: plan.key,
            key: plan.key
        }
    })

    const handleRegister = async (e) => {
        e.preventDefault();
        if(firstName == '' || lastName == '' || phone == '' || phoneError || emailError || nid == '' || address == '' || area.division == '') {
            Swal.fire(
                'Warning',
                'Please provide required field',
                'warning'
            )
        } else {
            let query = `
                mutation($agent: AgentInput!){
                    addAgent(agentInput: $agent) {
                        error
                        msg
                    }
                }
            `
            let agent = {
                first_name: firstName,
                last_name: lastName,
                mobile: "+880" + phone,
                password: password,
                email: email,
                national_id: nid,
                owner_address: address,
                trade_license_no: tradeLicense,
                residential_or_municipal: areaType,
                agent_level: workArea,
                ...area

            }

            let client = UrqlClient();
            let result = await client.mutation(query, {agent}).toPromise();

            if(result.error) {
                Swal.fire(
                    'error',
                    'Request Error',
                    'error'
                )
            } else if(result.data.addAgent.error) {
                Swal.fire(
                    'error',
                    result.data.addAgent.msg,
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
                    <h1 className="card-title font-italic">Register as Agent</h1>
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

                <div className="row">
                    <div className="col-md-6">
                        <InputReplace label="NID No." value={nid} setValue={setNid} replace={/\D/g}/>
                    </div>
                    <div className="col-md-6">
                        <InputDefault label="Trade Licence (if available)" value={tradeLicense} setValue={setTradeLicense}/>
                    </div>
                </div>
                <InputDefault label="Street Address" value={address} setValue={setAddress}/>
                <InputSelect label="Which phase you want to become an agent?" value={workArea} setValue={handleWorkAreaChange} options={workAreaList}/>

                <InputArea value={area} setValue={setArea} type={areaType} setType={setAreaType} level={workArea} typeDisable/>
                <div className="row">
                    <div className="col-6">
                        <button type="button" className="btn btn-primary btn-submit" onClick={handleRegister}>Request</button>
                    </div>
                    <div className="col-6 text-right pt-3">
                        <Link href="/agent/login">
                            <a className="text-primary c-pointer" style={{textDecoration: 'none'}}>Already have an Account?</a>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default App

export async function getServerSideProps(context) {
    let agentsPlans = await getAllAgentPlans();
    return {
        props: {
            agentsPlans
        }
    }
}
