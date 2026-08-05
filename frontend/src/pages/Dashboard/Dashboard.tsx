import {
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaCreditCard,
} from "react-icons/fa";

import StatisticCard from "../../components/dashboard/StatisticCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentOrders from "../../components/dashboard/RecentOrders";
import PageHeader from "../../components/common/PageHeader";

function Dashboard() {

    return (

        <>

            <PageHeader
                title="Dashboard"
                subtitle="Welcome back, Administrator"
            />

            <div className="row">

                <StatisticCard
                    title="Customers"
                    value={120}
                    icon={<FaUsers />}
                    color="#0d6efd"
                />

                <StatisticCard
                    title="Products"
                    value={45}
                    icon={<FaBox />}
                    color="#20c997"
                />

                <StatisticCard
                    title="Orders"
                    value={87}
                    icon={<FaShoppingCart />}
                    color="#fd7e14"
                />

                <StatisticCard
                    title="Payments"
                    value={58}
                    icon={<FaCreditCard />}
                    color="#6f42c1"
                />

            </div>

            <div className="row mt-4">

                <div className="col-lg-8">

                    <RecentOrders />

                </div>

                <div className="col-lg-4">

                    <QuickActions />

                </div>

            </div>

        </>

    );

}

export default Dashboard;