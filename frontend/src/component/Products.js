import React, { useEffect, useState } from 'react'
import {
    fn_show_categories,
    fn_add_products,
    fn_token_decode
} from '../state/action/action';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Products = ({
    setProgress, showAlert
    , fn_token_decode
    , fn_show_categories, getcategories
    , fn_add_products
}) => {

    const location = useLocation();

    useEffect(() => {
        setProgress(30)
        setTimeout(() => {
            document.title = 'IMS | Products Master';
            handleToken()
            setProgress(100)
        }, 1000)

        // eslint-disable-next-line
    }, [location])

    const productRow = {
        "productName": "",
        "categoryId": "-1",
        "unitPrice": "",
        "productId": "",
        "createdBy": ""
    }

    const [addProductMaster, setAddProductMaster] = useState([productRow])

    const handleToken = async () => {
        try {
            const data = await fn_token_decode();
            await fn_show_categories()
            setAddProductMaster(prev => prev.map((branch, i) => {
                if (i !== 0) return branch;
                return {
                    ...branch,
                    createdBy: data.tokenUserId
                };
            }));
        } catch (error) {
            throw error;
        }
    }

    const handleOnChange = (e) => {
        const { value, name } = e.target;
        setAddProductMaster(prev => prev.map((branch, i) => {
            if (i !== 0) return branch;
            return {
                ...branch,
                [name]: value
            };
        }));
    };

    const handleSaveProduct = async () => {
        try {
            const response = await fn_add_products(addProductMaster);

            // Handle multiple responses from stored procedure
            let hasErrors = false;
            let successCount = 0;

            for (const res of response) {
                if (res.ErrorCode === "0") {
                    successCount++;
                } else {
                    hasErrors = true;
                    showAlert('error', res.ErrorName);
                }
            }
            if (!hasErrors && successCount > 0) {
                showAlert('success', `Successfully added ${successCount} product(s)`);

                setAddProductMaster(prev => prev.map((branch, i) => {
                    if (i !== 0) return branch;
                    return {
                        ...branch,
                        productName: "",
                        categoryId: "-1",
                        unitPrice: "",
                        productId: ""
                    };
                }));
            }

        } catch (error) {
            throw error;
        }
    };


    return (
        <>
            <div className="mb-1 bg-light">
                {/* Form Card */}
                <div className="card shadow-lg border-0 mx-auto" style={{ backgroundColor: '#ffffffcc' }}>
                    <div className="card-header bg-primary text-white fw-semibold text-center">
                        Products Master
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="row g-3">

                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <input
                                            type="text"
                                            name="productName"
                                            className="form-control"
                                            placeholder="Product Name"
                                            aria-label="Product Name"
                                            onChange={handleOnChange}
                                            value={addProductMaster[0]?.productName || ""}  // ✅ ADDED
                                        />
                                        <label htmlFor="productName" className="fw-semibold text-secondary">Product Name</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <select
                                            className="form-select bg-light"
                                            name="categoryId"
                                            aria-label="Category"
                                            style={{ cursor: "pointer" }}
                                            onChange={handleOnChange}
                                            value={addProductMaster[0]?.productName || ""}  // ✅ ADDED
                                        >
                                            <option value="-1">Select Category</option>
                                            {getcategories?.map((cust, cidx) => (
                                                <option key={cidx} value={cust.CategoryId}>{cust.CategoryName}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="category" className="fw-semibold text-secondary">Category</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <input
                                            type="number"
                                            name="unitPrice"
                                            className="form-control"
                                            placeholder="Unit Price"
                                            aria-label="Unit Price"
                                            onChange={handleOnChange}
                                            value={addProductMaster[0]?.unitPrice || ""}
                                        />
                                        <label htmlFor="unitPrice" className="fw-semibold text-secondary">Unit Price</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <input
                                            type="text"
                                            name="supplierId"
                                            className="form-control"
                                            placeholder="Supplier Id"
                                            aria-label="Supplier Id"
                                            disabled="yes"
                                            onChange={handleOnChange}
                                            value={addProductMaster[0]?.supplierId || ""}
                                        />
                                        <label htmlFor="supplierId" className="fw-semibold text-secondary">Supplier Id</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <input
                                            type="number"
                                            name="unitInStock"
                                            className="form-control"
                                            placeholder="Unit In Stock"
                                            aria-label="Unit In Stock"
                                            disabled="yes"
                                            onChange={handleOnChange}
                                            value={addProductMaster[0]?.unitInStock || ""}
                                        />
                                        <label htmlFor="unitInStock" className="fw-semibold text-secondary">Unit In Stock</label>
                                    </div>
                                </div>


                            </div>


                            <div className="d-flex justify-content-start my-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary rounded-pill shadow-sm"
                                    onClick={handleSaveProduct}
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >

        </>
    )
}

const mapStateToProps = (state) => ({
    getcategories: state.getcategories,
    error: state.error
})

const mapDispatchToProps = {
    fn_show_categories,
    fn_add_products,
    fn_token_decode
}


export default connect(mapStateToProps, mapDispatchToProps)(Products)