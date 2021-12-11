import AdminLayout from "../../../components/layouts/admin-layout";
import Card from "../../../components/card";
import Table from "../../../components/table";
import UrqlProvider from "../../../components/urql/urql-provider";
import Cookies from 'js-cookie'
import {verifyToken} from "../../../components/admin/auth";
import {Input, Select} from "semantic-ui-react";
import Categories from "../../../components/admin/shop/categories";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import AddCategory from "../../../components/admin/shop/add-category";
import {AddAgentPlan, AgentPlanEdit, AllAgentPlans} from "../../../components/admin/agents";

const App = props => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [plan, setPlan] = useState({});

    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);


    return (
        <AdminLayout>
            <div className="row" id="category_body">
                <div className="col-lg-12">
                    <Card>
                        <div className="card-header">
                            <h4 className="d-inline">Agent Plans</h4>
                            <div className="card-header-action">
                                <button className="btn btn-primary" onClick={handleShow}>Add New</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <Table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Key</th>
                                    <th>Commission</th>
                                    <th>Sub Agent Commission</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <UrqlProvider>
                                    <AllAgentPlans showEdit={handleShowEdit} setPlan={setPlan}/>
                                </UrqlProvider>
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>


            <Modal show={showEdit} onHide={handleCloseEdit} centered>
                <AgentPlanEdit onClose={handleCloseEdit} plan={plan}/>
            </Modal>

            <Modal show={show} onHide={handleClose} centered>
                <AddAgentPlan onClose={handleClose}/>
            </Modal>

        </AdminLayout>
    )
}

export default App


export async function getServerSideProps(context) {
    let admin = await verifyToken(context);

    return {
        props: {

        }
    }
}
