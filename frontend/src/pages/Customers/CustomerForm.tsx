import { useState } from "react";
import * as customerService from "../../services/customerService";
import { toast } from "react-toastify";

interface Props {
    show: boolean;
    close: () => void;
    refresh: () => void;
}

function CustomerForm({ show, close, refresh }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);

    if (!show) return null;

    async function saveCustomer(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Customer name is required.");
            return;
        }

        if (!email.trim()) {
            toast.error("Email is required.");
            return;
        }

        try {
            setSaving(true);

            await customerService.createCustomer({
                name,
                email,
            });

            setName("");
            setEmail("");

            close();
            refresh();
        } catch (error) {
            console.error(error);
            toast.error("Unable to create customer.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <div
                className="modal fade show"
                style={{
                    display: "block",
                    background: "rgba(0,0,0,.5)",
                }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <form onSubmit={saveCustomer}>

                            <div className="modal-header">

                                <h5>Add Customer</h5>

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

                                        Email

                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
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
                                    {saving ? "Saving..." : "Save Customer"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default CustomerForm;