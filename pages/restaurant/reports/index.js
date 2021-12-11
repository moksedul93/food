import RestaurantLayout from "../../../components/layouts/restaurant-layout";
import Card from "../../../components/card";
import React, {useEffect, useState} from "react";
import {DateRangePicker} from "materialui-daterange-picker";
import {fetchRestaurantReport} from "../../../app/slices/report";
import {useDispatch, useSelector} from "react-redux";
import Table from "../../../components/table";
import moment from "moment";

const Reports = () => {
    const dispath = useDispatch()
    const [open, setOpen] = useState(false)
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
        getReport(range)
        toggle()
    }

    const report = useSelector(state => state.report)
    const restaurant = useSelector(state => state.restaurant)
    const getReport = range => {
        dispath(fetchRestaurantReport({range}))
    }
    useEffect(() => {
        getReport(dateRange)
    }, [])

    const formattedDate = timestamp => {
        return moment(timestamp).local().format('D/M/yy hh:mm a')
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


    return (
        <RestaurantLayout>
            <Card>
                <div className="card-header d-flex justify-content-lg-between">
                    <h3 style={{color: '#6c757d'}}>Reports</h3>
                    <div>
                        <button className="px-4 py-1 mr-4 btn btn-primary rounded" onClick={toggle}>Date
                            : {dateRange.label ? dateRange.label : 'Set Date'}</button>
                        <div style={{position: 'absolute', right: 0}}>
                            <DateRangePicker
                                open={open}
                                toggle={toggle}
                                initialDateRange={dateRange}
                                wrapperClassName="date-ranger"
                                onChange={handleSetRange}
                            />
                        </div>
                        <button className="btn btn-primary px-4 py-1 rounded" onClick={handlePrint}>Print</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="py-5 my-5" style={{display: report.loading ? 'block': 'none'}}>
                        <div className="loader dark"/>
                    </div>

                    <div className="order-report-print" style={{display: report.loading ? 'none': 'block'}}>
                        <div className="pl-5" style={{marginBottom: 24}}>
                            <p style={{fontSize: 18}}>Restaurant Name:  <span style={{color: '#000', fontWeight: 600}}>{restaurant.name}</span></p>
                            <p style={{fontSize: 18}}>Date: <span style={{color: '#000', fontWeight: 600}}>{moment(dateRange.startDate).format('D/M/yy')} - {moment(dateRange.endDate).format('D/M/yy')}</span></p>
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
                                    <th style={{textAlign: 'right'}}>Sub Total</th>
                                    <th style={{textAlign: 'right'}}>Discount</th>
                                    <th style={{textAlign: 'right', paddingRight: 15}}>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.data?.orders?.map(order => (
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
                                                            <td width="50" className="pl-5"
                                                                style={{textAlign: 'right'}}>{(item.quantity * item.base_price)?.toFixed(2)}</td>
                                                        </tr>
                                                    </table>
                                                ))}
                                            </td>
                                            <td style={{textAlign: 'right'}}>{order.base_price_sub_total?.toFixed(2)}</td>
                                            <td style={{textAlign: 'right'}}>{(order.base_price_total - order.base_price_sub_total)?.toFixed(2)}</td>
                                            <td style={{
                                                textAlign: 'right',
                                                paddingRight: 15
                                            }}>{order.base_price_total?.toFixed(2)}</td>
                                        </tr>
                                    </>
                                ))}
                                </tbody>
                            </Table>
                            <div className="pr-3" style={{textAlign: 'right', fontWeight: 600}}>
                                <h5 style={{fontSize: 22}}>Total: {report.data?.total?.toFixed(2)}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <iframe id="print-frame" className="order-report"
                    style={{width: 0, height: 0, position: "absolute"}}/>


        </RestaurantLayout>
    )
}
export default Reports