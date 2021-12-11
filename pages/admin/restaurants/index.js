import AdminLayout from "../../../components/layouts/admin-layout";
import Card from "../../../components/card";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Select, Table} from "antd";
import Link from "next/link";
import {fetchRestaurants} from "../../../app/slices/restaurants";

const Restaurants = () => {
    const dispatch = useDispatch()
    const [status, setStatus] = useState()
    const [name, setName] = useState('')
    console.log("name-",name)

    let restaurants = useSelector(state => state.restaurants)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    })
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        let status = urlParams.get('status')
        setStatus(status)
        getRestaurant(status, 1, 10)
    }, [])

    const getRestaurant = (status, page, size) => {
        dispatch(fetchRestaurants({status, page, size})).then(({payload}) => {
            setPagination({
                current: page,
                pageSize: size,
                total: payload.data.totalDocs
            })
        })
    }

    const handleStatusChange = value => {
        setStatus(value)
        getRestaurant(value, 1, 10)
    }

    const handleSubmit = () => {
        dispatch(fetchRestaurants({name})).then(({payload}) => {
            setPagination({
                current: 1,
                pageSize: 10,
                total: payload.data.totalDocs
            })
        })
        
    }

    const handleTableChange = pagination => {
        getRestaurant( status || '', pagination.current, pagination.pageSize )
    }


    let columns = [
        {title: '#', dataIndex: 'key'},
        {title: 'Name', dataIndex: 'name'},
        {title: 'Type', dataIndex: 'type'},
        {
            title: 'Status',
            dataIndex: 'status',
            render: status => (
                <>
                    {status === 'pending' && (
                        <div className="badge badge-pill badge-danger mt-3">Pending</div>
                    )}
                    {status === 'approved' && (
                        <div className="badge badge-pill badge-primary mt-3">Approved</div>
                    )}
                    {status === 'suspended' && (
                        <div className="badge badge-pill badge-secondary mt-3">Suspended</div>
                    )}
                    {status === 'cancelled' && (
                        <div className="badge badge-pill badge-dark mt-3">Cancelled</div>
                    )}
                </>
            )
        },
        {
            title: 'Action',
            render: restaurant => (
                <>
                    <Link href={"/admin/products/all?id=" + restaurant.owner + "&restaurant_id=" + restaurant._id}>
                        <a className="text-primary table-action c-pointer mr-2"><i className="fa fa-shopping-cart"/>
                        </a>
                    </Link>
                    <Link href={"/admin/restaurants/view?id=" + restaurant._id}>
                        <a className="text-primary table-action c-pointer"><i className="fa fa-eye"/> </a>
                    </Link>
                </>
            )
        },

    ]

    return (
        <AdminLayout>
            <div className="row">
                <div className="col-12 mt-2">
                    <Card>
                        <div className="card-header">
                            <h3 style={{color: '#6c757d', paddingRight:"10px"}}>Restaurants</h3>
                            <Select
                                className="position-absolute"
                                aria-placeholder="Status"
                                value={status}
                                onChange={handleStatusChange}
                                style={{width: 170, right: 26, float: "right"}}
                                size="large" placeholder="Status" allowClear>
                                <Select.Option value="pending">Pending</Select.Option>
                                <Select.Option value="approved">Approved</Select.Option>
                                <Select.Option value="cancelled">Cancelled</Select.Option>
                                <Select.Option value="suspended">Suspended</Select.Option>
                            </Select>

                    {/*   search input       */}
                            <input name='name' value={name} onChange={(e)=>setName(e.target.value)} style={{width: 170, right: 26, float: "right"}} placeholder="Search By Name"></input>
                            <button type="submit" onClick={handleSubmit}>Search</button>
                    {/* -------------------------- */}
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    pagination={pagination}
                                    onChange={handleTableChange}
                                    loading={restaurants.loading}
                                    dataSource={restaurants.data.map((restaurant, index) => {
                                    return {
                                        _id: restaurant._id,
                                        key:( pagination.current-1 ) * pagination.pageSize + index + 1,
                                        // key: index + 1,
                                        name: restaurant.name,
                                        type: restaurant.restaurant_or_homemade,
                                        status: restaurant.status,
                                        owner: restaurant.owner._id
                                    }
                                })}/>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Restaurants
