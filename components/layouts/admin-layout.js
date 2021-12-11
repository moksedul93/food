import HeaderDropDownMenu from "../header/header-dropdown-menu";
import NavDropDownLink from "../navbar/nav-dropdown-link";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmin } from "../../app/slices/admin";
import React, { useEffect, useState } from "react";
import NavDropDown from "../navbar/nav-dropdown";
import Notification from "../admin/notification";
import NavLink from "../navbar/nav-link";
import MainContent from "./main-content";
import MyLink from "../common/my-link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Header from "../header";
import Navbar from "../navbar";
import Head from "next/head";

const AdminLayout = (props) => {
  let router = useRouter();
  let dispatch = useDispatch();
  const [layout, setLayout] = useState("");
  let admin = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdmin({})).then(({ payload }) => {
      if (payload.error) {
        router.push("/admin/login");
      }
    });
  }, []);

  if (!admin.auth) {
    return <></>;
  }
  const handleLogout = (e) => {
    e.preventDefault();
    Cookies.remove("fja_token");
    router.push("/admin/login");
  };

  return (
    <>
      <Head>
        <title>Food Jocky Admin</title> 
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVKjCxMvk5Nymx6VYSlhc4iOasFoTxuCk&libraries=places" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div id="app">
        <div className="main-wrapper">
          <Header layout={layout} setLayout={setLayout}>
            <HeaderDropDownMenu
              icon="https://food.amcoders.xyz/admin/img/profile/profile.jpg"
              title="Hi, Admin"
            >
              <div className="dropdown-title">My Id #1</div>
              <MyLink href='/admin/profile' className="dropdown-item has-icon">
                <i className="far fa-user"></i> Profile
              </MyLink>
              <a
                className="dropdown-item has-icon text-danger c-pointer"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </a>
            </HeaderDropDownMenu>
          </Header>

          <Navbar
            siteIcon="/assets/img/logo.gif"
            siteTitle="Food Jocky"
            siteTitleMini="F..j.."
            layout={layout}
            setLayout={setLayout}
            href="/admin"
          >
            <NavLink
              href="/admin"
              iconClassName="fas fa-tachometer-alt"
              title="Dashboard"
            />
            <NavLink
              href="/admin/categories"
              iconClassName="fas fa-shopping-cart"
              title="Categories"
            />
            <NavLink
              href="/admin/owners"
              iconClassName="fas fa-users"
              title="Restaurant Owners"
            />
            <NavLink
              href="/admin/restaurants"
              iconClassName="fas fa-utensils"
              title="Restaurants"
            />
            <NavLink
              href="/admin/agencies"
              iconClassName="fas fa-bicycle"
              title="Agencies"
            />

            <NavDropDown iconClassName="fas fa-users-cog" title="Agents">
              <NavDropDownLink
                href="/admin/agent/requests"
                title="Agent Requests"
              />
              <NavDropDownLink href="/admin/agent/all" title="All Agents" />
              <NavDropDownLink href="/admin/agent/plans" title="Agent Plans" />
            </NavDropDown>

            <NavLink
              href="/admin/orders"
              iconClassName="fas fa-cubes"
              title="Orders"
            />

            <NavLink
              href="/admin/requests"
              iconClassName="fas fa-wallet"
              title="Requests"
            />

            <NavLink
              href="/admin/plans"
              iconClassName="fas fa-money-check-alt"
              title="Plans"
            />

            <NavLink
              href="/admin/price_criteria"
              iconClassName="fas fa-money-check-alt"
              title="Price Criteria"
            />

            <NavLink
              href="/admin/vouchers"
              iconClassName="fas fa-percent"
              title="Vouchers"
            />

            <NavLink
              href="/admin/voucher_criteria"
              iconClassName="fas fa-percent"
              title="Voucher Criteria"
            />

           <NavLink
              href="/admin/promotional_image"
              iconClassName="fas fa-image"
              title="Promotional Images"
            />

            {/*<NavDropDown iconClassName="fas fa-map-marked-alt" title="Locations" disabled>*/}
            {/*   <NavDropDownLink  href="#!" title="Create New"/>*/}
            {/*   <NavDropDownLink  href="#!" title="Manage Locations"/>*/}
            {/*</NavDropDown>*/}

            {/*<NavDropDown iconClassName="fas fa-certificate" title="Badges" disabled>*/}
            {/*   <NavDropDownLink  href="#!" title="Seller Badges"/>*/}
            {/*</NavDropDown>*/}

            {/*<NavDropDown iconClassName="fas fa-highlighter" title="Featured" disabled>*/}
            {/*   <NavDropDownLink  href="#!" title="Featured Seller"/>*/}
            {/*   <NavDropDownLink  href="#!" title="Manage Featured Seller"/>*/}
            {/*</NavDropDown>*/}

            <NavDropDown iconClassName="fas fa-chart-bar" title="Reports">
              <NavDropDownLink href="/admin/reports" title="Order Reports" />
            </NavDropDown>

            <NavLink
              href="/admin/settings"
              iconClassName="fas fa-cogs"
              title="Settings"
            />
          </Navbar>
        </div>
        <MainContent>
          {props.children}
          <Notification />
        </MainContent>
      </div>
    </>
  );
};

export default AdminLayout;
