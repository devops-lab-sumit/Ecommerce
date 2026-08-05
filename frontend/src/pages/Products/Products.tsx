import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";

import ProductTable from "./ProductTable";

import type { Product } from "../../models/product";

import * as inventoryService from "../../services/inventoryService";

function Products() {

    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);

    async function loadProducts() {

        try {

            const data = await inventoryService.getProducts();

            setProducts(data);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadProducts();

    }, []);

    return (

        <>

            <PageHeader

                title="Products"

                subtitle="Manage product inventory"

            />

            <div className="d-flex justify-content-end mb-3">

                <button className="btn btn-primary">

                    Add Product

                </button>

            </div>

            <ProductTable

                products={products}

                loading={loading}

                refresh={loadProducts}

            />

        </>

    );

}

export default Products;