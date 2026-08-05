import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import { toast } from "react-toastify";
import * as customerService from "../../services/customerService";
import * as inventoryService from "../../services/inventoryService";
import * as orderService from "../../services/orderService";

import type { Customer } from "../../models/customer";
import type { Product } from "../../models/product";

function PlaceOrder() {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [products, setProducts] = useState<Product[]>([]);

    const [customerId, setCustomerId] = useState("");

    const [productId, setProductId] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [amount, setAmount] = useState(0);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        loadData();

    }, []);

    async function loadData() {

        try {

            const customerResponse = await customerService.getCustomers();
            console.log("Customers:", customerResponse);

            const productResponse = await inventoryService.getProducts();
             console.log("Products:", productResponse);
            setCustomers(customerResponse);

            setProducts(productResponse);

        }
        catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        if (!productId)
            return;

        const product = products.find(

            x => x.id === Number(productId)

        );

        if (product) {

            setAmount(product.price * quantity);

        }

    }, [productId, quantity, products]);

    async function placeOrder() {

        try {

            setLoading(true);

            await orderService.createOrder({

                customerId: Number(customerId),

                productId: Number(productId),

                quantity,

                amount

            });

            toast.success("Order Created Successfully");

            setCustomerId("");

            setProductId("");

            setQuantity(1);

            setAmount(0);

        }
        catch (error) {

            console.error(error);

            toast.error("Unable to create order");

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <>

            <PageHeader

                title="Place Order"

                subtitle="Create new customer order"

            />

            <div className="card shadow-sm">

                <div className="card-body">

                    <div className="mb-3">

                        <label className="form-label">

                            Customer

                        </label>

                        <select

                            className="form-select"

                            value={customerId}

                            onChange={e =>

                                setCustomerId(e.target.value)

                            }

                        >

                            <option value="">

                                Select Customer

                            </option>

                            {

                                customers.map(customer => (

                                    <option

                                        key={customer.id}

                                        value={customer.id}

                                    >

                                        {customer.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Product

                        </label>

                        <select

                            className="form-select"

                            value={productId}

                            onChange={e =>

                                setProductId(e.target.value)

                            }

                        >

                            <option value="">

                                Select Product

                            </option>

                            {

                                products.map(product => (

                                    <option

                                        key={product.id}

                                        value={product.id}

                                    >

                                        {product.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="mb-3">

                        <label>

                            Quantity

                        </label>

                        <input

                            type="number"

                            className="form-control"

                            value={quantity}

                            onChange={e =>

                                setQuantity(

                                    Number(e.target.value)

                                )

                            }

                        />

                    </div>

                    <div className="mb-3">

                        <label>

                            Amount

                        </label>

                        <input

                            className="form-control"

                            value={amount}

                            readOnly

                        />

                    </div>

                    <button

                        className="btn btn-primary"

                        disabled={loading}

                        onClick={placeOrder}

                    >

                        {

                            loading

                                ? "Creating..."

                                : "Place Order"

                        }

                    </button>

                </div>

            </div>

        </>

    );

}

export default PlaceOrder;