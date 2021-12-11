import Card from "../../../components/card";
import Table from "../../../components/table";
import UrqlProvider from "../../../components/urql/urql-provider";
import {verifyAgent} from "../../../components/agent";
import AgentLayout from "../../../components/layouts/agent-layout";
import {Input, Select} from "semantic-ui-react";
import Categories from "../../../components/admin/shop/categories";
import React, {useState} from "react";
import InputFullAddress from "../../../components/input/input-formated-address";
import RestaurantFilter from "../../../components/agent/restaurant/filter";
import Cookies from 'js-cookie'
import Restaurants from "../../../components/agent/restaurant";

const App = props => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagePage, setTotalPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(10);
    const [key, setKey] = useState(10);




    let pagination = {
        currentPage,
        setCurrentPage,
        totalPagePage,
        setTotalPage
    }


    const [areaType, setAreaType] = useState("");

    const [area, setArea] = useState({
        division: props.agent.division,
        district: props.agent.district || '',
        municipal: props.agent.municipal || '',
        ward: props.agent.ward || '',
        upazila: props.agent.upazila || '',
        union: props.agent.union || '',
        village: props.agent.village || ''
    });


    return (
        <AgentLayout agent={props.agent}>
            <div className="row" id="category_body">
                <div className="col-lg-12">
                    <Card>
                        <div className="card-header">
                            <h4 className="d-inline">Food Categories</h4>
                        </div>
                        <div className="card-body">
                            <RestaurantFilter value={area} setValue={setArea} setType={setAreaType} agent={props.agent}/>
                            <Table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                <UrqlProvider token={Cookies.get('fja_token')}>
                                    <Restaurants area={{...area, status: 'pending'}}/>
                                </UrqlProvider>
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>

        </AgentLayout>
    )
}

export default App


export async function getServerSideProps(context) {
    let agent = await verifyAgent(context);
    return {
        props: {
            agent
        }
    }
}
