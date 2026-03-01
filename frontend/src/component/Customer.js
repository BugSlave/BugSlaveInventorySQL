import React, { useState } from "react";
import {
    fn_add_customer,
    fn_token_decode
} from '../state/action/action';
import { connect } from 'react-redux';
const CustomerForm = ({
    setProgress, showAlert ,
    fn_add_customer
}) => {

    const [customer, setCustomer] = useState({
        CustomerName: "",
        ContactName: "",
        Phone: "",
        Email: "",
        Addresses: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({
            ...customer,
            [name]: value
        });
    };

    const handleSubmit = async() =>{
        try{
            const { CustomerName, ContactName, Phone, Email, Addresses } = customer;
            if (!CustomerName || !ContactName || !Phone || !Email || !Addresses) {
                showAlert('warning', 'Please fill in all fields');
                return;
            }
            const result = await fn_add_customer(CustomerName, ContactName, Phone, Email, Addresses);
            console.log(result)
            for (const res of result){
                if(res.ErrorCode === "0"){
                    showAlert('success', res.ErrorName);
                    setCustomer({
                        CustomerName: "",
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
                <div className="card-header bg-success text-white text-center">
                    <h4>Customer Management Portal</h4>
                </div>

                <div className="card-body">
                    <form>

                        <div className="row mb-3">

                            <div className="col-md-6">
                                <label className="form-label">Customer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="CustomerName"
                                    value={customer.CustomerName}
                                    onChange={handleChange}
                                    placeholder="Enter Customer Name"
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
                                    value={customer.ContactName}
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
                                    value={customer.Phone}
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
                                    value={customer.Email}
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
                                    value={customer.Addresses}
                                    onChange={handleChange}
                                    placeholder="Enter Address"
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <button type="button" className="btn btn-primary px-4" onClick={handleSubmit}>
                                Add Customer
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
    fn_add_customer,
    fn_token_decode
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomerForm)