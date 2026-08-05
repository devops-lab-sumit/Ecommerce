import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";

import * as orderService from "../../services/orderService";

import type { Order } from "../../models/order";

function Orders() {

    const [orders, setOrders] = useState<Order[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadOrders();

    }, []);

    async function loadOrders() {

        try {

            const data = await orderService.getOrders();

            setOrders(data);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <>

            <PageHeader

                title="Orders"

                subtitle="Customer Order History"

            />

            <div className="card shadow-sm">

                <div className="table-responsive">

                    <table className="table table-hover">

                        <thead className="table-light">

                            <tr>

                                <th>ID</th>

                                <th>Customer</th>

                                <th>Product</th>

                                <th>Quantity</th>

                                <th>Amount</th>

                                <th>Status</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                loading

                                    ?

                                    <tr>

                                        <td colSpan={7}>

                                            Loading...

                                        </td>

                                    </tr>

                                    :

                                    orders.map(order => (

                                        <tr key={order.id}>

                                            <td>{order.id}</td>

                                            <td>{order.customerId}</td>

                                            <td>{order.productId}</td>

                                            <td>{order.quantity}</td>

                                            <td>

                                                ₹ {order.amount}

                                            </td>

                                            <td>

                                                <span className="badge bg-success">

                                                    {order.status}

                                                </span>

                                            </td>

                                            <td>

                                                {order.createdAt}

                                            </td>

                                        </tr>

                                    ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}

export default Orders;