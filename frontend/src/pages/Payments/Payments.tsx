import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";

import * as paymentService from "../../services/paymentService";

import type { Payment } from "../../models/payment";

function Payments() {

    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {

        loadPayments();

    }, []);

    async function loadPayments() {

        const data = await paymentService.getPayments();

        setPayments(data);

    }

    return (

        <>

            <PageHeader

                title="Payments"

                subtitle="Payment History"

            />

            <div className="card shadow-sm">

                <table className="table table-hover">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Order</th>

                            <th>Amount</th>

                            <th>Status</th>

                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            payments.map(payment => (

                                <tr key={payment.id}>

                                    <td>{payment.id}</td>

                                    <td>{payment.orderId}</td>

                                    <td>

                                        ₹ {payment.amount}

                                    </td>

                                    <td>

                                        <span className="badge bg-success">

                                            {payment.status}

                                        </span>

                                    </td>

                                    <td>

                                        {payment.createdAt}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </>

    );

}

export default Payments;