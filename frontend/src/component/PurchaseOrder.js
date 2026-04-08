
import React, { useState, useEffect, useRef, useCallback } from "react";

import {
    fn_show_products,
    fn_show_suppliers,
    fn_add_purchase_order,
    fn_show_purchase_order,
    fn_show_purchase_item_detail,
    fn_token_decode
} from '../state/action/action';

import { connect } from 'react-redux';

const PurchaseOrderForm = ({
    setProgress, showAlert,
    fn_show_products, getsuppliers,
    fn_show_suppliers, getproducts,
    fn_add_purchase_order,
    fn_show_purchase_order, getpurchaseorder,
    fn_show_purchase_item_detail
}) => {

    const [mode, setMode] = useState("add");

    const [docTypeMode, setDocTypeMode] = useState("0")

    const today = new Date().toISOString().split("T")[0];

    const createHeaderRow = () => ({
        SupplierId: "",
        PurchaseDate: today,
        Status: "Complete",
        GrossAmount: 0.00,
        Amount: 0,
        DocumentId: "",
        DiscountPercent: 0.00,
        DiscountAmount: 0.00
    })

    const generateId = () => crypto.randomUUID();

    const createItemRows = () => ({
        id: generateId(),
        LineNumber: 1,
        ProductId: "",
        Quantity: 0.00,
        UnitPrice: 0.00,
        TotalCost: 0.00
    })

    const [itemlines, setItemLines] = useState([createItemRows()])

    const [formData, setFormData] = useState(createHeaderRow());

    const [searchTermProducts, setSearchTermProducts] = useState("");

    useEffect(() => {

        setProgress(30);
        fn_show_suppliers();
        fn_show_products();
        setProgress(100);
        // eslint-disable-next-line
    }, []);

    const calculateTotals = (rows, discountPercent = 0) => {
        const gross = rows.reduce(
            (sum, r) => sum + (Number(r.TotalCost) || 0),
            0
        );

        const discountAmount = (gross * discountPercent) / 100;
        const netAmount = gross - discountAmount;

        return {
            GrossAmount: Number(gross.toFixed(2)),
            DiscountPercent: Number(discountPercent.toFixed(2)),
            DiscountAmount: Number(discountAmount.toFixed(2)),
            Amount: Number(netAmount.toFixed(2))
        };
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const gross = itemlines.reduce(
                (sum, r) => sum + (Number(r.TotalCost) || 0),
                0
            );

            let discountPercent = Number(prev.DiscountPercent) || 0;

            if (name === "DiscountPercent") {
                discountPercent = Number(value) || 0;
            }

            else if (name === "DiscountAmount") {
                const discountAmount = Number(value) || 0;
                discountPercent = gross ? (discountAmount / gross) * 100 : 0;
            }

            else if (name === "Amount") {
                const netAmount = Number(value) || 0;
                const discountAmount = gross - netAmount;
                discountPercent = gross ? (discountAmount / gross) * 100 : 0;
            }

            const totals = calculateTotals(itemlines, discountPercent);

            return {
                ...prev,
                ...totals,
                [name]: value
            };
        });
    };
    const handleFind = async () => {

        setProgress(30)
        setMode("find");
        setDocTypeMode(1)

        await fn_show_purchase_order();
        setProgress(100)
    };

    const handleAdd = () => {
        setProgress(30)
        setMode("add");

        setFormData(createHeaderRow());
        setItemLines([createItemRows()])

        setDocTypeMode("0")
        setProgress(100)

    };


    const filteredFindData = getpurchaseorder?.filter((product) => {
        if (!searchTermProducts) return true;

        const term = searchTermProducts.toLowerCase();

        return Object.values(product).some((value) =>
            value?.toString().toLowerCase().includes(term)
        );
    });

    const handleRowClick = async (po) => {
        setMode("add");
        setFormData({
            SupplierId: po.SupplierId,
            ProductId: po.ProductId,
            PurchaseDate: po.PurchaseDate?.split("T")[0],
            Status: "Complete",
            GrossAmount: po.GrossAmount,
            Amount: po.Amount,
            DiscountPercent: po.DiscountPercent,
            DiscountAmount: po.DiscountAmount,
            DocumentId: po.DocumentId
        });

        const result = await fn_show_purchase_item_detail(po.DocumentId)
        const mappedRows = Array.isArray(result)
            ? result.map((item) => ({
                id: generateId(),
                ProductId: item?.ProductId ?? "",
                Quantity: Number(item?.Quantity) || 0,
                UnitPrice: Number(item?.UnitPrice) || 0,
                TotalCost: Number(item?.TotalCost) || 0,
                LineNumber: Number(item?.LineNumber) || 0
            }))
            : [];

        setItemLines(mappedRows.length ? mappedRows : [createItemRows()]);
    };

    const handleNothingMode = () => {
        showAlert('info', 'kyu click kr rhe ho bhai !!!')
    }


    const ref = useRef(null)

    const handleShowChooseFromList = async () => {
        try {
            await fn_show_suppliers();
            await fn_show_products();
        } catch (error) {
            throw error.message;
        }
    }



    const handleRowSelect = async (rowData) => {
        const supplierId = rowData.SupplierId;

        // 1️⃣ Set textbox value
        setFormData(prev => ({
            ...prev,
            SupplierId: supplierId
        }));

        ref.current.click();
    };

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const filteredSuppliers = getsuppliers?.filter((supplier) => {
        if (!searchTerm) return true;

        const term = searchTerm.toLowerCase();

        return Object.values(supplier).some((value) =>
            value?.toString().toLowerCase().includes(term)
        );
    });


    /* Add Multiple rows for item purchase */

    // Product Row Select

    const addItemRows = () => {
        setItemLines(prev => {
            const updatedRows = [
                ...prev,
                createItemRows(prev.length)
            ];

            const totals = calculateTotals(
                updatedRows,
                Number(formData.DiscountPercent) || 0
            );

            setFormData(prevForm => ({
                ...prevForm,
                ...totals
            }));

            return updatedRows;
        });
    };

    const deleteRoomRow = (id) => {
        setItemLines(prev => {
            const updatedRows = prev
                .filter(row => row.id !== id)
                .map((row, index) => ({
                    ...row,
                    LineNumber: index
                }));

            const totals = calculateTotals(updatedRows);

            setFormData(prevForm => ({
                ...prevForm,
                ...totals
            }));

            return updatedRows;
        });
    };

    const handleOnChangeItems = (e, id) => {
        const { name, value } = e.target;

        setItemLines(prev => {
            const updatedRows = prev.map(row => {
                if (row.id !== id) return row;

                const updated = {
                    ...row,
                    [name]: name === "ProductId" ? value : Number(value)
                };

                if (name === "Quantity" || name === "UnitPrice") {
                    updated.TotalCost = (updated.Quantity || 0.00) * (updated.UnitPrice || 0.00);
                }

                return updated;
            });

            const totals = calculateTotals(
                updatedRows,
                Number(formData.DiscountPercent) || 0
            );

            setFormData(prev => ({
                ...prev,
                ...totals
            }));

            return updatedRows;
        });
    };

    const refProduct = useRef(null)

    const [currentId, setCurrentId] = useState(null);

    const handleRowSelectProducts = async (rowData, rowId) => {
        const productId = rowData.ProductId;
        setItemLines(prev =>
            prev.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        ProductId: productId
                    }
                    : row
            )
        );
        refProduct.current.click();
    };

    const handleSearchChangeProducts = useCallback((e) => {
        setSearchTermProducts(e.target.value);
    }, []);

    const filteredProducts = getproducts?.filter((product) => {
        if (!searchTermProducts) return true;

        const term = searchTermProducts.toLowerCase();

        return Object.values(product).some((value) =>
            value?.toString().toLowerCase().includes(term)
        );
    });

    const handleSubmit = async () => {

        const finalPayload = [{
            formData,
            itemlines
        }]

        const result = await fn_add_purchase_order(finalPayload);
        for (const res of result) {
            if (res.ErrorCode === "0") {
                showAlert('success', res.ErrorName);
                handleAdd();
            } else {
                showAlert('error', res.ErrorName);
            }
        }
    };

    return (

        <>
            <div className="card card-premium">

                {/* HEADER */}
                <div className="card-header header-gradient text-white d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0 fw-semibold">Purchase Order</h5>
                        <small className="opacity-75">Manage purchase efficiently</small>
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm px-3" onClick={handleFind}>
                            🔍 Find
                        </button>
                        <button className="btn btn-dark btn-sm px-3" onClick={handleAdd}>
                            + New
                        </button>
                    </div>
                </div>

                <div className="card-body p-3">

                    {/* DOCUMENT */}
                    <div className="section-box mb-1">
                        <div className="row g-3">
                            <div className="col-md-3 d-none">
                                <label className="form-label small text-muted">Document ID</label>
                                <input className="form-control input-clean bg-light"
                                    value={formData.DocumentId || ""} readOnly />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Purchase Date</label>
                                <input type="date" className="form-control input-clean bg-light"
                                    value={formData.PurchaseDate || ""} readOnly />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Supplier</label>
                                <div className="position-relative">
                                    <select className="form-select input-clean pe-5"
                                        name="SupplierId"
                                        value={formData.SupplierId}
                                        onChange={handleChange}
                                        disabled>
                                        <option value="-1">Select Supplier</option>
                                        {getsuppliers?.map(s => (
                                            <option key={s.SupplierId} value={s.SupplierId}>
                                                {s.SupplierName}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="btn-icon position-absolute top-50 end-0 translate-middle-y me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#ChooseFromList"
                                        onClick={handleShowChooseFromList}
                                        disabled={docTypeMode === 1}>
                                        <i className="bi bi-list"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Status</label>
                                <input className="form-control input-clean bg-light"
                                    value={formData.Status || ""} readOnly />
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT TABLE */}
                    <div className="section-box-item mb-1" style={{ background: "#f8fafc" }}>
                        <div className="table-responsive" style={{ maxHeight: "350px" }}>
                            <table className="table table-hover align-middle text-nowrap mb-0 table-bordered">

                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {itemlines.map((row, index) => {
                                        const isLastRow = index === itemlines.length - 1;
                                        const rowNumber = formData.DocumentId === "" ? row.LineNumber + index : row.LineNumber
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {rowNumber}
                                                </td>

                                                {/* PRODUCT */}
                                                <td style={{ minWidth: "200px" }}>
                                                    <div className="position-relative">
                                                        <select
                                                            className="form-select form-select-sm input-clean pe-5"
                                                            value={row.ProductId}
                                                            disabled
                                                        >
                                                            <option value="-1">Select Product</option>
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
                                                            disabled={docTypeMode === 1}
                                                            onFocus={() => setCurrentId(row.id)}
                                                        >
                                                            📦
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* QTY */}
                                                <td>
                                                    <input
                                                        type="number"
                                                        className={`form-control form-control-sm input-clean ${docTypeMode === 1 ? "bg-light" : ""}`}
                                                        name="Quantity"
                                                        value={row.Quantity}
                                                        onChange={(e) => handleOnChangeItems(e, row.id)}
                                                        readOnly={docTypeMode === 1}
                                                    />
                                                </td>

                                                {/* PRICE */}
                                                <td>
                                                    <input
                                                        type="number"
                                                        className={`form-control form-control-sm input-clean ${docTypeMode === 1 ? "bg-light" : ""}`}
                                                        name="UnitPrice"
                                                        value={row.UnitPrice}
                                                        onChange={(e) => handleOnChangeItems(e, row.id)}
                                                        readOnly={docTypeMode === 1}
                                                    />
                                                </td>

                                                {/* TOTAL */}
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm input-clean bg-light fw-semibold"
                                                        value={row.TotalCost}
                                                        disabled
                                                    />
                                                </td>

                                                {/* ACTION */}
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        {isLastRow && (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={addItemRows}
                                                                disabled={docTypeMode === 1}
                                                            >
                                                                +
                                                            </button>
                                                        )}

                                                        {index !== 0 && (
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteRoomRow(row.id)}
                                                                disabled={docTypeMode === 1}
                                                            >
                                                                −
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div>
                    </div>

                    {/* PRICING */}
                    <div className="section-box mb-1" >
                        <div className="row g-3">

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Gross Amount</label>
                                <input
                                    type="number"
                                    name="GrossAmount"
                                    value={formData.GrossAmount}
                                    className={`form-control input-clean bg-light`}
                                    readOnly
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Discount %</label>
                                <input
                                    type="number"
                                    name="DiscountPercent"
                                    value={formData.DiscountPercent}
                                    onChange={handleChange}
                                    className={`form-control input-clean ${docTypeMode === 1 ? "bg-light" : ""}`}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Discount ₹</label>
                                <input
                                    type="number"
                                    name="DiscountAmount"
                                    value={formData.DiscountAmount}
                                    onChange={handleChange}
                                    className={`form-control input-clean ${docTypeMode === 1 ? "bg-light" : ""}`}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small text-muted">Total Amount</label>
                                <input
                                    type="number"
                                    name="Amount"
                                    value={formData.Amount}
                                    onChange={handleChange}
                                    className="form-control input-clean fw-bold text-success"
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
                            onClick={formData.DocumentId ? handleNothingMode : handleSubmit}
                        >
                            {formData.DocumentId ? "Done" : "Create Purchase"}
                        </button>
                    </div>

                </div>
            </div>

            {/* FIND MODAL */}
            {mode === "find" && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxHeight: "90vh" }}>

                        <div className="modal-content modal-premium d-flex flex-column" style={{ height: "90vh" }}>

                            <div className="modal-header modal-header-premium d-flex justify-content-between">
                                <h5 className="modal-title">Find Purchase Order</h5>
                                <input
                                    type="text"
                                    className="search-box"
                                    placeholder="Search..."
                                    value={searchTermProducts}
                                    onChange={handleSearchChangeProducts}
                                />
                            </div>

                            <div
                                className="modal-body modal-body-premium"
                                style={{ overflowY: "auto", flex: 1 }}
                            >
                                <div className="table-responsive table-premium">
                                    <table className="table mb-0 align-middle table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Document Number</th>
                                                <th>Supplier</th>
                                                <th>Purchase Date</th>
                                                <th>Status</th>
                                                <th>Gross Amount</th>
                                                <th>Discount Percent</th>
                                                <th>Discount Amount</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredFindData?.map((row, i) => (
                                                <tr key={i} onClick={() => handleRowClick(row)} role="button">
                                                    <td>{row.DocumentId}</td>
                                                    <td>{row.SupplierName}</td>
                                                    <td>{row.PurchaseDate}</td>
                                                    <td>{row.Status}</td>
                                                    <td>{row.GrossAmount}</td>
                                                    <td>{row.DiscountPercent}</td>
                                                    <td>{row.DiscountAmount}</td>
                                                    <td>{row.Amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer modal-footer-premium">
                                <button className="btn btn-light" data-bs-dismiss="modal" onClick={() => { setMode("add"); setDocTypeMode(0) }}>Close</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            <button ref={ref} type="button" className="d-none" data-bs-toggle="modal" data-bs-target="#ChooseFromList" />

            <div className="modal fade" id="ChooseFromList">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content modal-premium">

                        <div className="modal-header modal-header-premium d-flex justify-content-between">
                            <h6 className="m-0">Supplier List</h6>

                            <input
                                type="text"
                                className="search-box"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="modal-body modal-body-premium">
                            <div className="table-responsive table-premium">
                                <table className="table mb-0 align-middle table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Supplier ID</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredSuppliers?.map((s, i) => (
                                            <tr key={i} onClick={() => handleRowSelect(s)} role="button">
                                                <td>{s.SupplierId}</td>
                                                <td>{s.SupplierName}</td>
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


            {/* PRODUCT MODAL */}
            <button ref={refProduct} type="button" className="d-none" data-bs-toggle="modal" data-bs-target="#ProductList" />

            <div className="modal fade" id="ProductList">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content modal-premium">

                        <div className="modal-header modal-header-premium d-flex justify-content-between">
                            <h6 className="m-0">Product List</h6>

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
                                <table className="table mb-0 align-middle table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Product ID</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredProducts?.map((p, i) => (
                                            <tr key={i} onClick={() => handleRowSelectProducts(p, currentId)} role="button">
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
        </>
    );
};

// batchDetails

const mapStateToProps = (state) => ({
    getproducts: state.getproducts,
    getsuppliers: state.getsuppliers,
    getpurchaseorder: state.getpurchaseorder,
    error: state.error
});

const mapDispatchToProps = {
    fn_show_products,
    fn_show_suppliers,
    fn_add_purchase_order,
    fn_show_purchase_order,
    fn_show_purchase_item_detail,
    fn_token_decode
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderForm);