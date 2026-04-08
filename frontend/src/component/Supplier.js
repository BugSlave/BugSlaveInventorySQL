
import React, { useEffect, useState } from "react";
import {
    fn_add_supplier,
    fn_show_suppliers,
    fn_update_supplier,
    fn_token_decode
} from '../state/action/action';
import { connect } from 'react-redux';

const SupplierForm = ({
    setProgress,
    showAlert,
    fn_add_supplier,
    fn_show_suppliers,
    getsuppliers,
    fn_update_supplier
}) => {

    const [supplier, setSupplier] = useState({
        SupplierName: "",
        ContactName: "",
        Phone: "",
        Email: "",
        Addresses: "",
        SupplierId: ""
    });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        setProgress(30);

        setTimeout(() => {
            setProgress(100);
        }, 500);

        // eslint-disable-next-line

    }, [setProgress]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setSupplier({
            ...supplier,
            [name]: value
        });
    };

    const handleAdd = () => {

        setSupplier({
            SupplierName: "",
            ContactName: "",
            Phone: "",
            Email: "",
            Addresses: "",
            SupplierId: ""
        });
    };

    const handleFind = async () => {

        try {

            await fn_show_suppliers();
            setShowModal(true);

        } catch (error) {

            console.error(error);
            showAlert('error', 'Error fetching suppliers');

        }
    };

    const handleRowSelect = (sup) => {
        setSupplier({
            SupplierName: sup.SupplierName,
            ContactName: sup.ContactName,
            Phone: sup.Phone,
            Email: sup.Email,
            Addresses: sup.Addresses,
            SupplierId: sup.SupplierId
        });

        setShowModal(false);
    };

    const handleSubmit = async () => {
        try {
            const { SupplierName, ContactName, Phone, Email, Addresses } = supplier;
            if (!SupplierName || !ContactName || !Phone || !Email || !Addresses) {

                showAlert('warning', 'Please fill in all fields');
                return;
            }
            const result = await fn_add_supplier(
                SupplierName,
                ContactName,
                Phone,
                Email,
                Addresses
            );
            for (const res of result) {

                if (res.ErrorCode === "0") {

                    showAlert('success', res.ErrorName);
                    handleAdd();

                } else {

                    showAlert('error', res.ErrorName);

                }
            }

        } catch (error) {
            throw error;

        }
    };

    const handleUpdateSupplier = async () => {

        try {

            const { SupplierName, ContactName, Phone, Email, Addresses, SupplierId } = supplier;

            const result = await fn_update_supplier(
                SupplierName,
                ContactName,
                Phone,
                Email,
                Addresses,
                SupplierId
            );

            for (const res of result) {

                if (res.ErrorCode === "0") {

                    showAlert('success', res.ErrorName);
                    handleAdd();

                } else {

                    showAlert('error', res.ErrorName);

                }
            }

        } catch (error) {

            console.error(error);

        }
    };

    return (

        <div className="container mt-4">

            <div className="card shadow-lg border-0">

                {/* HEADER */}

                <div className="card-header text-white"
                    style={{ background: "linear-gradient(45deg,#0d6efd,#0dcaf0)" }}
                >
                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">
                            Supplier Management
                        </h5>

                        <div>

                            <button
                                className="btn btn-light btn-sm me-2"
                                onClick={handleFind}
                            >
                                🔍 Find
                            </button>

                            <button
                                className="btn btn-warning btn-sm"
                                onClick={handleAdd}
                            >
                                ➕ New
                            </button>

                        </div>

                    </div>
                </div>

                {/* FORM */}

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Supplier Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="SupplierName"
                                value={supplier.SupplierName}
                                onChange={handleChange}
                                placeholder="Enter supplier name"
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Contact Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="ContactName"
                                value={supplier.ContactName}
                                onChange={handleChange}
                                placeholder="Enter contact person"
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Phone
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="Phone"
                                value={supplier.Phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                name="Email"
                                value={supplier.Email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />

                        </div>

                        <div className="col-12">

                            <label className="form-label fw-semibold">
                                Address
                            </label>

                            <textarea
                                className="form-control"
                                name="Addresses"
                                rows="2"
                                value={supplier.Addresses}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />

                        </div>

                    </div>

                    {/* BUTTON */}

                    <div className="text-center mt-4">

                        <button
                            className={`btn px-5 ${supplier.SupplierId ? "btn-warning" : "btn-success"}`}
                            onClick={supplier.SupplierId ? handleUpdateSupplier : handleSubmit}
                        >
                            {supplier.SupplierId ? "Update Supplier" : "Add Supplier"}
                        </button>

                    </div>

                </div>

            </div>


            {/* MODAL */}

            {showModal && (

                <div className="modal fade show d-block">

                    <div className="modal-dialog modal-xl">

                        <div className="modal-content shadow">

                            <div className="modal-header bg-dark text-white">

                                <h5 className="modal-title">
                                    Supplier List
                                </h5>

                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>

                            </div>

                            <div className="modal-body">

                                <div className="table-responsive">

                                    <table className="table table-hover table-bordered">

                                        <thead className="table-dark">

                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Contact</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {getsuppliers?.map((sup, index) => (

                                                <tr
                                                    key={index}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleRowSelect(sup)}
                                                >

                                                    <td>{sup.SupplierId}</td>
                                                    <td>{sup.SupplierName}</td>
                                                    <td>{sup.ContactName}</td>
                                                    <td>{sup.Phone}</td>
                                                    <td>{sup.Email}</td>
                                                    <td>{sup.Addresses}</td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
};

const mapStateToProps = (state) => ({
    getsuppliers: state.getsuppliers,
    error: state.error
});

const mapDispatchToProps = {
    fn_add_supplier,
    fn_show_suppliers,
    fn_update_supplier,
    fn_token_decode
};

export default connect(mapStateToProps, mapDispatchToProps)(SupplierForm);