import { useState } from "react";
import { toast } from "react-toastify";

import * as inventoryService from "../../services/inventoryService";

interface Props {
    show: boolean;
    close: () => void;
    refresh: () => void;
}

function ProductForm({
    show,
    close,
    refresh,
}: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);

    const [saving, setSaving] = useState(false);

    if (!show) return null;

    async function saveProduct(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Product name is required.");
            return;
        }

        if (price <= 0) {
            toast.error("Price must be greater than zero.");
            return;
        }

        if (stock < 0) {
            toast.error("Invalid stock.");
            return;
        }

        try {
            setSaving(true);

            await inventoryService.createProduct({
                name,
                description,
                price,
                stock,
            });

            setName("");
            setDescription("");
            setPrice(0);
            setStock(0);

            close();
            refresh();
        } catch (error) {
            console.error(error);
            toast.error("Unable to create product.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                background: "rgba(0,0,0,.5)",
            }}
        >
            <div className="modal-dialog">
                <div className="modal-content">

                    <form onSubmit={saveProduct}>

                        <div className="modal-header">

                            <h5>Add Product</h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={close}
                            />

                        </div>

                        <div className="modal-body">

                            <div className="mb-3">

                                <label className="form-label">
                                    Name
                                </label>

                                <input
                                    className="form-control"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Description
                                </label>

                                <input
                                    className="form-control"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(Number(e.target.value))
                                    }
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={stock}
                                    onChange={(e) =>
                                        setStock(Number(e.target.value))
                                    }
                                />

                            </div>

                        </div>

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={close}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Product"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default ProductForm;