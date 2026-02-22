import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import {
    fn_show_categories,
    fn_add_category,
    fn_token_decode
} from '../state/action/action';
import { useLocation } from 'react-router-dom';

const Categories = ({
    setProgress, showAlert
    , fn_token_decode
    , fn_show_categories, getcategories
    , fn_add_category
}) => {

    const location = useLocation();
    useEffect(() => {
        setProgress(30)

        setTimeout(() => {
            handleToken()

            document.title = 'IMS | Category Master';
            setProgress(100)
        }, 1000);

        // eslint-disable-next-line
    }, [location])

    const [result, setResult] = useState('')

    const handleToken = useCallback(async () => {
        try {
            const result = await fn_token_decode();
            setResult(result);

            setAddCategory(prev => prev.map((branch, i) => {
                if (i !== 0) return branch;
                return {
                    ...branch,
                    createdBy: result.tokenUserId
                };
            }));
            fn_show_categories();
        } catch (err) {
            throw err;
        }
    }, [fn_token_decode, fn_show_categories]);

    const category = {
        categoryName: "",
        description: "",
        categoryId: ""
    }

    const [isLoading, setIsLoading] = useState(false);

    const [addCategory, setAddCategory] = useState([category])

    const handleOnChangeCategory = useCallback((e, index) => {
        const { name, value, checked, type } = e.target;
        setAddCategory(prev => prev.map((branch, i) => {
            if (i !== index) return branch;
            return {
                ...branch,
                [name]: type === "checkbox" ? checked : value
            };
        }));
    }, []);

    const ref = useRef(null);

    const handleCloseModal = useCallback(() => {
        setAddCategory(prev => prev.map(item => ({
            ...item,
            categoryName: "",
            description: "",
            categoryId: "",
            createdBy: result?.tokenUserId || ''
        })));
        ref.current?.click();
    }, [result]);

    const handleSaveCategory = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {

            const result = await fn_add_category(addCategory);
            for (const res of result) {
                if (res.ErrorCode === "0") {
                    fn_show_categories();
                    showAlert('success', res.ErrorName);
                    handleCloseModal(); // ✅ Uses handleCloseModal
                    ref.current?.click();
                } else {
                    showAlert('error', res.ErrorName);
                }
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [addCategory, fn_add_category, fn_show_categories, showAlert, handleCloseModal, isLoading]); // ✅ All deps

    const refcategoryUpdate = useRef(null);

    const handleUpdateCategoryOpenModal = useCallback((categoryId) => {
        const foundItem = getcategories?.find(item => item.CategoryId === categoryId);
        if (foundItem) {
            setAddCategory(prev => prev.map(item => ({
                ...item,
                categoryName: foundItem.CategoryName || "",
                description: foundItem.Descriptions || "",
                createdBy: result?.tokenUserId || '',
                categoryId: foundItem.CategoryId || ""
                
            })));
        }
    }, [getcategories, result]);


    return (
        <>
            <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: "75vh", overflow: "auto", scrollbarWidth: "thin", scrollbarColor: "#adb5bd #f8f9fa" }}>
                    <div className="card-header bg-primary text-white py-3 px-3 px-sm-4" style={{ backgroundColor: "#0d6efd !important" }}>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <span className="bg-white bg-opacity-20 rounded-3 d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: 40, height: 40 }}>
                                    <i className="bi bi-tags me-1 text-dark"></i>
                                </span>
                                <div className="lh-sm">
                                    <div className="fw-semibold fs-5">Categories</div>
                                    <div className="small text-white-75">
                                        Total: {Array.isArray(getcategories) ? getcategories.length : 0}
                                    </div>
                                </div>
                            </div>
                            <button
                                ref={ref}
                                className="btn btn-light btn-sm px-3 shadow-sm"
                                style={{ borderRadius: "20px" }}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                <i className="fas fa-plus me-1"></i>
                                <span className="d-none d-sm-inline">Add New</span>
                            </button>
                        </div>
                    </div>

                    <table className="table table-bordered table-hover align-middle mb-0" style={{ width: "100%", tableLayout: "fixed" }}>
                        <thead className="sticky-top small" style={{ backgroundColor: "#0d6efd", color: "#fff", zIndex: 10 }}>
                            <tr>
                                <th className="d-none d-sm-table-cell" style={{ width: "20%" }}>Category Name</th>
                                <th style={{ width: "70%" }}>Description</th>
                                <th >Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(getcategories) && getcategories.map((category, idx) => {

                                return (
                                    <React.Fragment key={category.CategoryId || idx}>
                                        <tr>

                                            <td className="d-none d-sm-table-cell text-truncate" title={category.CategoryName}>
                                                {category.CategoryName}
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    {category.Descriptions ? category.Descriptions : "No description"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary shadow-sm flex-fill"
                                                        title="Edit"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#exampleModal"
                                                        onClick={() => handleUpdateCategoryOpenModal(category.CategoryId)}
                                                        ref={refcategoryUpdate}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
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

            {/* Add New branch Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {addCategory.map((category, index) => (
                            <div key={index}>
                                <div className="modal-header">
                                    <h6 className="modal-title">
                                        {category.categoryId ? "Update Existing Category" : "Add New Category"}
                                    </h6>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            placeholder="Category Name"
                                            name="categoryName"
                                            value={category.categoryName}
                                            onChange={(e) => handleOnChangeCategory(e, index)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Description"
                                            name="description"
                                            value={category.description}
                                            onChange={(e) => handleOnChangeCategory(e, index)}
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addCategory[0].branchId ? "" : handleSaveCategory}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : (addCategory[0].categoryId ? 'Update changes' : 'Save changes')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

const mapStateToProps = (state) => ({
    getcategories: state.getcategories,
    error: state.error
})

const mapDispatchToProps = {
    fn_show_categories,
    fn_add_category,
    fn_token_decode
}


export default connect(mapStateToProps, mapDispatchToProps)(Categories)