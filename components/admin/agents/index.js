import {useQuery} from "urql";
import Link from "next/link";
import React, {useState} from "react";
import {UrqlClient} from "../../urql/urql-provider";
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";
import {SwalLoading} from "../../common/swal-loading";
import Swal from "sweetalert2";
import InputDefault from "../../input/input-default";
import InputReplace from "../../input/input-replace";
import InputFloatNumber from "../../input/input-float-number";

const Agents = props => {

    const [res, reExecuteQuery] = useQuery(
        {query: `
                query($status: String!) {
                    getAllAgents(status: $status) {
                        error
                        msg
                        data {
                            _id
                            first_name
                            last_name
                            mobile
                            email
                            owner_address
                            status
                        }
                    }
                }  
        `,
            variables: { status: props.status || ''}
        });



    if (res.fetching) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-spinner fa-spin text-primary" style={{fontSize: 70}}></i>
            <p className="text-primary" style={{margin:10}}>Loading...</p>
        </div>
    );
    if (res.error) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-exclamation-triangle text-danger" style={{fontSize: 70}}></i>
            <p className="text-danger" style={{margin:10}}>Error in Loading Data</p>
        </div>
    );



    return (
        <>
            {res.data.getAllAgents.data.map((agent, index) => (
                <tr>
                    <td>{index + 1}</td>
                    <td>{agent.first_name}</td>
                    <td>{agent.last_name}</td>
                    <td>{agent.mobile}</td>
                    <td>{agent.email}</td>
                    <td>{agent.owner_address}</td>
                    <td>
                        {agent.status == 'pending' && (
                            <div className="badge badge-pill badge-danger mt-3">Pending</div>
                        )}
                        {agent.status == 'approved' && (
                            <div className="badge badge-pill badge-primary mt-3">Approved</div>
                        )}
                        {agent.status == 'suspended' && (
                            <div className="badge badge-pill badge-secondary mt-3">Suspended</div>
                        )}
                        {agent.status == 'cancelled' && (
                            <div className="badge badge-pill badge-dark mt-3">Cancelled</div>
                        )}
                    </td>
                    <td>
                        <Link href={"/admin/agent?id=" + agent._id }>
                            <a className="text-primary table-action c-pointer"><i className="fa fa-eye"></i> </a>
                        </Link>
                    </td>
                </tr>
            ))}
        </>
    )

}

export default Agents


export const getAllAgents = async (token,status) => {
    const query = `
        query($status: String) {
            getAllAgents(status: $status) {
                error
                msg
                data {
                    _id
                    first_name
                    last_name
                    mobile
                    national_id
                    status
                }
            }
        } 
    `;
    let client = UrqlClient(token);
    let request = client.query(query, {status}).toPromise();
    let result = await request

    if(result.error) {
        return {
            error: true
        }
    } else if(result.data.getAllAgents.error) {
        return {
            error: true
        }
    } else {
        return {
            error: false,
            data: result.data.getAllAgents.data
        }
    }
}


export const getAAgent = async (token, id) => {
    let query = `
        query($id: ID!) {
            getOneagent(_id: $id) {
                msg
                error
                data {
                    _id
                    first_name
                    last_name
                    mobile
                    email
                    national_id
                    trade_license_no
                    owner_address
                    status
                    rejection_msg
                }
            }
        }
    `
    let client = UrqlClient(token);
    let request = client.query(query, {id}).toPromise();
    let result = await request
    if(result.error || result.data.getOneagent.error) {
        return {
            error: true
        }
    } else {
        return {
            error: false,
            data: result.data.getOneagent.data
        }
    }
}

export const UpdateAgent = async agent => {
    const updateQuery = `
        mutation($agent: AgentInput!) {
            updateAgentWithStatus(agentInput: $agent) {
                msg
                error
            }
        }
    `
    let client = UrqlClient(Cookies.get('fja_token'));
    let request = client.mutation(updateQuery , {agent}).toPromise();
    let result = await request


    if(result.error) {
        return {
            error: true,
            msg: "Request Failed"
        }
    } else {
        return {
            error: result.data.updateAgentWithStatus.error,
            msg: result.data.updateAgentWithStatus.msg
        }
    }
}



export const AddAgentPlan = props => {


    const [ name, setName ] = useState('');
    const [ key, setKey ] = useState('');
    const [ ownCommission, setOwnCommission ] = useState('');
    const [ childCommission, setChildCommission ] = useState('');

    const submit = e => {
        SwalLoading();
        let result = addAAgentPlan(name, key, +ownCommission, +childCommission);

        if(result.error) {
            Swal.fire(
                'Error',
                result.msg,
                'error'
            )
        } else {
            setName('');
            setKey('');
            setOwnCommission('');
            setChildCommission('');
            props.onClose();
            Swal.fire(
                'Success',
                'Successfully Added Plan',
                'success'
            )
        }

    }



    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Add a new Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputDefault label="Name" value={name} setValue={setName}/>
                <InputReplace label="Key" value={key} setValue={setKey} replace={/ /g}/>
                <InputFloatNumber label="Commission" value={ownCommission} setValue={setOwnCommission}/>
                <InputFloatNumber label="Sub Agent Commission" value={childCommission} setValue={setChildCommission}/>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-dark" onClick={props.onClose}>Close</button>
                <button className="btn btn-primary" onClick={submit}>Add Plan</button>
            </Modal.Footer>
        </>
    )
}




