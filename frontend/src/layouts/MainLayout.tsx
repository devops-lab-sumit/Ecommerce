import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";

import "../styles/layout.css";

function MainLayout() {

    return (

        <div className="layout">

            <Navbar />

            <div className="layout-body">

                <Sidebar />

                <main className="content">

                    <Outlet />

                </main>

            </div>

            <Footer />

        </div>

    );

}

export default MainLayout;