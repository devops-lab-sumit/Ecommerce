import type { Product } from "../../models/product";

interface Props {

    products: Product[];

    loading: boolean;

    refresh: () => void;

}

function ProductTable({

    products,

    loading

}: Props) {

    if (loading)

        return <h5>Loading...</h5>;

    return (

        <div className="card shadow-sm border-0">

            <div className="table-responsive">

                <table className="table table-hover mb-0">

                    <thead className="table-light">

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Price</th>

                            <th>Stock</th>

                            <th width="120">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            products.map(product => (

                                <tr key={product.id}>

                                    <td>{product.id}</td>

                                    <td>{product.name}</td>

                                    <td>

                                        ₹ {product.price.toLocaleString()}

                                    </td>

                                    <td>

                                        {product.quantity}

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-danger btn-sm"
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

export default ProductTable;