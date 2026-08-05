import type { Customer } from "../../models/customer";
import * as customerService from "../../services/customerService";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
interface Props {

    customers: Customer[];

    loading: boolean;

    refresh: () => void;

}

function CustomerTable({
    customers,
    loading,
    refresh,
}: Props) {
    {

        if (loading){

            // return <h5>Loading...</h5>;
            return <Loader/>;
        }
        return (

            <div className="card shadow-sm border-0">

                <div className="table-responsive">

                    <table className="table table-hover mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th style ={{width: "120px"}}>

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                customers.map(customer => (

                                    <tr key={customer.id}>

                                        <td>

                                            {customer.id}

                                        </td>

                                        <td>

                                            {customer.name}

                                        </td>

                                        <td>

                                            {customer.email}

                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={async () => {
                                                    if (!confirm("Delete this customer?")) return;

                                                    try {
                                                        await customerService.deleteCustomer(customer.id);
                                                        refresh();
                                                    } catch (error) {
                                                        console.error(error);
                                                        toast.error("Unable to delete customer.");
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        );

    }
}

    export default CustomerTable;