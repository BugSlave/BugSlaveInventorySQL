import React, { useEffect, useState } from "react";
import {
    fn_add_supplier,
    fn_token_decode
} from '../state/action/action';
import { connect } from 'react-redux';
const SupplierForm = ({
    setProgress, showAlert ,
    fn_add_supplier
}) => {

    const [supplier, setSupplier] = useState({
        SupplierName: "",
        ContactName: "",
        Phone: "",
        Email: "",
        Addresses: ""
    });

    useEffect(() => {
        setProgress(30);

        setTimeout(() => {
            setProgress(100);
        }, 500);

        // eslint-disable-next-line
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplier({
            ...supplier,
            [name]: value
        });
    };

    const handleSubmit = async() =>{
        try{
            const { SupplierName, ContactName, Phone, Email, Addresses } = supplier;
            if (!SupplierName || !ContactName || !Phone || !Email || !Addresses) {
                showAlert('warning', 'Please fill in all fields');
                return;
            }
            const result = await fn_add_supplier(SupplierName, ContactName, Phone, Email, Addresses);
            for (const res of result){
                if(res.ErrorCode === "0"){
                    showAlert('success', res.ErrorName);
                    setSupplier({
                        SupplierName: "",
                        ContactName: "",
                        Phone: "",
                        Email: "",
                        Addresses: ""
                    }); 
                }
                else{
                    showAlert('error', res.ErrorName);
                }
            }
        }
        catch(error){
            throw error;
        }
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white text-center">
                    <h4>Supplier Management Portal</h4>
                </div>

                <div className="card-body">
                    <form>

                        <div className="row mb-3">

                            <div className="col-md-6">
                                <label className="form-label">Supplier Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="SupplierName"
                                    value={supplier.SupplierName}
                                    onChange={handleChange}
                                    placeholder="Enter Supplier Name"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Contact Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ContactName"
                                    value={supplier.ContactName}
                                    onChange={handleChange}
                                    placeholder="Enter Contact Person Name"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Phone"
                                    value={supplier.Phone}
                                    onChange={handleChange}
                                    placeholder="Enter Phone Number"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="Email"
                                    value={supplier.Email}
                                    onChange={handleChange}
                                    placeholder="Enter Email Address"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Addresses"
                                    value={supplier.Addresses}
                                    onChange={handleChange}
                                    placeholder="Enter Address"
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <button type="button" className="btn btn-success px-4" onClick={handleSubmit}>
                                Add Supplier
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    error: state.error
})

const mapDispatchToProps = {
    fn_add_supplier,
    fn_token_decode
}


export default connect(mapStateToProps, mapDispatchToProps)(SupplierForm)