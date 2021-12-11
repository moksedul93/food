import Card from "../../../components/card";
import React, {useEffect, useState} from "react";
import {DateRangePicker} from "materialui-daterange-picker";
import {fetchOwnerReport, fetchRestaurantReport} from "../../../app/slices/report";
import {useDispatch, useSelector} from "react-redux";
import Table from "../../../components/table";
import moment from "moment";
import OwnerLayout from "../../../components/layouts/owner-layout";
import {fetchOwnerRestaurants} from "../../../app/slices/restaurants";
import {Select} from "antd";

const Reports = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [restaurantID, setRestaurantID] = useState();
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
    const getReport = (restaurantID, range) => {
        dispatch(fetchOwnerReport({restaurantID, range}))
    }
    const restaurants = useSelector(state => state.restaurants)
    useEffect(() => {
        dispatch(fetchOwnerRestaurants({status: 'approved'}))
        getReport(restaurantID, dateRange)
    }, [])

    const formattedDate = timestamp => {
        return moment(timestamp).local().format('D/M/yy hh:mm a')
    }
    const onRestaurantSelect = value => {
        setRestaurantID(value)
        setRestaurantName(getRestaurantName(value))
    }
    const handleSearch = () => {
        getReport(restaurantID, dateRange)
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
        for(let i=0; i < restaurants.data.length ; i++) {
            if(restaurants.data[i]._id === value) {
                return restaurants.data[i].name
            }
        }
        return 'All Restaurant'
    }
    let grandTotal = 0;

    return (
        <OwnerLayout>
            <Card>
                <div className="card-header d-flex justify-content-lg-between">
                    <h3 style={{color: '#6c757d'}}>Reports</h3>
                    <div className="d-flex align-items-end">
                        <div className="mr-4 d-inline-block">
                            <Select placeholder="Restaurant"
                                    style={{width: 150}}
                                    value={restaurantID} onSelect={onRestaurantSelect} onClear={onRestaurantSelect}
                                    allowClear>
                                {restaurants.data.map(restaurant => (
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
                    <div className="py-5 my-5" style={{display: report.loading ? 'block': 'none'}}>
                        <div className="loader dark"/>
                    </div>

                    <div className="order-report-print" style={{display: report.loading ? 'none': 'block'}}>
                        <button className="btn btn-primary px-4 py-1 rounded print-btn position-absolute" style={{width: 140, right: 28}}
                                onClick={handlePrint}>Print
                        </button>
                        <div className="pl-5" style={{marginBottom: 24}}>
                            <p style={{fontSize: 18}}>Restaurant Name:  <span style={{color: '#000', fontWeight: 600}}>{restaurantName}</span></p>
                            <p style={{fontSize: 18}}>Date: <span style={{color: '#000', fontWeight: 600}}>{moment(dateRange.startDate).format('D/M/yy')} - {moment(dateRange.endDate).format('D/M/yy')}</span></p>
                        </div>
                        <div className="px-5 pb-5 overflow-auto">
                            <Table>
                                <thead style={{borderBottom: '1px solid rgba(0,0,0,.2)'}}>
                                <tr>
                                    <th style={{paddingLeft: 15}}>Date</th>
                                    <th>Restaurant Name</th>
                                    <th>
                                        <table style={{fontWeight: "bold"}}>
                                            <td width="220">Item Name</td>
                                            <td width="50">Quantity</td>
                                            <td width="50" style={{textAlign: 'right'}}>Price</td>
                                        </table>
                                    </th>
                                    <th style={{textAlign: 'right'}}>Sub Total</th>
                                    <th style={{textAlign: 'right'}}>Discount</th>
                                    <th style={{textAlign: 'right'}}>Commission</th>
                                    <th style={{textAlign: 'right', paddingRight: 15}}>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.data?.orders?.map(order => {
                                    let commission = order.base_price_total * (order.restaurant?.plan?.commision || 0) * 0.01
                                    let total = order.base_price_total - commission
                                    grandTotal += total;
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
                                                                <tr>
                                                                    <td width="220">{item.name}</td>
                                                                    <td width="50" className="pl-5 pr-5">{item.quantity}</td>
                                                                    <td width="50" className="pl-5"
                                                                        style={{textAlign: 'right'}}>{(item.quantity * item.base_price)?.toFixed(2)}</td>
                                                                </tr>
                                                            </table>
                                                        ))}
                                                    </td>
                                                    <td style={{textAlign: 'right'}}>{order.base_price_sub_total?.toFixed(2)}</td>
                                                    <td style={{textAlign: 'right'}}>{(order.base_price_total - order.base_price_sub_total)?.toFixed(2)}</td>
                                                    <td style={{textAlign: 'right'}}>-{commission?.toFixed(2)}</td>
                                                    <td style={{
                                                        textAlign: 'right',
                                                        paddingRight: 15
                                                    }}>{total?.toFixed(2)}</td>
                                                </tr>
                                            </>
                                        )
                                    )
                                })}
                                </tbody>
                            </Table>
                            <div className="pr-3" style={{textAlign: 'right', fontWeight: 600}}>
                                <h5 style={{fontSize: 22}}>Total: {grandTotal.toFixed(2)}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <iframe id="print-frame" className="order-report"
                    style={{width: 0, height: 0, position: "absolute"}}/>


        </OwnerLayout>
    )
}
export default Reports