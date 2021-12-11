import Card from "../../../components/card";
import React, {useEffect, useState} from "react";
import {DateRangePicker} from "materialui-daterange-picker";
import {fetchAdminReport} from "../../../app/slices/report";
import {useDispatch, useSelector} from "react-redux";
import Table from "../../../components/table";
import moment from "moment";
import {fetchRestaurants} from "../../../app/slices/restaurants";
import {Select} from "antd";
import AdminLayout from "../../../components/layouts/admin-layout";
import {fetchSettings} from "../../../app/slices/settings";
import {fetchOwners} from "../../../app/slices/owners";

const Reports = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [restaurantID, setRestaurantID] = useState();
    const [ownerID, setOwnerID] = useState();
    const [ownerName, setOwnerName] = useState();
    const [restaurantName, setRestaurantName] = useState('All Restaurant');
    const [dateRange, setDateRange] = React.useState({
        label: "Today",
        startDate: new Date(),
        endDate: new Date()
    })
    const toggle = () => setOpen(!open);
    const handleSetRange = range => {
        if (!range.label) {
            range.label = `${range.startDate.toLocaleString().split(',')[0]} - ${range.endDate.toLocaleString().split(',')[0]}`
        }
        setDateRange(range)
        toggle()
    }

    const report = useSelector(state => state.report)
    const getReport = (ownerID, restaurantID, range) => {
        dispatch(fetchAdminReport({ownerID, restaurantID, range}))
    }
    const [restaurants, setRestaurants] = useState([])
    let allRestaurants = useSelector(state => state.restaurants)
    const owners = useSelector(state => state.owners)
    useEffect(() => {
        dispatch(fetchSettings({}))
        dispatch(fetchRestaurants({status: '', page: 0, size: 0})).then(({payload}) => {
            if(!payload.error) {
                setRestaurants(payload.data.docs)
            }
        })
        dispatch(fetchOwners({status: '', page: 0, size: 0}))
        getReport(ownerID, restaurantID, dateRange)
    }, [])

    const formattedDate = timestamp => {
        return moment(timestamp).local().format('D/M/yy hh:mm a')
    }
    const onRestaurantSelect = value => {
        setRestaurantID(value)
        console.log(getRestaurantName(value))
        setRestaurantName(getRestaurantName(value))
    }

    const onOwnerSelect = value => {
        setOwnerID(value)
        if(value?.length === 24) {
            setRestaurants(allRestaurants.data.filter(restaurant => restaurant.owner._id === value))
            let owner = owners.data.find(owner => owner._id === value)
            setOwnerName(owner.first_name + " " + owner.last_name)
        } else {
            setRestaurants(allRestaurants.data)
            setOwnerName(undefined)
        }
    }

    const handleSearch = () => {
        getReport(ownerID, restaurantID, dateRange)
    }

    const handlePrint = () => {
        let style = document.createElement("style");
        style.media = "print"
        style.innerHTML = `    
        table, th, td {
            font-size: 12px;
            border-collapse: collapse;
            min-width: 60px;
            text-align: left;
            padding: 10px 0;
        }
        table {
            width: 100%;
            padding: 5px;
            border: 1px solid rgba(0,0,0,.2);
        }
        table table {
            border: none;
        }
        th {
            padding: 5px;
        }
        td {
            padding: 5px;
        }
        .print-btn {
            display: none;
        }
        p {
            margin: 10px 0;
        }
        `
        let content = document.querySelector(".order-report-print");
        let pri = document.querySelector("#print-frame").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.head.appendChild(style);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    const getRestaurantName = value => {
        let restaurant = restaurants.find(restaurant => restaurant._id === value)
        return restaurant?.name || 'All Restaurant'
    }
    let grandTotal = 0;
    let settings = useSelector(state => state.settings)

    const calculateRestaurantDue = (total, restaurant) => {
        let commission = (restaurant && restaurant.plan && restaurant.plan.commision) ? (total * restaurant.plan.commision * 0.01) : 0
        let vat = (restaurant && restaurant.vat && settings.restaurant_vat) ? (total * settings.restaurant_vat * 0.01) : 0
        let rider = (restaurant && restaurant.rider_cost && settings.rider_cost) ? settings.rider_cost : 0
        return (total - commission - vat - rider) || 0
    }

    return (
        <AdminLayout>
            <Card>
                <div className="card-header d-flex justify-content-lg-between">
                    <h3 style={{color: '#6c757d'}}>Reports</h3>
                    <div className="d-flex align-items-end">
                        <div className="mr-4 d-inline-block">
                            <Select placeholder="Owners"
                                    showSearch
                                    style={{width: 150}}
                                    value={ownerID} onSelect={onOwnerSelect} onClear={onOwnerSelect}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    allowClear>
                                {owners.data.map(owner => (
                                    <Select.Option key={owner._id}
                                                   value={owner._id}>{owner.first_name + " " + owner.last_name}</Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div className="mr-4 d-inline-block">
                            <Select placeholder="Restaurant"
                                    showSearch
                                    style={{width: 150}}
                                    value={restaurantID} onSelect={onRestaurantSelect} onClear={onRestaurantSelect}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    allowClear>
                                {restaurants.map(restaurant => (
                                    <Select.Option key={restaurant._id}
                                                   value={restaurant._id}>{restaurant.name}</Select.Option>
                                ))}
                            </Select>
                        </div>
                        <button className="px-4 py-1 mr-4 btn btn-primary rounded" onClick={toggle}>Date
                            : {dateRange.label ? dateRange.label : 'Set Date'}</button>
                        <div style={{position: 'absolute', right: 0, top: 70}}>
                            <DateRangePicker
                                open={open}
                                toggle={toggle}
                                initialDateRange={dateRange}
                                wrapperClassName="date-ranger"
                                onChange={handleSetRange}
                            />
                        </div>
                        <button className="btn btn-primary px-4 py-1 rounded" onClick={handleSearch}>Search</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="py-5 my-5" style={{display: report.loading ? 'block' : 'none'}}>
                        <div className="loader dark"/>
                    </div>

                    <div className="order-report-print" style={{display: report.loading ? 'none' : 'block'}}>
                        <button className="btn btn-primary px-4 py-1 rounded print-btn position-absolute"
                                style={{width: 140, right: 28}}
                                onClick={handlePrint}>Print
                        </button>
                        <div className="pl-5" style={{marginBottom: 24}}>
                            {ownerName && (
                                <p style={{fontSize: 18}}>Owner Name: <span
                                    style={{color: '#000', fontWeight: 600}}>{ownerName}</span></p>
                            )}
                            <p style={{fontSize: 18}}>Restaurant Name: <span
                                style={{color: '#000', fontWeight: 600}}>{restaurantName}</span></p>
                            <p style={{fontSize: 18}}>Date: <span style={{
                                color: '#000',
                                fontWeight: 600
                            }}>{moment(dateRange.startDate).format('D/M/yy')} - {moment(dateRange.endDate).format('D/M/yy')}</span>
                            </p>
                        </div>
                        <div className="px-5 pb-5 overflow-auto">
                            <Table>
                                <thead style={{borderBottom: '1px solid rgba(0,0,0,.2)'}}>
                                <tr>
                                    <th style={{paddingLeft: 15}}>Date</th>
                                    <th>Restaurant Name</th>
                                    <th>
                                        <table style={{fontWeight: "bold"}}>
                                            <thead>
                                            <td width="220">Item Name</td>
                                            <td width="50" style={{textAlign: 'right'}}>Quantity</td>
                                            <td width="50" style={{textAlign: 'right'}}>Price</td>
                                            </thead>
                                        </table>
                                    </th>
                                    <th style={{textAlign: 'right'}}>Sub Total</th>
                                    <th style={{textAlign: 'right'}}>Discount</th>
                                    <th style={{textAlign: 'right'}}>Delivery Charge</th>
                                    <th style={{textAlign: 'right'}}>Customer Vat</th>
                                    <th style={{textAlign: 'right'}}>Paid Amount</th>
                                    <th style={{textAlign: 'right'}}>Cost</th>
                                    <th style={{textAlign: 'right', paddingRight: 15}}>Foodjocky Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.data?.orders?.map(order => {
                                    let cost = (order.cashback || 0)
                                        + calculateRestaurantDue(order.base_price_total, order.restaurant)
                                        + (order.delivery_charge * 0.5) + ((order.vat || 0) + ((order.base_price_total * settings.restaurant_vat * 0.01) || 0))
                                        + (order.total * 0.03)

                                    let profit = order.total - cost
                                    grandTotal += profit;
                                    return (
                                        (
                                            <>
                                                <tr key={order.key} style={{
                                                    borderBottom: '1px solid rgba(0,0,0, .2)',
                                                    marginBottom: 20
                                                }}>
                                                    <td style={{paddingLeft: 15}}>{formattedDate(+order.createdAt)}</td>
                                                    <td>{order.restaurant.name}</td>
                                                    <td>
                                                        {order.items.map(item => (
                                                            <table>
                                                                <tbody>
                                                                <tr>
                                                                    <td width="220">{item.name}</td>
                                                                    <td width="50"
                                                                        className="pl-5 pr-5">{item.quantity}</td>
                                                                    <td width="50" className="pl-5"
                                                                        style={{textAlign: 'right'}}>{(item.quantity * item.price)?.toFixed(2)}</td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        ))}
                                                    </td>
                                                    <td style={{textAlign: 'right'}}>{order.sub_total?.toFixed(2)}</td>
                                                    <td style={{textAlign: 'right'}}>-{(order.customer_discount_amount)?.toFixed(2)}</td>
                                                    <td style={{textAlign: 'right'}}>-{order.delivery_charge?.toFixed(2)}</td>
                                                    <td style={{textAlign: 'right'}}>-{order.vat?.toFixed(2)}</td>
                                                    <td style={{textAlign: 'right'}}>{order.total?.toFixed(2)}</td>
                                                    <td style={{textAlign: 'right'}}>-{cost?.toFixed(2)}</td>
                                                    <td style={{
                                                        textAlign: 'right',
                                                        paddingRight: 15
                                                    }}>{profit?.toFixed(2)}</td>
                                                </tr>
                                            </>
                                        )
                                    )
                                })}
                                </tbody>
                            </Table>
                            <div className="mr-3 position-relative"
                                 style={{textAlign: 'right', fontWeight: 600, marginTop: 10}}>
                                <p style={{fontSize: 18}}>Total: &nbsp; {grandTotal.toFixed(2)}</p>
                                <p style={{fontSize: 18}}>Overhead (15%): &nbsp;  {(grandTotal * 0.15).toFixed(2)}</p>
                                <hr width={200} style={{position: "absolute", marginTop: -5, right: 0}}/>
                                <p style={{
                                    fontSize: 18,
                                    paddingBottom: 4
                                }}>Profit: &nbsp;  {(grandTotal * 0.85).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <iframe id="print-frame" className="order-report"
                    style={{width: 0, height: 0, position: "absolute"}}/>


        </AdminLayout>
    )
}
export default Reports