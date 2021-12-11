import React, {useState} from "react";
import AdminLayout from "../../../components/layouts/admin-layout";
import Card from "../../../components/card";
import InputDefault from "../../../components/input/input-default";
import InputPhone from "../../../components/input/input-phone";
import InputEmail from "../../../components/input/input-email";
import InputPassword from "../../../components/input/input-password";
import {getQuery, getToken, verifyToken} from "../../../components/admin/auth";
import InputReplace from "../../../components/input/input-replace";
import InputSelect from "../../../components/input/input-select";
import Swal from "sweetalert2";
import {SwalLoading} from "../../../components/common/swal-loading";
import InputTextArea from "../../../components/input/input-text-area";
import {getARider, UpdateRider} from "../../../components/admin/rider";

const App = props => {

    let rejection_msg = ""
    if( props.rider.status == 'suspended' || props.rider.status == 'cancelled' ) {
        rejection_msg = props.rider.rejection_msg;
    }


    const [firstName, setFirstName] = useState(props.rider.first_name);
    const [lastName, setLastName] = useState(props.rider.last_name);
    const [phone, setPhone] = useState(props.rider.mobile.replace("+880", ""));
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(props.rider.email);
    const [emailError, setEmailError] = useState(false);
    const [nid, setNid] = useState(props.rider.national_id);
    const [address, setAddress] = useState(props.rider.owner_address);
    const [status, setStatus] = useState(props.rider.status);
    const [note, setNote ] = useState(rejection_msg);

    const statusList = [
        { text: 'Pending', value: 'pending', key: 'pending'},
        { text: 'Approved', value: 'approved', key: 'approved'},
        { text: 'Suspended', value: 'suspended', key: 'suspended'},
        { text: 'Cancelled', value: 'cancelled', key: 'cancelled'},
    ]

    const handleUpdate = async e => {
        e.preventDefault();
        if(firstName == "" || lastName == "" || (password.length < 8 && password.length !=0) || address == "" || nid == "") {
            Swal.fire(
                'Warning',
                'Please Provide Required Fields'
            )
        } else {
            SwalLoading();
            let result = await UpdateRider({
                _id: props.rider._id,
                first_name: firstName,
                last_name: lastName,
                mobile: props.rider.mobile,
                email: email,
                password: password,
                national_id: nid,
                owner_address: address,
                status: status,
                rejection_msg: note
            });
            if(result.error) {
                Swal.fire(
                    'Error',
                    result.msg,
                    'error'
                )
            } else {
                Swal.fire(
                    'Success',
                    'Updated Successfully',
                    'success'
                )
            }
        }
    }


    return (
        <AdminLayout>
            <div className="row">
                <div className="col-md-6">
                    <Card header="Rider Information">
                        <InputDefault label="First Name" value={firstName} setValue={setFirstName}/>
                        <InputDefault label="Last Name" value={lastName} setValue={setLastName}/>
                        <InputPhone phone={phone} setPhone={setPhone} error={false} setError={e => {}} readOnly/>
                        <InputEmail email={email} setEmail={setEmail} error={emailError} setError={setEmailError}/>
                        <InputPassword password={password} setPassword={setPassword} minLength={8}/>
                        <InputReplace label="NID No." value={nid} setValue={setNid} replace={/\D/g}/>
                        <InputDefault label="Address" value={address} setValue={setAddress}/>
                        <InputSelect label="Status" value={status} setValue={setStatus} options={statusList}/>
                        { (status == 'suspended' || status == 'cancelled') && (
                            <InputTextArea label="Note" value={note} setValue={setNote}/>
                        )}
                        <button className="btn btn-primary col-12" type="button" onClick={handleUpdate}>Update</button>
                    </Card>
                </div>
            </div>

        </AdminLayout>
    )
}

export async function getServerSideProps(context) {
    let admin = await verifyToken(context);
    let query = getQuery(context);
    if(query.id == undefined) {
        context.res.writeHeader(307, { Location: "/admin/rider/all" })
        context.res.end();
    }
    let token = getToken(context)
    let rider = await getARider(token, query.id);

    return {
        props: {
            rider: rider.data
        }
    }
}

export default App
