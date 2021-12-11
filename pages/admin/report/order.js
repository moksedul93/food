import AdminLayout from "../../../components/layouts/admin-layout";
import React, {useEffect, useState} from "react";
import {DateRangePicker} from "materialui-daterange-picker";
import InputSelect from "../../../components/input/input-select";
import Swal from "sweetalert2";
import {orderReport} from "../../../components/admin/report";
import Head from "next/head";
import Card from "../../../components/card";
import Table from "../../../components/table";
import {useDispatch, useSelector} from "react-redux";
import {fetchRestaurants} from "../../../app/slices/restaurants";
import {Select} from "antd";

const OrderReport = () => {
    const [restaurant, setRestaurant] = useState()
    const [report, setReport] = useState()
    const [open, setOpen] = useState(false)
    const [dateRange, setDateRange] = React.useState({});
    const toggle = () => setOpen(!open);
    const restaurants = useSelector(state => state.restaurants.data)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchRestaurants({status: '', page: 0, size: 0}))
    }, [])

    const getName = id => {
        for (let i = 0; i < restaurants.length; i++) {
            if (restaurants[i].value === id) {
                return restaurants[i].text
            }
        }
        return ''
    }

    const handleSetRange = range => {
        if (!range.label) {
            range.label = 'Custom Date Range Selected'
        }
        setDateRange(range)
        toggle()
    }

    const handleSearch = async () => {
        setReport(undefined)
        if (!restaurant) {
            await Swal.fire('Warning', 'Please select a Restaurant', 'warning')
        } else if (dateRange.startDate) {
            let result = await orderReport(restaurant, dateRange.startDate.toISOString(), dateRange.endDate.toISOString())
            setReport(result)
        } else {
            toggle()
        }
    }

    let style = `
        @media print {
            .order-report-print {
                background-color: white;
                height: 100vh;
                width: 100vw;
                position: fixed;
                top: 0;
                left: 0;
                margin: 0;
                padding: 15px;
                font-size: 14px;
                line-height: 18px;
            }
        }
        
    `

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

    const formattedDate = timestamp => {
        let date = new Date(timestamp)
        return date.toDateString()
    }


    return (
        <AdminLayout>
            <Head>
                <title>Food Jocky - Report - {getName(restaurant)}</title>
            </Head>

            <div className="section-header">
                <h3>Order Report</h3>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item">admin</div>
                    <div className="breadcrumb-item">order report</div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 col-lg-2 pt-1">
                    <Select value={restaurant} onChange={setRestaurant} className="w-100" size="large"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} showSearch>
                        {restaurants.map(restaurant => (
                            <Select.Option key={restaurant._id} value={restaurant._id}>{restaurant.name}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div className="col-md-3 col-lg-2 mb-4">
                    <button className="form-control"
                            onClick={toggle}>{dateRange.label ? dateRange.label : 'Set Date'}</button>
                </div>
                <div className="col-md-3 col-lg-2">
                    <button className="form-control btn btn-primary text-white" onClick={handleSearch}>Search</button>
                </div>
            </div>

            <div style={{position: 'absolute'}}>
                <DateRangePicker
                    open={open}
                    toggle={toggle}
                    wrapperClassName="date-ranger"
                    onChange={handleSetRange}
                />
            </div>

            {report === false && (
                <h1 className="text-center w-50 mt-5">No Report Available</h1>
            )}

            {report && (
                <>
                    <div className="order-report-print">
                        <Card>
                            <div className="pl-5 pt-5" style={{marginBottom: 24}}>
                                <button className="btn btn-primary print-btn text-white form-control position-absolute" style={{width: 140, right: 38}}
                                        onClick={handlePrint}>Print
                                </button>
                                <p style={{fontSize: 18}}>Restaurant Name:  <span style={{color: '#000', fontWeight: 600}}>{report.restaurant.name}</span>
                                </p>
                                <p style={{fontSize: 18}}>Owner Name: <span style={{color: '#000', fontWeight: 600}}>{report.restaurant.owner.first_name + " " + report.restaurant.owner.last_name}</span></p>
                                <p style={{fontSize: 18}}>Address: <span style={{color: '#000', fontWeight: 600}}>{report.restaurant.address.address}</span></p>
                                <p style={{fontSize: 18}}>Restaurant ID: <span style={{color: '#000', fontWeight: 600}}>#{report.restaurant._id}</span></p>
                                <p style={{fontSize: 18}}>Date: <span style={{color: '#000', fontWeight: 600}}>{dateRange.startDate && dateRange.startDate.toDateString()} - {dateRange.endDate && dateRange.endDate.toDateString()}</span></p>
                            </div>
                            <div className="px-5 pb-5 overflow-auto">
                                <Table>
                                    <thead style={{borderBottom: '1px solid rgba(0,0,0,.2)'}}>
                                    <tr>
                                        <th style={{paddingLeft: 15}}>Date</th>
                                        <th>Customer Name</th>
                                        <th>Customer Mobile</th>
                                        <th>
                                            <table style={{fontWeight: "bold"}}>
                                                <td width="220">Item Name</td>
                                                <td width="50">Quantity</td>
                                                <td width="50" style={{textAlign: 'right'}}>Price</td>
                                            </table>
                                        </th>
                                        <th style={{textAlign: 'right'}}>Discount</th>
                                        <th style={{textAlign: 'right'}}>Sub Total</th>
                                        <th style={{textAlign: 'right'}}>Delivery</th>
                                        <th style={{textAlign: 'right', paddingRight: 15}}>Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {report.orders.map(order => (
                                        <>
                                            <tr key={order.key} style={{
                                                borderBottom: '1px solid rgba(0,0,0, .2)',
                                                marginBottom: 20
                                            }}>
                                                <td style={{paddingLeft: 15}}>{formattedDate(+order.createdAt)}</td>
                                                <td>{order.customer.first_name + " " + order.customer.last_name}</td>
                                                <td>{order.customer.mobile}</td>
                                                <td>
                                                    {order.items.map(item => (
                                                        <table>
                                                            <tr>
                                                                <td width="220">{item.name}</td>
                                                                <td width="50" className="pl-5 pr-5">{item.quantity}</td>
                                                                <td width="50" className="pl-5" style={{textAlign: 'right'}}>{item.quantity * item.price}</td>
                                                            </tr>
                                                        </table>
                                                    ))}
                                                </td>
                                                <td style={{textAlign: 'right'}}>0</td>
                                                <td style={{textAlign: 'right'}}>{order.sub_total}</td>
                                                <td style={{textAlign: 'right'}}>{order.delivery_charge}</td>
                                                <td style={{textAlign: 'right', paddingRight: 15}}>{order.total}</td>
                                            </tr>
                                        </>
                                    ))}
                                    </tbody>
                                </Table>
                                <div className="pr-3" style={{textAlign: 'right', fontWeight: 600}}>
                                    <h5 style={{fontSize: 22}}>Total: {report.total}</h5>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <iframe id="print-frame" className="order-report"
                            style={{width: 0, height: 0, position: "absolute"}}></iframe>
                </>
            )}


        </AdminLayout>
    )
}
export default OrderReport