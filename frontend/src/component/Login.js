import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    fn_login_user
} from '../state/action/action';
import {
    useNavigate
} from 'react-router-dom'

const Login = ({ fn_login_user, showAlert }) => {

    const history = useNavigate();

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    useEffect(() => {
        if (localStorage.getItem('token')) {
            history('/home')
        }
        else{
            history('/')
        }
        // eslint-disable-next-line
    }, [])

    const {username, password} = credentials;

    const onHandleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleLogin = async () => {
        try{
            const result = await fn_login_user(credentials)
            const {errorCode, token, userId } = result;
            if (errorCode === 0){
                localStorage.setItem('token', token)
                localStorage.setItem('loginTime', Date.now().toString());
                history('/home',{
                    replace: true,
                    state:{userId: userId}
                })
            }
            else{
                showAlert('error',token)
            }
        }catch(error){
            throw error
        }
    }

    return (
        <>
            <section className="gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-body-tertiary" style={{ "borderRadius": '1rem' }}>
                                <div className="card-body p-5 text-center">

                                    <div className="mb-md-5 mt-md-4 pb-5">

                                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                        <p className="mb-5">Please enter your login and password!</p>

                                        <div data-mdb-input-init className="form-outline form-black mb-4">
                                            <input type="email" name="username" className="form-control form-control-lg" placeholder='Email or Employee Id' onChange={onHandleChange} value={username}/>

                                        </div>

                                        <div data-mdb-input-init className="form-outline form-black mb-4">
                                            <input type="password" name="password" className="form-control form-control-lg" placeholder='Password' onChange={onHandleChange} value={password}/>

                                        </div>

                                        <button className="btn btn-outline-secondary btn-lg px-5" type="submit" onClick={handleLogin}>Login</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

const mapStateToProps = (state) => ({
    error: state.error
})

const mapDispatchToProps = {
    fn_login_user
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
