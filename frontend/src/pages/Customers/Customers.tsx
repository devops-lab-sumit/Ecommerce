import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";

import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";

import type { Customer } from "../../models/customer";

import * as customerService from "../../services/customerService";

function Customers() {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    async function loadCustomers() {

        try {

            const data = await customerService.getCustomers();

            setCustomers(data);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadCustomers();

    }, []);

    return (

        <>

            <PageHeader
                title="Customers"
                subtitle="Manage customer information"
            />

            <div className="d-flex justify-content-end mb-3">

                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >

                    Add Customer

                </button>

            </div>

            <CustomerTable

                customers={customers}

                loading={loading}

                refresh={loadCustomers}

            />

            <CustomerForm

                show={showModal}

                close={() => setShowModal(false)}

                refresh={loadCustomers}

            />

        </>

    );

}

export default Customers;