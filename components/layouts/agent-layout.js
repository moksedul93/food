import React, {useEffect, useState} from "react";
import Head from "next/head";
import Header from "../header";
import Navbar from "../navbar";
import NavLink from "../navbar/nav-link";
import MyLink from "../common/my-link";
import MainContent from "./main-content";
import HeaderDropDownMenu from "../header/header-dropdown-menu";
import Cookies from 'js-cookie';
import {useRouter} from "next/router";
import Notification from "../agent/notification";

const AgentLayout = props => {
    const [layout , setLayout] = useState("");

    let router = useRouter();
    const handleLogout = e => {
        e.preventDefault();
        Cookies.remove('fja_token');
        router.push('/agent/login');
    }

    return (
        <>
            <Head>
                <title>Food Jocky </title>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVKjCxMvk5Nymx6VYSlhc4iOasFoTxuCk&libraries=places"/>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"/>
            </Head>
            <div id="app">
                <div className="main-wrapper">
                    <Header layout={layout} setLayout={setLayout}>
                        <HeaderDropDownMenu
                            icon = "https://food.amcoders.xyz/admin/img/profile/profile.jpg"
                            title = {"Hi, " + ( props.agent.first_name || 'User') }
                        >
                            <div className="dropdown-title">My Id #1</div>
                            <MyLink href="/agent/profile" className="dropdown-item has-icon">
                                <i className="far fa-user"></i> Profile
                            </MyLink>
                            <a className="dropdown-item has-icon text-danger c-pointer" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </HeaderDropDownMenu>
                    </Header>

                    <Navbar siteIcon="/assets/img/logo.gif" siteTitle="Food Jocky" siteTitleMini="F..j.." layout={layout} setLayout={setLayout} href="/agent">
                        <NavLink href="/agent" iconClassName="fas fa-tachometer-alt" title="Dashboard"/>
                        <NavLink href="/agent/restaurant/requests" iconClassName="far fa-clock" title="Restaurant Requests"/>
                        <NavLink href="/agent/restaurant/all" iconClassName="fas fa-utensils" title="All Restaurants"/>
                        <NavLink href="#!" iconClassName="fas fa-users" title="All Agents"/>
                        <NavLink href="#!" iconClassName="far fa-money-bill-alt" title="Earnings"/>
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

export default AgentLayout
