import type { Product } from "../../models/product";
import Loader from "../../components/Loader/Loader";
interface Props {
    products: Product[];
    loading: boolean;
    refresh: () => void;
    deleteProduct: (id: number) => void;
}

function ProductTable({

    products,

    loading,

    deleteProduct

}: Props) {

    if (loading) {
        return <Loader />;
    }

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

                            <th style ={{width: "120px"}}>

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

                                        {product.stock}

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteProduct(product.id)}
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