import { useEffect, useState } from "react";
import type { Product } from "../../models/product";

interface Props {
    product?: Product;
    onSave(product: Product): void;
    onClose(): void;
}

export default function ProductForm({
    product,
    onSave,
    onClose
}: Props) {

    const [form, setForm] = useState<Product>({
        id: 0,
        name: "",
        description: "",
        price: 0,
        stock: 0
    });

    useEffect(() => {
        if (product)
            setForm(product);
    }, [product]);

    function update(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        setForm({
            ...form,
            [e.target.name]:
                e.target.name === "price" ||
                e.target.name === "stock"
                    ? Number(e.target.value)
                    : e.target.value
        });
    }

    return (

        <div className="modal d-block">

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5>

                            {form.id === 0
                                ? "Add Product"
                                : "Edit Product"}

                        </h5>

                    </div>

                    <div className="modal-body">

                        <input
                            className="form-control mb-3"
                            placeholder="Name"
                            name="name"
                            value={form.name}
                            onChange={update}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Description"
                            name="description"
                            value={form.description}
                            onChange={update}
                        />

                        <input
                            type="number"
                            className="form-control mb-3"
                            placeholder="Price"
                            name="price"
                            value={form.price}
                            onChange={update}
                        />

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Stock"
                            name="stock"
                            value={form.stock}
                            onChange={update}
                        />

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => onSave(form)}
                        >
                            Save
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}