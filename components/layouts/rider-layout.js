import Head from "next/head";
import Header from "../header";
import HeaderDropDownMenu from "../header/header-dropdown-menu";
import MyLink from "../common/my-link";
import Navbar from "../navbar";
import NavLink from "../navbar/nav-link";
import NavDropDown from "../navbar/nav-dropdown";
import NavDropDownLink from "../navbar/nav-dropdown-link";
import MainContent from "./main-content";
import Notification from "../restaurant/notification/index";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {fetchRestaurant} from "../../app/slices/restaurant";


const RiderLayout = props => {
    const [layout, setLayout] = useState("");
    const dispatch = useDispatch()
    let router = useRouter();
    // let restaurant = useSelector(state => state.restaurant)

    // useEffect(() => {
    //     dispatch(fetchRestaurant({})).then(({payload}) => {
    //         if (payload.error) {
    //             router.push('/rider/login').then(() => {
    //             })
    //         }
    //     })
    // }, [])

    // if (!restaurant.auth) {
    //     return <></>
    // }

    const handleLogout = e => {
        e.preventDefault();
        Cookies.remove('fja_token');
        router.push('/rider/login');
    }

    return (
        <>
            <Head>
                <title>Food Jocky Rider Panel</title>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
                      rel="stylesheet"/>
            </Head>
            <div id="app">
                <div className="main-wrapper">
                    <Header layout={layout} setLayout={setLayout}>
                        <HeaderDropDownMenu
                            icon="https://food.amcoders.xyz/admin/img/profile/profile.jpg"
                            // title={"Hi, " + rider.name}
                        >
                            <div className="dropdown-title">My Id #1</div>
                            <MyLink href="/rider/profile" className="dropdown-item has-icon">
                                {/* <i className="far fa-user"/> {rider.name} */}
                            </MyLink>
                            <a className="dropdown-item has-icon text-danger c-pointer" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"/> Logout
                            </a>
                        </HeaderDropDownMenu>
                    </Header>

                    <Navbar siteIcon="/assets/img/logo.gif" siteTitle="Food Jocky" siteTitleMini="F..j.."
                            layout={layout} setLayout={setLayout} href="/rider">
                        <NavLink href="/rider" iconClassName="fas fa-tachometer-alt" title="Dashboard"/>
                        {/*<NavLink href="#!" iconClassName="fas fa-vector-square" title="Customize" disabled/>*/}
                        {/*<NavLink href="#!" iconClassName="far fa-images" title="Media" disabled/>*/}

                        <NavLink href="/rider/live_order" iconClassName="fa fa-shopping-cart" title="Live Order"/>


                        {/*<NavDropDown iconClassName="fas fa-bicycle" title="Riders" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Rider Requests"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="All Riders"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavLink href="#!" iconClassName="fas fa-users" title="Customers" disabled/>*/}

                        {/*<NavDropDown iconClassName="fas fa-wallet" title="Payouts" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Payments Requests"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Payments History"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Payments Payout"/>*/}
                        {/*</NavDropDown>*/}

                        <NavLink href="/rider/orders" iconClassName="fas fa-cubes" title="Orders"/>
                        <NavLink href="/rider/reports" iconClassName="fas fa-print" title="Reports"/>

                        {/*<NavDropDown iconClassName="fas fa-money-check-alt" title="Plans" disabled>*/}
                        {/*    <NavDropDownLink  href="/restaurant/plan/create" title="Create New"/>*/}
                        {/*    <NavDropDownLink  href="/restaurant/plan/manage" title="Manage Plans"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Payment Request"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavDropDown iconClassName="fas fa-map-marked-alt" title="Locations" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Create New"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Manage Locations"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavDropDown iconClassName="fas fa-certificate" title="Badges" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Seller Badges"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavDropDown iconClassName="fas fa-highlighter" title="Featured" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Featured Seller"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Manage Featured Seller"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavDropDown iconClassName="fas fa-money-check-alt" title="Earning Reports" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Earning By Order"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Earning By Delivery"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Earning By Subscription"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavDropDown iconClassName="fas fa-cogs" title="Settings" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Site Settings"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Seo"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Filesystem"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="System Settings"/>*/}
                        {/*</NavDropDown>*/}

                    </Navbar>

                </div>
                <MainContent>
                    {props.children}
                    <Notification/>
                </MainContent>

            </div>

        </>

    )
}

export default RiderLayout