export const addAAgentPlan = async ( name, key, own_c, child_c) => {
    const updateQuery = `
        mutation($name: String!, $key: String!, $own_c: Float!, $child_c: Float!) {
            addAgentAreaPlan(name: $name, key: $key, own_commission: $own_c, child_commission: $child_c ) {
                error
                msg
            }
        }
    `
    let client = UrqlClient(Cookies.get('fja_token'));
    let result = await client.mutation(updateQuery , { name, key, own_c, child_c }).toPromise();

    if(result.error) {
        return {
            error: true,
            msg: "Request Failed"
        }
    } else {
        return {
            error: result.data.addAgentAreaPlan.error,
            msg: result.data.addAgentAreaPlan.msg
        }
    }
}

export const AllAgentPlans = props => {


    const deleteAgentAreaPlanQuery = `
        mutation($id: ID!){
            deleteAgentAreaPlan(_id: $id) {
                error
                msg
            }
        }
    `;

    const [res, reExecuteQuery] = useQuery(
        {query: `
                query {
                    getAllAgentAreaPlan {
                        error   
                        msg
                        data {
                            _id
                            name
                            key
                            own_commission
                            child_commission
                        }
                    }
                }  
            `,});

    const handleDelete = id => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                SwalLoading();
                let client = UrqlClient(Cookies.get('fja_token'));
                client.mutation(deleteAgentAreaPlanQuery , {
                    id: id
                }).toPromise().then(result => {
                    if( result.error ) {
                        Swal.fire(
                            "Error",
                            "Request Failed",
                            "error"
                        )
                    } else if(result.data.deleteAgentAreaPlan.error){
                        Swal.fire(
                            "Error",
                            result.data.deleteAgentAreaPlan.msg,
                            "error"
                        )
                    } else {
                        Swal.fire(
                            "Deleted !",
                            "Agent Area Plan Successfully",
                            "success"
                        );
                        refresh();
                    }
                })
            }
        })

    }

    const refresh = () => {
        reExecuteQuery({ requestPolicy: 'cache-and-network' });
    };

    if (res.fetching) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-spinner fa-spin text-primary" style={{fontSize: 70}}></i>
            <p className="text-primary" style={{margin:10}}>Loading...</p>
        </div>
    );
    if (res.error) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-exclamation-triangle text-danger" style={{fontSize: 70}}></i>
            <p className="text-danger" style={{margin:10}}>Error in Loading Data</p>
        </div>
    );

    const handleEdit = plan => {
        props.setPlan(plan)
        props.showEdit();
    }

    return (
        <>
            {res.data.getAllAgentAreaPlan.data.map((plan, index) => (
                <tr>
                    <td>{index + 1}</td>
                    <td>{plan.name}</td>
                    <td>{plan.key}</td>
                    <td>{plan.own_commission}</td>
                    <td>{plan.child_commission}</td>
                    <td>
                        <a className="text-danger table-action c-pointer mr-3" onClick={e => {handleEdit(plan)}}><i className="fa fa-edit"></i> </a>
                        <a className="text-danger table-action c-pointer" onClick={e => {handleDelete(plan._id)}}><i className="fa fa-trash-alt"></i> </a>
                    </td>
                </tr>
            ))}



        </>
    )

}

export const AgentPlanEdit = props => {

    const [ name, setName ] = useState(props.plan.name);
    const [ key, setKey ] = useState(props.plan.key);
    const [ ownCommission, setOwnCommission ] = useState(props.plan.own_commission);
    const [ childCommission, setChildCommission ] = useState(props.plan.child_commission);

    const submit = e => {
        SwalLoading();
        let result = editAAgentPlan( props.plan._id, name, key, +ownCommission, +childCommission);

        if(result.error) {
            Swal.fire(
                'Error',
                result.msg,
                'error'
            )
        } else {
            props.onClose();
            Swal.fire(
                'Success',
                'Successfully Updated Plan',
                'success'
            )
        }

    }


    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Edit Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputDefault label="Name" value={name} setValue={setName}/>
                <InputReplace label="Key" value={key} setValue={setKey} replace={/ /g}/>
                <InputFloatNumber label="Commission" value={ownCommission} setValue={setOwnCommission}/>
                <InputFloatNumber label="Sub Agent Commission" value={childCommission} setValue={setChildCommission}/>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-dark" onClick={props.onClose}>Close</button>
                <button className="btn btn-primary" onClick={submit}>Edit Plan</button>
            </Modal.Footer>
        </>
    )
}


export const editAAgentPlan = async ( id, name, key, own_c, child_c) => {
    const updateQuery = `
        mutation($id: ID!,$name: String!, $key: String!, $own_c: Float!, $child_c: Float!) {
            updateAgentAreaPlan(_id: $id, name: $name, key: $key, own_commission: $own_c, child_commission: $child_c ) {
                error
                msg
            }
        }
    `
    let client = UrqlClient(Cookies.get('fja_token'));
    let result = await client.mutation(updateQuery , { id, name, key, own_c, child_c }).toPromise();

    if(result.error) {
        return {
            error: true,
            msg: "Request Failed"
        }
    } else {
        return {
            error: result.data.updateAgentAreaPlan.error,
            msg: result.data.updateAgentAreaPlan.msg
        }
    }
}

export const getAllAgentPlans = async props => {
    let query = `
         query {
            getAllAgentAreaPlan {
                error   
                msg
                data {
                    _id
                    name
                    key
                }
            }
         }  
    `
    let client = UrqlClient();
    let result = await client.query(query).toPromise();
    if( result.error || result.data.getAllAgentAreaPlan.error ) {
        return []
    }
    return result.data.getAllAgentAreaPlan.data;
}
