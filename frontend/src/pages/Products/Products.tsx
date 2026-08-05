import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";

import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";

import type { Product } from "../../models/product";

import * as inventoryService from "../../services/inventoryService";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    // const[delete, setDelete] = useState(true);

    const [showModal, setShowModal] = useState(false);

    async function loadProducts() {
        try {
            const data = await inventoryService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProduct(id: number) {

    if (!window.confirm("Delete this product?"))
        return;

    try {

        await inventoryService.deleteProduct(id);

        loadProducts();

    } catch (error) {

        console.error(error);

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
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    Add Product
                </button>
            </div>

            <ProductTable
                products={products}
                loading={loading}
                refresh={loadProducts}
                deleteProduct={deleteProduct}
            />

            {showModal && (
                <ProductForm
                    show={showModal}
                    close={() => setShowModal(false)}
                    refresh={() => {
                        loadProducts();
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
}

export default Products;