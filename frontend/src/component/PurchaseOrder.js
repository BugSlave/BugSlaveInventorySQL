import React, { useState, useEffect } from "react";

import {
    fn_show_products,
    fn_show_suppliers,
    fn_add_purchase_order,
    fn_token_decode
} from '../state/action/action';
import { connect } from 'react-redux';

const PurchaseOrderForm = ({
    setProgress, showAlert,
    fn_show_products, getsuppliers,
    fn_show_suppliers, getproducts,
    fn_add_purchase_order
}) => {


    const [formData, setFormData] = useState({
        SupplierId: "",
        ProductId: "",
        PurchaseDate: "",
        Status: "Complete",
        Quantity: "",
        UnitPrice: "",
        TotalCost: 0,
        Amount: 0
    });

    // Set current date automatically
    useEffect(() => {

        setProgress(30);

        setTimeout(() => {

            const today = new Date().toISOString().split("T")[0];
            setFormData((prev) => ({
                ...prev,
                PurchaseDate: today
            }));

            fn_show_suppliers();
            fn_show_products();
            setProgress(100);
        }, 1000)


        // eslint-disable-next-line
    }, []);

    // Auto calculate Total Cost & Amount
    useEffect(() => {
        const total =
            parseFloat(formData.Quantity || 0) *
            parseFloat(formData.UnitPrice || 0);

        setFormData((prev) => ({
            ...prev,
            TotalCost: total,
            Amount: total
        }));
    }, [formData.Quantity, formData.UnitPrice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        const result = await fn_add_purchase_order(
            formData.SupplierId,
            formData.ProductId,
            formData.Quantity,
            formData.UnitPrice
        );
        for (const res of result) {
            if (res.ErrorCode === "0") {
                showAlert('success', res.ErrorName);
                setFormData({
                    SupplierId: "",
                    ProductId: "",
                    PurchaseDate: new Date().toISOString().split("T")[0],
                    Status: "Complete",
                    Quantity: "",
                    UnitPrice: "",
                    TotalCost: 0,
                    Amount: 0
                });
            }
            else {
                showAlert('error', res.ErrorName);
            }
        }

    }



    return (

        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-dark text-white text-center">
                    <h4>Purchase Order Management</h4>
                </div>

                <div className="card-body p-4">
                    {/* Supplier + Product */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Supplier</label>
                            <select
                                className="form-select"
                                name="SupplierId"
                                value={formData.SupplierId}
                                onChange={handleChange}
                                style={{ cursor: "pointer" }}
                            >
                                <option value="">Select Supplier</option>
                                {getsuppliers?.map((supplier, idx) => (
                                    <option key={idx} value={supplier.SupplierId}>
                                        {supplier.SupplierName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Product</label>
                            <select
                                className="form-select"
                                name="ProductId"
                                value={formData.ProductId}
                                onChange={handleChange}
                                style={{ cursor: "pointer" }}
                            >
                                <option value="">Select Product</option>
                                {getproducts?.map((product, idx) => (
                                    <option key={idx} value={product.ProductId}>
                                        {product.ProductName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date + Status */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Purchase Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="PurchaseDate"
                                value={formData.PurchaseDate}
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Status</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                name="Status"
                                value={formData.Status}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Quantity + Unit Price */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                name="Quantity"
                                value={formData.Quantity}
                                onChange={handleChange}
                                placeholder="Enter Quantity"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Unit Price</label>
                            <input
                                type="number"
                                className="form-control"
                                name="UnitPrice"
                                value={formData.UnitPrice}
                                onChange={handleChange}
                                placeholder="Enter Unit Price"
                            />
                        </div>
                    </div>

                    {/* Total Cost + Amount */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Total Cost</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                name="TotalCost"
                                value={formData.TotalCost}
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Amount</label>
                            <input
                                type="number"
                                className="form-control bg-light"
                                name="Amount"
                                value={formData.Amount}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="button" className="btn btn-success px-5 shadow" onClick={handleSubmit}>
                            Create Purchase Order
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    getproducts: state.getproducts,
    getsuppliers: state.getsuppliers,
    error: state.error
})

const mapDispatchToProps = {
    fn_show_products,
    fn_show_suppliers,
    fn_add_purchase_order,
    fn_token_decode
}


export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderForm)