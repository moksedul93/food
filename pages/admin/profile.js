import React, {useEffect, useState} from "react";
import AdminLayout from "../../components/layouts/admin-layout";
import {useDispatch, useSelector} from "react-redux";
import { fetchAdmin } from "../../app/slices/admin";


const App = () => {
    let dispatch = useDispatch()
    useEffect(() => {
      dispatch(fetchAdmin())
    }, [])

    const admin = useSelector(state => state.admin)


    return (
        <AdminLayout>
            <div className="section-header">
                <h1>Profile</h1>
            </div>
            <div className="profile-header">
            {/* <div className="row px-5 py-3">
                <p>Name : {admin.first_name} {admin.last_name}</p> 
            </div> */}
            <div className="row px-5 py-3">
                <p>Mobile : {admin.mobile}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>Type : {admin.type}</p> 
            </div>
            {/* <div className="row px-5 py-3">
                <p>Email : {admin.email}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>National ID : {admin.national_id}</p>
            </div>
            <div className="row px-5 py-3">
                <p>Address : {admin.owner_address}</p> 
            </div>    */}
            </div>
        </AdminLayout>
    )
}


export default App
