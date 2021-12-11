import React, {useEffect} from "react";
import OwnerLayout from "../../components/layouts/owner-layout";
import {fetchDashboardData} from "../../app/slices/owner";
import {useDispatch, useSelector} from "react-redux";


const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchDashboardData({}))
    }, [])

    const owner = useSelector(state => state.owner)
    
    return (
        <OwnerLayout>
            <div className="section-header">
                <h1>Profile</h1>
            </div>
            <div className="profile-header">
            <div className="row px-5 py-3">
                <p>Name : {owner.first_name} {owner.last_name}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>Mobile : {owner.mobile}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>Email : {owner.email}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>National ID : {owner.national_id}</p>
            </div>
            <div className="row px-5 py-3">
                <p>Address : {owner.owner_address}</p> 
            </div>   
            </div>                     
        </OwnerLayout>
    )
}

export default App
