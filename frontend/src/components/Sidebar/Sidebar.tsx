import { NavLink } from "react-router-dom";

import {

    FaHome,

    FaUsers,

    FaBox,

    FaShoppingCart,

    FaCreditCard,

    FaBell,

    FaPlusCircle

} from "react-icons/fa";

import { ROUTES } from "../../constants/routes";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="p-3">

                <h6 className="text-secondary">

                    MENU

                </h6>

                <div className="list-group">

                    <NavLink
                        to={ROUTES.DASHBOARD}
                        className="list-group-item list-group-item-action">

                        <FaHome className="me-2"/>

                        Dashboard

                    </NavLink>

                    <NavLink
                        to={ROUTES.CUSTOMERS}
                        className="list-group-item list-group-item-action">

                        <FaUsers className="me-2"/>

                        Customers

                    </NavLink>

                    <NavLink
                        to={ROUTES.PRODUCTS}
                        className="list-group-item list-group-item-action">

                        <FaBox className="me-2"/>

                        Products

                    </NavLink>

                    <NavLink
                        to={ROUTES.ORDERS}
                        className="list-group-item list-group-item-action">

                        <FaShoppingCart className="me-2"/>

                        Orders

                    </NavLink>

                    <NavLink
                        to={ROUTES.PAYMENTS}
                        className="list-group-item list-group-item-action">

                        <FaCreditCard className="me-2"/>

                        Payments

                    </NavLink>

                    <NavLink
                        to={ROUTES.NOTIFICATIONS}
                        className="list-group-item list-group-item-action">

                        <FaBell className="me-2"/>

                        Notifications

                    </NavLink>

                    <NavLink
                        to={ROUTES.PLACE_ORDER}
                        className="list-group-item list-group-item-action">

                        <FaPlusCircle className="me-2"/>

                        Place Order

                    </NavLink>

                </div>

            </div>

        </aside>

    );

}

export default Sidebar;