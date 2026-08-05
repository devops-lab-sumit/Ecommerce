import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Payments from "./pages/Payments/Payments";
import Notifications from "./pages/Notifications/Notifications";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";

import { ROUTES } from "./constants/routes";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />

                <Route
                    path={ROUTES.CUSTOMERS.substring(1)}
                    element={<Customers />}
                />

                <Route
                    path={ROUTES.PRODUCTS.substring(1)}
                    element={<Products />}
                />

                <Route
                    path={ROUTES.ORDERS.substring(1)}
                    element={<Orders />}
                />

                <Route
                    path={ROUTES.PAYMENTS.substring(1)}
                    element={<Payments />}
                />

                <Route
                    path={ROUTES.NOTIFICATIONS.substring(1)}
                    element={<Notifications />}
                />

                <Route
                    path={ROUTES.PLACE_ORDER.substring(1)}
                    element={<PlaceOrder />}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}

export default App;