import AdminLayout from "../../../components/layouts/admin-layout";
import Card from "../../../components/card";
import Table from "../../../components/table";
import UrqlProvider from "../../../components/urql/urql-provider";
import Cookies from 'js-cookie'
import {verifyToken} from "../../../components/admin/auth";
import Riders from "../../../components/admin/rider";

const App = props => {
    return (
        <AdminLayout>
            <div className="section-header">
                <h3>Rider Requests</h3>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item">admin</div>
                    <div className="breadcrumb-item">restaurants</div>
                    <div className="breadcrumb-item">requests</div>
                </div>
            </div>

            <div class="row">
                <div class="col-12 mt-2">
                    <Card>
                        <div className="card-body">
                            <Table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <UrqlProvider token={Cookies.get('fja_token')}>
                                    <Riders status="pending"/>
                                </UrqlProvider>
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>

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
