import React, { useEffect, useState } from "react";
import {
    fn_add_customer,
    fn_show_customers,
    fn_update_customer,
    fn_token_decode
} from '../state/action/action';
import { connect } from 'react-redux';

const CustomerForm = ({
    setProgress,
    showAlert,
    fn_add_customer,
    fn_show_customers,
    getcustomers,
    fn_update_customer
}) => {

    const [customer, setCustomer] = useState({
        CustomerName: "",
        ContactName: "",
        Phone: "",
        Email: "",
        Addresses: "",
        customerId: ""
    });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        setProgress(30)

        setTimeout(() => {
            fn_show_customers()
            setProgress(100)
        }, 1000)

        // eslint-disable-next-line
    }, [])

    const handleChange = (e) => {

        const { name, value } = e.target;

        setCustomer({
            ...customer,
            [name]: value
        });

    };

    const clearForm = () => {

        setCustomer({
            CustomerName: "",
            ContactName: "",
            Phone: "",
            Email: "",
            Addresses: "",
            customerId: ""
        });

    };

    const handleRowSelect = (item) => {

        setCustomer({
            CustomerName: item.CustomerName,
            ContactName: item.ContactName,
            Phone: item.Phone,
            Email: item.Email,
            Addresses: item.Addresses,
            customerId: item.CustomerId
        });

        setShowModal(false);

    };

    const handleSubmit = async () => {

        try {

            const { CustomerName, ContactName, Phone, Email, Addresses } = customer;

            if (!CustomerName || !ContactName || !Phone || !Email || !Addresses) {

                showAlert('warning', 'Please fill in all fields');
                return;

            }

            const result = await fn_add_customer(CustomerName, ContactName, Phone, Email, Addresses);

            for (const res of result) {

                if (res.ErrorCode === "0") {

                    showAlert('success', res.ErrorName);

                    clearForm();

                    fn_show_customers();

                }
                else {

                    showAlert('error', res.ErrorName);

                }
            }

        }
        catch (error) {
            throw error;
        }
    }

    const handleUpdateCustomers = async () => {

        try {

            const { CustomerName, ContactName, Phone, Email, Addresses, customerId } = customer;

            const result = await fn_update_customer(CustomerName, ContactName, Phone, Email, Addresses, customerId);
            console.log(result)

            for (const res of result) {

                if (res.ErrorCode === "0") {

                    showAlert('success', res.ErrorName);
                    fn_show_customers();

                }
                else {

                    showAlert('error', res.ErrorName);

                }
            }

        }
        catch (error) {
            throw error;
        }
    }

    return (

        <div className="container mt-5">

            <div className="card shadow border-0">

                {/* Header */}

                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

                    <h4 className="mb-0">
                        Customer Management
                    </h4>

                    <div>

                        <button
                            className="btn btn-light btn-sm me-2"
                            onClick={() => setShowModal(true)}
                        >
                            🔍 Find
                        </button>

                        <button
                            className="btn btn-warning btn-sm"
                            onClick={clearForm}
                        >
                            ➕ Add
                        </button>

                    </div>

                </div>

                <div className="card-body">

                    <form>

                        <div className="row g-3">

                            <div className="col-md-6">

                                <label className="form-label">Customer Name</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="CustomerName"
                                    value={customer.CustomerName}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label">Contact Name</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="ContactName"
                                    value={customer.ContactName}
                                    onChange={handleChange}
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
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label">Email</label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="Email"
                                    value={customer.Email}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-12">

                                <label className="form-label">Address</label>

                                <textarea
                                    className="form-control"
                                    name="Addresses"
                                    rows="3"
                                    value={customer.Addresses}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div className="text-center mt-4">

                            <button
                                type="button"
                                className="btn btn-success px-5"
                                onClick={customer.customerId ? handleUpdateCustomers : handleSubmit}
                            >
                                {customer.customerId ? "Update Customer" : "Add Customer"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* Modal */}

            <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">

                <div className="modal-dialog modal-lg modal-dialog-centered">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">
                                Customer List
                            </h5>

                            <button
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            />

                        </div>

                        <div className="modal-body">

                            <table className="table table-bordered table-hover">

                                <thead className="table-dark">

                                    <tr>
                                        <th>#</th>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        getcustomers && getcustomers.length > 0 ?

                                            getcustomers.map((item, index) => (

                                                <tr
                                                    key={index}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleRowSelect(item)}
                                                >

                                                    <td>{index + 1}</td>
                                                    <td>{item.CustomerName}</td>
                                                    <td>{item.ContactName}</td>
                                                    <td>{item.Phone}</td>
                                                    <td>{item.Email}</td>

                                                </tr>

                                            ))

                                            :

                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    No Customers Found
                                                </td>
                                            </tr>

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

            {showModal && <div className="modal-backdrop fade show"></div>}

        </div>

    );
};


const mapStateToProps = (state) => ({
    getcustomers: state.getcustomers,
    error: state.error
})

const mapDispatchToProps = {
    fn_add_customer,
    fn_show_customers,
    fn_update_customer,
    fn_token_decode
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerForm);