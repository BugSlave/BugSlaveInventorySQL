import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import {
    fn_show_sales_order_summary,
    fn_show_sales_order_detail,
    fn_token_decode
} from '../state/action/action';

const SalesOrderReport = ({
    setProgress, showAlert
    , fn_show_sales_order_summary
    , fn_show_sales_order_detail
}) => {
    const [allinvoices, setAllInvoices] = useState([]);

    const [detailInvoice, setDetailInvoice] = useState([])

    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const [searchReport, setsearchReport] = useState({
        fromDate: getTodayDate(),
        toDate: getTodayDate(),
        documentId: "",
        fileName: "SalesOrderReport.csv"

    })

    useEffect(() => {
        setProgress(30)

        setTimeout(() => {
            setProgress(100)
            handleToken()
        }, 1000)

        // eslint-disable-next-line
    }, [])


    const handleToken = async () => {
        try {
            await fn_token_decode();
            await handlesearchReportButon();
        } catch (error) {
            throw error;
        }
    }

    const onHandleSearchChange = (e) => {
        const { name, value } = e.target;
        setsearchReport(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDetailInvoice = async (documentId) => {
        try {
            const result = await fn_show_sales_order_detail(documentId)
            setDetailInvoice(result)
        } catch (error) {
            throw error.message;
        }
    }


    const handlesearchReportButon = async () => {
        try {
            const resultShowInvoice = await fn_show_sales_order_summary(searchReport.fromDate, searchReport.toDate);
            setAllInvoices(resultShowInvoice);
        } catch (error) {
            throw error
        }
    }

    const downloadCSV = (data, filename) => {
        if (!data || data.length === 0) {
            showAlert('error', 'No data to export');
            return;
        }
        const headers = Object.keys(data[0] || {}).join(',');
        const csvRows = [headers, ...data.map(row => Object.values(row).join(','))];
        const csvContent = csvRows.join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    const handleExportReport = async () => {
        try {
            const resultShowInvoice = await fn_show_sales_order_summary(
                searchReport.fromDate, searchReport.toDate
            );
            // Pass data array (adjust key if nested, e.g., resultShowInvoice.data)
            downloadCSV(resultShowInvoice, searchReport.fileName);

        } catch (error) {
            throw error
        }
    }
    return (
        <div className="card shadow-sm rounded-4 mb-5 border-0 overflow-hidden">
            {/* Header */}
            <div className="card-header bg-primary text-white py-3 px-3 px-sm-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <span
                            className="bg-white bg-opacity-25 rounded-3 d-inline-flex align-items-center justify-content-center"
                            style={{ width: 36, height: 36 }}
                        >
                            <i className="bi bi-receipt-cutoff fs-5"></i>
                        </span>

                        <div className="lh-sm">
                            <div className="fw-semibold">Sales Order Report</div>
                            <div className="small text-white-50">
                                Total: {Array.isArray(allinvoices) ? allinvoices.length : 0}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div className="input-group input-group-sm shadow-sm">
                            <span className="input-group-text bg-white border-0">
                                <i className="bi bi-calendar3 text-muted"></i>
                            </span>

                            <input
                                type="date"
                                className="form-control border-0"
                                id="fromDate"
                                name="fromDate"
                                value={searchReport.fromDate || ""}
                                onChange={onHandleSearchChange}
                                style={{ maxWidth: 150 }}
                            />

                            <span className="input-group-text bg-white border-0 px-1">
                                <i className="bi bi-arrow-right-short text-muted"></i>
                            </span>

                            <input
                                type="date"
                                className="form-control border-0"
                                id="toDate"
                                name="toDate"
                                value={searchReport.toDate || ""}
                                onChange={onHandleSearchChange}
                                style={{ maxWidth: 150 }}
                            />

                            <button
                                className="btn btn-light border-0 px-3"
                                type="button"
                                title="Filter by date range"
                                onClick={handlesearchReportButon}
                            >
                                <i className="bi bi-search me-1"></i>
                                <span className="d-none d-sm-inline">Search</span>
                            </button>

                            <button
                                className="btn btn-success border-0 px-3 d-flex align-items-center gap-1"
                                type="button"
                                title="Export to CSV"
                                onClick={handleExportReport}
                            >
                                <i className="bi bi-file-earmark-excel fs-6"></i>
                                <span className="d-none d-sm-inline">Excel</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: "72vh", overflow: "auto" }}>
                    <table
                        className="table table-bordered table-hover align-middle mb-0 border-secondary"
                        style={{ width: "100%" }}
                    >
                        <thead
                            className="sticky-top text-uppercase small"
                            style={{ backgroundColor: "#0d6efd", color: "#fff", zIndex: 2 }}
                        >
                            <tr className="text-center">
                                <th style={{ width: 48 }}></th>
                                <th className="d-none d-sm-table-cell">Document Id</th>
                                <th className="d-none d-sm-table-cell">Sales Date</th>
                                <th className="d-none d-sm-table-cell">Customer Name</th>
                                <th className="d-none d-sm-table-cell">Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allinvoices?.map((inv, idx) => {
                                const collapseId = `collapseRow${idx}`;
                                const isExpanded = detailInvoice?.DocEntry === inv.DocumentId;

                                return (
                                    <React.Fragment key={inv.DocEntry || idx}>
                                        <tr className={`text-center ${isExpanded ? "table-striped" : ""}`}>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${isExpanded ? "btn-primary" : "btn-outline-primary"
                                                        } rounded-circle shadow-sm`}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#${collapseId}`}
                                                    aria-expanded={isExpanded}
                                                    aria-controls={collapseId}
                                                    onClick={() => handleDetailInvoice(inv.DocumentId)}
                                                    title={isExpanded ? "Hide details" : "Show details"}
                                                    style={{ width: 34, height: 34 }}
                                                >
                                                    <i className={`bi ${isExpanded ? "bi-chevron-down" : "bi-chevron-right"}`}></i>
                                                </button>
                                            </td>

                                            <td className="fw-semibold d-none d-sm-table-cell">{inv.DocumentId}</td>

                                            <td className="fw-semibold d-none d-sm-table-cell">{inv.SalesDate}</td>

                                            <td className="fw-semibold d-none d-sm-table-cell">{inv.CustomerName}</td>

                                            <td className="fw-semibold d-none d-sm-table-cell">{inv.Status}</td>

                                            <td className="fw-semibold d-none d-sm-table-cell">{inv.Amount}</td>
                                        </tr>


                                        <tr className="collapse" id={collapseId}>
                                            <td colSpan="9" className="p-0">
                                                <div className="p-3 bg-light">
                                                    <div className="bg-white rounded-4 shadow-sm border">
                                                        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                                                            <div className="fw-semibold small">
                                                                <span className="text-muted ms-2">Product Name: {inv.ProductName}</span>
                                                            </div>
                                                        </div>

                                                        <div className="table-responsive">
                                                            <table className="table table-sm table-bordered table-hover mb-0 border-secondary">
                                                                <thead
                                                                    className="text-center text-uppercase small"
                                                                    style={{ backgroundColor: "#0d6efd", color: "#fff" }}
                                                                >
                                                                    <tr>
                                                                        <th style={{ width: 50 }}>#</th>
                                                                        <th style={{ minWidth: 110 }}>Product Name</th>
                                                                        <th style={{ minWidth: 220 }}>Quantity</th>
                                                                        <th style={{ minWidth: 120 }}>Unit Price</th>
                                                                        <th style={{ minWidth: 120 }}>Total Cost</th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody className="text-center align-middle">
                                                                    {Array.isArray(detailInvoice) && detailInvoice.length > 0 ? (
                                                                        detailInvoice.map((line, lidx) => (
                                                                            <tr key={lidx}>
                                                                                <td></td>
                                                                                <td className="text-nowrap">{line.ProductName}</td>
                                                                                <td className="text-nowrap">{line.Quantity}</td>
                                                                                <td className="text-nowrap">{line.UnitPrice}</td>
                                                                                <td>{line.TotalCost || "-"}</td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="11" className="text-muted fst-italic py-4">
                                                                                No details available.
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    error: state.error
})

const mapDispatchToProps = {
    fn_show_sales_order_summary,
    fn_show_sales_order_detail,
    fn_token_decode
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesOrderReport)
