import React, {useEffect, useState} from "react";
import Head from "next/head";
import Header from "../header";
import Navbar from "../navbar";
import NavLink from "../navbar/nav-link";
import MyLink from "../common/my-link";
import NavDropDown from "../navbar/nav-dropdown";
import NavDropDownLink from "../navbar/nav-dropdown-link";
import MainContent from "./main-content";
import HeaderDropDownMenu from "../header/header-dropdown-menu";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {fetchOwner} from "../../app/slices/owner";

const AgencyLayout = ({children}) => {
    const router = useRouter();
    const dispatch = useDispatch()
    const [layout, setLayout] = useState("");

    // let agency = useSelector(state => state.agency)
    // useEffect(() => {
    //     if(!owner.auth) {
    //         dispatch(fetchOwner({})).then(({payload}) => {
    //             if (payload.error) {
    //                 router.push('/agency/login').then(() => {
    //                 });
    //             }
    //         })
    //     }
    // })


    const handleLogout = e => {
        e.preventDefault();
        Cookies.remove('fja_token');
        router.push('/agency/login');
    }

    // if (!owner.auth) {
    //     return <></>
    // }

    return (
        <>
            <Head>
                <title>Food Jocky Agency Panel</title>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
                      rel="stylesheet"/>
            </Head>
            <div id="app">
                <div className="main-wrapper">
                    <Header layout={layout} setLayout={setLayout}>
                        <HeaderDropDownMenu
                            icon="https://food.amcoders.xyz/admin/img/profile/profile.jpg"
                            title={"Hi, " }
                        >
                            <div className="dropdown-title">My Id #1</div>
                            <MyLink href="/agency/profile" className="dropdown-item has-icon">
                                <i className="far fa-user"/> Profile
                            </MyLink>
                            <a className="dropdown-item has-icon text-danger c-pointer" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"/> Logout
                            </a>
                        </HeaderDropDownMenu>
                    </Header>

                    <Navbar siteIcon="/assets/img/logo.gif" siteTitle="Food Jocky" siteTitleMini="F..j.."
                            layout={layout} setLayout={setLayout} href="/agency">
                        <NavLink href="/owner" iconClassName="fas fa-tachometer-alt" title="Dashboard"/>
                        <NavLink href="/live_order" iconClassName="fas fa-tachometer-alt" title="Live Order"/>
                        <NavLink href="/orders" iconClassName="fas fa-tachometer-alt" title="Orders"/>
                        <NavLink href="/riders" iconClassName="fas fa-tachometer-alt" title="Riders"/>
                        <NavLink href="/earnings" iconClassName="fas fa-tachometer-alt" title="Earnings"/>
                        <NavLink href="/payouts" iconClassName="fas fa-tachometer-alt" title="Payouts"/>
                        <NavLink href="/settings" iconClassName="fas fa-tachometer-alt" title="Settings"/>

                        {/* <NavDropDown iconClassName="fas fa-utensils" title="Restaurant">
                            <NavDropDownLink href="/owner/restaurant/create" title="Add New"/>
                            <NavDropDownLink href="/owner/restaurant/all" title="All Restaurants"/>
                        </NavDropDown> */}

                        {/*<NavLink href="/user/orders" iconClassName="fas fa-cubes" title="Orders"/>*/}

                        {/* <NavLink href="/owner/wallet" iconClassName="fas fa-wallet" title="Wallets"/>
                        <NavLink href="/owner/reports" iconClassName="fas fa-print" title="Reports"/> */}

                        {/*<NavDropDown iconClassName="fas fa-bicycle" title="Riders" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Rider Requests" disabled/>*/}
                        {/*    <NavDropDownLink  href="#!" title="All Riders" disabled/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavLink href="#!" iconClassName="fas fa-users" title="Customers" disabled/>*/}

                        {/*<NavDropDown iconClassName="fas fa-wallet" title="Payouts" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Payments Requests"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Payments History"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Payments Payout"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavDropDown iconClassName="fas fa-cubes" title="Orders" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="All Orders"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Pending Orders"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Accept Orders"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Complete Orders"/>*/}
                        {/*</NavDropDown>*/}

                        {/*<NavDropDown iconClassName="fas fa-money-check-alt" title="Plans" disabled>*/}
                        {/*    <NavDropDownLink  href="#!" title="Create New"/>*/}
                        {/*    <NavDropDownLink  href="#!" title="Manage Plans"/>*/}
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
                    {children}
                </MainContent>

            </div>

        </>

    )
}

export default AgencyLayout
