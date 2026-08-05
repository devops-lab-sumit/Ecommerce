import SectionCard from "../common/SectionCard";

function RecentOrders() {

    const orders = [

        {
            id: 101,
            customer: "John Doe",
            product: "iPhone 16",
            amount: "₹90,000",
            status: "Completed"
        },

        {
            id: 102,
            customer: "Rahul",
            product: "MacBook Pro",
            amount: "₹2,20,000",
            status: "Pending"
        },

        {
            id: 103,
            customer: "Alex",
            product: "AirPods",
            amount: "₹25,000",
            status: "Completed"
        }

    ];

    return (

        <SectionCard title="Recent Orders">

            <table className="table table-hover">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Customer</th>

                        <th>Product</th>

                        <th>Amount</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        orders.map(order => (

                            <tr key={order.id}>

                                <td>{order.id}</td>

                                <td>{order.customer}</td>

                                <td>{order.product}</td>

                                <td>{order.amount}</td>

                                <td>

                                    <span
                                        className={`badge ${
                                            order.status === "Completed"
                                                ? "bg-success"
                                                : "bg-warning text-dark"
                                        }`}>

                                        {order.status}

                                    </span>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </SectionCard>

    );

}

export default RecentOrders;