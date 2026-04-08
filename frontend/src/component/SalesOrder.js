
import React, { useState, useEffect, useRef, useCallback } from "react";

import {
    fn_show_products,
    fn_show_customers,
    fn_add_sales_order,
    fn_show_sales_order,
    fn_show_batch_detail
} from '../state/action/action';

import { connect } from 'react-redux';

const SalesOrderForm = ({
    setProgress,
    showAlert,
    fn_show_products,
    getcustomers,
    fn_show_customers,
    getproducts,
    fn_add_sales_order,
    fn_show_sales_order,
    getsalesorder,
    fn_show_batch_detail
}) => {

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        SalesOrderId: "",
        CustomerId: "",
        ProductId: "",
        SalesDate: "",
        Status: "Complete",
        Quantity: "",
        UnitPrice: "",
        TotalCost: 0,
        Amount: 0,
        InStock: 0,
        LastPurchasePrice: 0
    });

    useEffect(() => {

        setProgress(30);

        setTimeout(() => {

            const today = new Date().toISOString().split("T")[0];

            setFormData((prev) => ({
                ...prev,
                SalesDate: today
            }));

            fn_show_customers()
            fn_show_products()

            setProgress(100);

        }, 800);

        // eslint-disable-next-line
    }, []);

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

    const [quantityError, setQuantityError] = useState('');

    const [docTypeMode, setDocTypeMode] = useState("0")

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });


        if (name === 'Quantity') {
            const qty = parseFloat(value) || 0;
            const stock = parseFloat(formData.InStock) || 0;
            if (qty > stock) {
                setQuantityError('Quantity cannot exceed in-stock quantity');
            } else {
                setQuantityError('');
            }
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await fn_add_sales_order(
            formData.CustomerId,
            formData.ProductId,
            formData.Quantity,
            formData.UnitPrice,
            formData.BatchName,
            formData.InStock,
            formData.LastPurchasePrice
        );

        console.log(formData.CustomerId,
            formData.ProductId,
            formData.Quantity,
            formData.UnitPrice,
            formData.BatchName,
            formData.InStock,
            formData.LastPurchasePrice)

        for (const res of result) {

            if (res.ErrorCode === "0") {

                showAlert('success', res.ErrorName);
                handleAddMode();

            } else {

                showAlert('error', res.ErrorName);

            }
        }
    };

    const handleFind = async () => {
        await fn_show_sales_order();
        setDocTypeMode(1)
        setShowModal(true);
    };

    const handleRowClick = async (po) => {
        setFormData({
            CustomerId: po.CustomerId,
            ProductId: po.ProductId,
            SalesDate: po.SalesDate,
            Status: "Complete",
            Quantity: po.Quantity,
            UnitPrice: po.UnitPrice,
            TotalCost: po.TotalCost,
            Amount: po.TotalCost,
            SalesOrderId: po.DocumentId
        });

        const result = await fn_show_batch_detail(po.ProductId, null, po.DocumentId, 'SO')
        setFormData(prev => ({
            ...prev,
            BatchName: result[0]?.BatchName,
            InStock: result[0]?.RemainingQty,
            LastPurchasePrice: result[0]?.UnitPrice
        }));
        setShowModal(false);
    };

    const handleAddMode = () => {

        const today = new Date().toISOString().split("T")[0];

        setFormData({
            SalesOrderId: "",
            CustomerId: "",
            ProductId: "",
            SalesDate: today,
            Status: "Complete",
            Quantity: "",
            UnitPrice: "",
            TotalCost: 0,
            Amount: 0,
            InStock: 0,
            LastPurchasePrice: 0,
            BatchName: "",
            DocumentId: ""

        });

        setDocTypeMode("0")
    };

    const handleNothingMode = () => {
        showAlert('info', 'kyu click kr rhe ho bhai !!!')
    }

    const ref = useRef(null)

    const handleShowChooseFromList = async () => {
        try {
            await fn_show_customers();
            await fn_show_products();
        } catch (error) {
            throw error.message;
        }
    }

    const handleRowSelect = async (rowData) => {
        const customerId = rowData.CustomerId;

        // 1️⃣ Set textbox value
        setFormData(prev => ({
            ...prev,
            CustomerId: customerId
        }));

        ref.current.click();
    };

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const filteredSuppliers = getcustomers?.filter((customer) => {
        if (!searchTerm) return true; // empty search => sab dikhao
        const term = searchTerm.toLowerCase();
        return (
            customer.CustomerId?.toString().toLowerCase().includes(term) ||
            customer.CustomerName?.toLowerCase().includes(term)
        );
    });


    // Product Row Select
    const refProduct = useRef(null)
    const refBatch = useRef(null)

    const [batchDetails, setBatchDetails] = useState([])

    const handleRowSelectProducts = async (rowData) => {
        const productId = rowData.ProductId;

        const result = await fn_show_batch_detail(productId, null, null, 'PO')

        // 1️⃣ Set textbox value
        setFormData(prev => ({
            ...prev,
            ProductId: productId,
            BatchName: result[0]?.BatchName,
            InStock: result[0]?.RemainingQty,
            LastPurchasePrice: result[0]?.UnitPrice
        }));


        setBatchDetails(result)

        refProduct.current.click();
    };

    const [searchTermProducts, setSearchTermProducts] = useState("");

    const handleSearchChangeProducts = useCallback((e) => {
        setSearchTermProducts(e.target.value);
    }, []);

    const filteredProducts = getproducts?.filter((product) => {
        if (!searchTermProducts) return true; // empty search => sab dikhao
        const term = searchTermProducts.toLowerCase();
        return (
            product.ProductId?.toString().toLowerCase().includes(term) ||
            product.ProductName?.toLowerCase().includes(term)
        );
    });

    // Batch Wise Selection
    const handleRowSelectBatches = async (rowData) => {

        // 1️⃣ Set textbox value
        setFormData(prev => ({
            ...prev,
            BatchName: rowData.BatchName,
            InStock: rowData.RemainingQty,
            LastPurchasePrice: rowData.UnitPrice
        }));

        refBatch.current.click();
    };


    return (
        <div className="mt-2">
            <div className="card card-premium">

                {/* HEADER */}
                <div className="card-header header-gradient text-white d-flex justify-content-between align-items-center px-4 py-3">
                    <div>
                        <h5 className="mb-0 fw-semibold">Sales Order</h5>
                        <small className="opacity-75">Manage transactions efficiently</small>
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm px-3" onClick={handleFind}>
                            🔍 Find
                        </button>
                        <button className="btn btn-dark btn-sm px-3" onClick={handleAddMode}>
                            + New
                        </button>
                    </div>
                </div>

                <div className="card-body p-4">

                    {/* ORDER INFO */}
                    <div className="section-box mb-3">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small text-muted">Document ID</label>
                                <input
                                    className="form-control input-clean bg-light"
                                    value={formData.SalesOrderId || ""}
                                    readOnly
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted">Sale Date</label>
                                <input
                                    type="date"
                                    className="form-control input-clean bg-light"
                                    value={formData.SalesDate || ""}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* CUSTOMER + PRODUCT */}
                    <div className="section-box mb-3">
                        <div className="row g-3">

                            {/* CUSTOMER */}
                            <div className="col-md-6">
                                <label className="form-label small text-muted">Customer</label>

                                <div className="position-relative">
                                    <select
                                        className="form-select input-clean pe-5"
                                        name="CustomerId"
                                        value={formData.CustomerId}
                                        onChange={handleChange}
                                        disabled
                                    >
                                        <option>Select Customer</option>
                                        {getcustomers?.map(c => (
                                            <option key={c.CustomerId} value={c.CustomerId}>
                                                {c.CustomerName}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="btn-icon position-absolute top-50 end-0 translate-middle-y me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#ChooseFromList"
                                        onClick={handleShowChooseFromList}
                                        disabled={docTypeMode === 1}
                                    >
                                        <i className="bi bi-list"></i>
                                    </button>
                                </div>
                            </div>

                            {/* PRODUCT */}
                            <div className="col-md-6">
                                <label className="form-label small text-muted">Product</label>

                                <div className="position-relative">
                                    <select
                                        className="form-select input-clean pe-5"
                                        name="ProductId"
                                        value={formData.ProductId}
                                        onChange={handleChange}
                                        disabled
                                    >
                                        <option>Select Product</option>
                                        {getproducts?.map(p => (
                                            <option key={p.ProductId} value={p.ProductId}>
                                                {p.ProductName}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="btn-icon position-absolute top-50 end-0 translate-middle-y me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#ProductList"
                                        onClick={handleShowChooseFromList}
                                        disabled={docTypeMode === 1}
                                    >
                                        <i className="bi bi-box"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* INVENTORY */}
                    <div className="section-box mb-3">
                        <div className="row g-3">

                            {/* BATCH */}
                            <div className="col-md-4">
                                <label className="form-label small text-muted">Batch</label>

                                <div className="position-relative">
                                    <input
                                        className="form-control input-clean bg-light pe-5"
                                        value={formData.BatchName || ""}
                                        readOnly
                                    />

                                    <button
                                        className="btn-icon position-absolute top-50 end-0 translate-middle-y me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#BatchDetails"
                                        disabled={docTypeMode === 1}
                                    >
                                        <i className="bi bi-grid"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">In Stock</label>
                                <input
                                    className="form-control input-clean bg-light"
                                    value={formData.InStock || ""}
                                    readOnly
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Status</label>
                                <input className="form-control input-clean bg-light"
                                    value={formData.Status || ""} readOnly />
                            </div>



                        </div>

                        {quantityError && (
                            <div className="text-danger small mt-2 fw-semibold">
                                {quantityError}
                            </div>
                        )}
                    </div>

                    {/* PRICING */}
                    <div className="section-box mb-3">
                        <div className="row g-3">

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control input-clean"
                                    name="Quantity"
                                    value={formData.Quantity}
                                    onChange={handleChange}
                                    readOnly={docTypeMode === 1}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Unit Price</label>
                                <input
                                    type="number"
                                    className="form-control input-clean"
                                    name="UnitPrice"
                                    value={formData.UnitPrice}
                                    onChange={handleChange}
                                    readOnly={docTypeMode === 1}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Total Cost</label>
                                <input
                                    className="form-control input-clean bg-light fw-semibold"
                                    value={formData.TotalCost}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="section-box mb-3">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small text-muted">Amount</label>
                                <input
                                    className="form-control input-clean bg-light fw-semibold"
                                    value={formData.Amount}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    {/* ACTION */}
                    <div className="text-end mt-4">
                        <button
                            className="btn px-4 py-2 fw-semibold"
                            style={{
                                background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                                color: "#fff",
                                borderRadius: "10px"
                            }}
                            onClick={formData.SalesOrderId ? handleNothingMode : handleSubmit}
                            disabled={quantityError !== ''}
                        >
                            {formData.SalesOrderId ? "Done" : "Create Order"}
                        </button>
                    </div>

                </div>
            </div>
            {/* FIND MODAL */}

            {showModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content modal-premium">

                            <div className="modal-header modal-header-premium">
                                <h5 className="modal-title modal-title-premium">Find Sales Order</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                            </div>

                            <div className="modal-body modal-body-premium">

                                <div className="table-responsive table-premium table-bordered">
                                    <table className="table mb-0 align-middle">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Customer</th>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {getsalesorder?.map((row, i) => (
                                                <tr key={i} onClick={() => handleRowClick(row)} role="button">
                                                    <td>{row.DocumentId}</td>
                                                    <td>{row.CustomerName}</td>
                                                    <td>{row.ProductName}</td>
                                                    <td>{row.Quantity}</td>
                                                    <td>{row.UnitPrice}</td>
                                                    <td className="fw-bold text-success">{row.TotalCost}</td>
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


            <button ref={ref} type="button" className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#ChooseFromList">
                Launch demo modal
            </button>

            <div className="modal fade" id="ChooseFromList">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-premium">

                        <div className="modal-header modal-header-premium d-flex justify-content-between">
                            <h6 className="modal-title-premium m-0">Customer List</h6>

                            <input
                                type="text"
                                className="search-box"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="modal-body modal-body-premium">

                            <div className="table-responsive table-premium table-bordered">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Customer ID</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredSuppliers?.map((s, i) => (
                                            <tr key={i} onClick={() => handleRowSelect(s)} role="button">
                                                <td>{s.CustomerId}</td>
                                                <td>{s.CustomerName}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

                        </div>

                        <div className="modal-footer modal-footer-premium">
                            <button className="btn btn-light" data-bs-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>


            <button ref={refProduct} type="button" className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#ProductList">
                Launch demo modal
            </button>

            <div className="modal fade" id="ProductList">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-premium">

                        <div className="modal-header modal-header-premium d-flex justify-content-between">
                            <h6 className="modal-title-premium m-0">Product List</h6>

                            <input
                                type="text"
                                className="search-box"
                                placeholder="Search..."
                                value={searchTermProducts}
                                onChange={handleSearchChangeProducts}
                            />
                        </div>

                        <div className="modal-body modal-body-premium">

                            <div className="table-responsive table-premium table-bordered">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Product ID</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredProducts?.map((p, i) => (
                                            <tr key={i} onClick={() => handleRowSelectProducts(p)} role="button">
                                                <td>{p.ProductId}</td>
                                                <td>{p.ProductName}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

                        </div>

                        <div className="modal-footer modal-footer-premium">
                            <button className="btn btn-light" data-bs-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>


            {/* Batch Details Modal */}
            <button ref={refBatch} type="button" className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#BatchDetails">
                Launch demo modal
            </button>

            <div className="modal fade" id="BatchDetails">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content modal-premium">

                        <div className="modal-header modal-header-premium d-flex justify-content-between">
                            <h6 className="modal-title-premium m-0">Batch Details</h6>

                            <input
                                type="text"
                                className="search-box"
                                placeholder="Search..."
                                value={searchTermProducts}
                                onChange={handleSearchChangeProducts}
                            />
                        </div>

                        <div className="modal-body modal-body-premium">

                            <div className="table-responsive table-premium">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Batch ID</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {batchDetails?.map((b, i) => (
                                            <tr key={i} onClick={() => handleRowSelectBatches(b)}>
                                                <td>{b.Id}</td>
                                                <td>{b.BatchName}</td>
                                                <td>{b.UnitPrice}</td>
                                                <td>{b.RemainingQty}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

                        </div>

                        <div className="modal-footer modal-footer-premium">
                            <button className="btn btn-light" data-bs-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

const mapStateToProps = (state) => ({
    getproducts: state.getproducts,
    getcustomers: state.getcustomers,
    getsalesorder: state.getsalesorder
});

const mapDispatchToProps = {
    fn_show_products,
    fn_show_customers,
    fn_add_sales_order,
    fn_show_sales_order,
    fn_show_batch_detail
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesOrderForm);

