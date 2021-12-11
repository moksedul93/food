import React,{useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAgent} from "../../app/slices/agent";
import AgentLayout from "../../components/layouts/agent-layout";



const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchAgent())
    }, [])

    const agent = useSelector(state => state.agent)
    return (
        <AgentLayout agent={agent}>
            <div className="section-header">
                <h1>Profile</h1>
            </div>
            <div className="profile-header">
            <div className="row px-5 py-3">
                <p>Name : {agent.first_name} {agent.last_name}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>Mobile : {agent.mobile}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>Email : {agent.email}</p> 
            </div>
            <div className="row px-5 py-3">
                <p>National ID : {agent.national_id}</p>
            </div>
            <div className="row px-5 py-3">
                <p>Address : {agent.owner_address}</p> 
            </div>  
            {agent.agent_level && <div className="row px-5 py-3">
                <p>Agent Level : {agent.agent_level}</p> 
            </div>}
            {agent.division && <div className="row px-5 py-3">
                <p>Agent Divition : {agent.division}</p> 
            </div>}
            {agent.district && <div className="row px-5 py-3">
                <p>Agent District : {agent.district}</p> 
            </div>}
            {agent.municipal && <div className="row px-5 py-3">
                <p>Agent Municipal : {agent.municipal}</p> 
            </div>}
            {agent.upazila && <div className="row px-5 py-3">
                <p>Agent Upazila : {agent.upazila}</p> 
            </div>}
            {agent.union && <div className="row px-5 py-3">
                <p>Agent Union : {agent.union}</p> 
            </div>}
            {agent.village && <div className="row px-5 py-3">
                <p>Agent Village : {agent.village}</p> 
            </div>}
            {agent.ward && <div className="row px-5 py-3">
                <p>Agent Ward : {agent.ward}</p> 
            </div>}
            </div>            
        </AgentLayout>
    )
}

export default App
