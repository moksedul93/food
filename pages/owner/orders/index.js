import OwnerLayout from "../../../components/layouts/owner-layout";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import Card from "../../../components/card";
import {Select} from "antd";


const Orders = () => {
    const dispatch = useDispatch()
    const [status, setStatus] = useState(undefined)
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {

    }, [])


    return (
        <OwnerLayout>
            <Card>
                <div className="card-header d-flex justify-content-lg-between">
                    <h3 style={{color: '#6c757d'}}>Orders</h3>
                   <div>
                       <Select className="mr-4" style={{width: 200}} placeholder="Restaurant">

                       </Select>
                       <Select style={{width: 200}} placeholder="Status">
                               <Select.Option id="1" value="pending">Pending</Select.Option>
                               <Select.Option id="2" value="accepted">Approved</Select.Option>
                               <Select.Option id="3" value="paid">Complete</Select.Option>
                               <Select.Option id="4" value="cancelled">Cancelled</Select.Option>
                       </Select>
                   </div>


                </div>
            </Card>
        </OwnerLayout>
    )
}

export default Orders