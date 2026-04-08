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
import InventoryTransaction from './component/InventoryTransaction';
import PurchaseOrderReport from './component/PurchaseOrderReport';
import SalesOrderReport from './component/SalesOrderReport';

import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";


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
      <div
        style={{
          minHeight: "calc(100vh - 00px)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Router>
          <ToastContainer notify={notify} closeOnClick stacked draggable />

          <LoadingBar
            color="#f11946"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
          />

          <Navbar />

          <div style={{ flex: 1 }}>
            <Routes>
              <Route path='/' element={<Login showAlert={showAlert} />} />
              <Route path='/home' element={<HomePage setProgress={setProgress} />} />
              <Route path='/dashboard' element={<Dashboard setProgress={setProgress} />} />
              <Route path="/categories" element={<Categories setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/products" element={<Products setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/supplier" element={<Supplier setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/customer" element={<Customer setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/purchaseorder" element={<PurchaseOrder setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/salesorder" element={<SalesOrder setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/inventorytransaction" element={<InventoryTransaction setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/purchaseorderreport" element={<PurchaseOrderReport setProgress={setProgress} showAlert={showAlert} />} />
              <Route path="/salesorderreport" element={<SalesOrderReport setProgress={setProgress} showAlert={showAlert} />} />
            </Routes>
          </div>

          <footer
            style={{
              textAlign: "center",
              padding: "10px 6px",
              borderTop: "1px solid #e5e7eb"
            }}
          >
            <h6 style={{ margin: "0 0 4px 0", fontWeight: "500" }}>
              © 2026 <span style={{ color: "#6366f1" }}>BugSlave</span>
            </h6>

            <div className="d-flex justify-content-center gap-2 flex-wrap">

              {/* Subscribe */}
              <a
                href="https://www.youtube.com/@BugSlave?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-1 social-btn youtube-glow"
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "#ef4444",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                <FaYoutube /> Subscribe
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/_bugslave/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-1 social-btn instagram-glow"
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "#f3f4f6",
                  color: "#111",
                  textDecoration: "none",
                  fontSize: "12px"
                }}
              >
                <FaInstagram color="#E1306C" /> Instagram
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61583733376189"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-1 social-btn facebook-glow"
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "#f3f4f6",
                  color: "#111",
                  textDecoration: "none",
                  fontSize: "12px"
                }}
              >
                <FaFacebook color="#1877F2" /> Facebook
              </a>

            </div>
          </footer>
        </Router>
      </div>
    </>
  );
}

export default App;
