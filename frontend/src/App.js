import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Login from './component/Login';
import Navbar from './component/Navbar';
import LoadingBar from 'react-top-loading-bar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './component/Dashboard';
import HomePage from './component/Homepage';
import Categories from './component/Categories';
import Products from './component/Products';
import Supplier from './component/Supplier';
import Customer from './component/Customer';
import PurchaseOrder from './component/PurchaseOrder';
import SalesOrder from './component/SalesOrder';

function App() {

  const [progress, setProgress] = useState([])

  const [notify, setNotify] = useState([])

  const showAlert = (type, message) => {
    switch (type) {
      case 'info':
        return setNotify(toast.info(message))

      case 'error':
        return setNotify(toast.error(message))


      case 'success':
        return setNotify(toast.success(message))


      case 'warning':
        return setNotify(toast.warning(message))


      default:
        return setNotify(toast(message))
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    const maxSessionTime = 1 * 60 * 60 * 8000; // 1 hours in milliseconds

    if (token && loginTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(loginTime);

      if (timeElapsed > maxSessionTime) {
        // Token expired, clear storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('defaultBranch')
        // Optionally remove stored credentials too if not rememberMe

        window.location.href = '/'; // redirect to login page
      }
    }
  }, [])
  return (
    <>
      <Router>
        <ToastContainer notify={notify} closeOnClick stacked draggable></ToastContainer>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        ></LoadingBar>
        <Navbar></Navbar>
        <Routes>
          <Route exact path='/' element={<Login showAlert={showAlert}></Login>}></Route>
          <Route exact path='/home' element={<HomePage setProgress={setProgress}></HomePage>}></Route>
          <Route exact path='/dashboard' element={<Dashboard setProgress={setProgress}></Dashboard>}></Route>
          <Route exact path="/categories" element={<Categories setProgress={setProgress} showAlert={showAlert}></Categories>}></Route>
          <Route exact path="/products" element={<Products setProgress={setProgress} showAlert={showAlert}></Products>}></Route>
          <Route exact path="/supplier" element={<Supplier setProgress={setProgress} showAlert={showAlert}></Supplier>}></Route>
          <Route exact path="/customer" element={<Customer setProgress={setProgress} showAlert={showAlert}></Customer>}></Route>
          <Route exact path="/purchaseorder" element={<PurchaseOrder setProgress={setProgress} showAlert={showAlert}></PurchaseOrder>}></Route>
          <Route exact path="/salesorder" element={<SalesOrder setProgress={setProgress} showAlert={showAlert}></SalesOrder>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
