import React, { useEffect, useState, useCallback } from 'react'
import {
    fn_show_categories,
    fn_add_products,
    fn_show_products,
    fn_update_products,
    fn_token_decode
} from '../state/action/action';

import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Products = ({
    setProgress,
    showAlert,
    fn_token_decode,
    fn_show_categories,
    fn_add_products,
    fn_update_products,
    fn_show_products,
    getcategories,
    getproducts
}) => {

    const location = useLocation()

    const [showModal, setShowModal] = useState(false)

    const [search, setSearch] = useState("")

    const [currentPage, setCurrentPage] = useState(1)

    const rowsPerPage = 8

    const [sortField, setSortField] = useState("")

    const [sortAsc, setSortAsc] = useState(true)

    const productRow = {
        productName: "",
        categoryId: "-1",
        unitPrice: "0.00",
        productId: "",
        supplierId: "",
        unitInStock: "0.00",
        createdBy: ""
    }

    const [addProductMaster, setAddProductMaster] = useState([productRow])

    const handleToken = useCallback(async () => {
        try {
            const data = await fn_token_decode();
            await fn_show_categories();

            setAddProductMaster(prev =>
                prev.map((row, i) => {
                    if (i !== 0) return row;
                    return {
                        ...row,
                        createdBy: data.tokenUserId,
                    };
                })
            );
        } catch (error) {
            console.error(error);
        }
    }, [fn_token_decode, fn_show_categories, setAddProductMaster]);


    useEffect(() => {

        setProgress(30)

        setTimeout(() => {

            document.title = "IMS | Products Master"

            handleToken()

            fn_show_products()

            setProgress(100)

        }, 800)

        // eslint-disable-next-line

    }, [location, fn_show_products, setProgress, handleToken])




    const handleOnChange = (e) => {

        const { name, value } = e.target

        setAddProductMaster(prev =>
            prev.map((row, i) => {

                if (i !== 0) return row

                return {
                    ...row,
                    [name]: value
                }

            })
        )

    }


    const handleSelectProduct = (product) => {

        setAddProductMaster(prev =>
            prev.map((row, i) => {

                if (i !== 0) return row

                return {

                    ...row,
                    productId: product.ProductId,
                    productName: product.ProductName,
                    categoryId: product.CategoryId,
                    unitPrice: product.UnitPrice,
                    supplierId: product.SupplierId,
                    unitInStock: product.UnitInStock

                }

            })
        )

        setShowModal(false)

    }


    const handleAddNewRecord = () => {

        setAddProductMaster([productRow])

    }


    const handleSaveProduct = async () => {

        try {

            const response = await fn_add_products(addProductMaster)

            for (const res of response) {

                if (res.ErrorCode === "0")
                    showAlert("success", res.ErrorName)
                else
                    showAlert("error", res.ErrorName)

            }

        }
        catch (error) {
            console.error(error)
        }

    }


    const handleUpdateProduct = async () => {

        try {

            const result = await fn_update_products(addProductMaster)

            for (const res of result) {

                if (res.ErrorCode === "0")
                    showAlert("success", res.ErrorName)
                else
                    showAlert("error", res.ErrorName)

            }

        }
        catch (error) {
            console.error(error)
        }

    }



    // ==========================
    // SEARCH + SORT
    // ==========================

    const filteredProducts = getproducts
        ?.filter(p =>
            p.ProductName?.toLowerCase().includes(search.toLowerCase()) ||
            p.ProductId?.toString().includes(search)
        )
        ?.sort((a, b) => {

            if (!sortField) return 0

            if (sortAsc)
                return a[sortField] > b[sortField] ? 1 : -1
            else
                return a[sortField] < b[sortField] ? 1 : -1

        })


    const indexLast = currentPage * rowsPerPage
    const indexFirst = indexLast - rowsPerPage

    const currentRows = filteredProducts?.slice(indexFirst, indexLast)

    const totalPages = Math.ceil(filteredProducts?.length / rowsPerPage)



    const handleSort = (field) => {

        if (sortField === field)
            setSortAsc(!sortAsc)
        else {
            setSortField(field)
            setSortAsc(true)
        }

    }


    return (

        <>

            <div className="mt-2">
                <div className="card card-premium">

                    {/* HEADER */}
                    <div className="card-header header-gradient text-white d-flex justify-content-between align-items-center px-4 py-3">
                        <div>
                            <h5 className="mb-0 fw-semibold">Products Master</h5>
                            <small className="opacity-75">Manage products efficiently</small>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-light btn-sm px-3" onClick={() => setShowModal(true)}>
                                🔍 Find
                            </button>
                            <button className="btn btn-dark btn-sm px-3" onClick={handleAddNewRecord}>
                                + New
                            </button>
                        </div>
                    </div>

                    <div className="card-body p-4">

                        {/* PRODUCT INFO */}
                        <div className="section-box mb-3">
                            <div className="row g-3">

                                <div className="col-md-4">
                                    <label className="form-label small text-muted">Product Name</label>
                                    <input
                                        className="form-control input-clean"
                                        name="productName"
                                        value={addProductMaster[0].productName}
                                        onChange={handleOnChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label small text-muted">Category</label>
                                    <select
                                        className="form-select input-clean"
                                        name="categoryId"
                                        value={addProductMaster[0].categoryId}
                                        onChange={handleOnChange}
                                    >
                                        <option value="-1">Select Category</option>
                                        {getcategories?.map(cat => (
                                            <option key={cat.CategoryId} value={cat.CategoryId}>
                                                {cat.CategoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label small text-muted">Unit Price</label>
                                    <input
                                        type="number"
                                        className="form-control input-clean"
                                        name="unitPrice"
                                        value={addProductMaster[0].unitPrice || "0.00"}
                                        onChange={handleOnChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label small text-muted">Supplier Id</label>
                                    <input
                                        className="form-control input-clean bg-light"
                                        value={addProductMaster[0].supplierId}
                                        disabled
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label small text-muted">Unit In Stock</label>
                                    <input
                                        className="form-control input-clean bg-light"
                                        value={addProductMaster[0].unitInStock || "0.00"}
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
                                onClick={
                                    addProductMaster[0].productId
                                        ? handleUpdateProduct
                                        : handleSaveProduct
                                }
                            >
                                {addProductMaster[0].productId ? "Update Product" : "Save Product"}
                            </button>
                        </div>

                    </div>
                </div>


                {/* ================= FIND MODAL ================= */}

                {showModal && (
                    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered">
                            <div className="modal-content modal-premium">

                                <div className="modal-header modal-header-premium">
                                    <h5 className="modal-title">Product List</h5>
                                    <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                                </div>

                                <div className="modal-body modal-body-premium">

                                    {/* SEARCH */}
                                    <input
                                        className="search-box mb-3"
                                        placeholder="Search Product Id / Name"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                                    {/* TABLE */}
                                    <div className="table-responsive table-premium" style={{ maxHeight: "400px" }}>
                                        <table className="table mb-0 align-middle">

                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort("ProductId")} role="button">Id</th>
                                                    <th onClick={() => handleSort("ProductName")} role="button">Name</th>
                                                    <th>Category</th>
                                                    <th onClick={() => handleSort("UnitPrice")} role="button">Price</th>
                                                    <th>Supplier</th>
                                                    <th>Stock</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {currentRows?.map(prod => (
                                                    <tr
                                                        key={prod.ProductId}
                                                        onClick={() => handleSelectProduct(prod)}
                                                        role="button"
                                                    >
                                                        <td>{prod.ProductId}</td>
                                                        <td>{prod.ProductName}</td>
                                                        <td>
                                                            {
                                                                getcategories?.find(
                                                                    c => c.CategoryId === prod.CategoryId
                                                                )?.CategoryName
                                                            }
                                                        </td>
                                                        <td>{prod.UnitPrice}</td>
                                                        <td>{prod.SupplierId}</td>
                                                        <td>{prod.UnitInStock}</td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>

                                    {/* PAGINATION */}
                                    <div className="d-flex justify-content-between align-items-center mt-3">

                                        <span>
                                            Page {currentPage} of {totalPages}
                                        </span>

                                        <div>
                                            <button
                                                className="btn btn-sm btn-light me-2"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                            >
                                                Prev
                                            </button>

                                            <button
                                                className="btn btn-sm btn-light"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>

        </>

    )

}


const mapStateToProps = (state) => ({
    getcategories: state.getcategories,
    getproducts: state.getproducts
})


const mapDispatchToProps = {
    fn_show_categories,
    fn_add_products,
    fn_update_products,
    fn_token_decode,
    fn_show_products
}


export default connect(mapStateToProps, mapDispatchToProps)(Products)