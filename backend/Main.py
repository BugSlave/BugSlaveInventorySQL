from flask import Flask, jsonify, request
from AllAPIS.APIs import LoginInformation as li, ProductInformation as pi, SupplerCustomerInfo as sci
from AllAPIS.APIs import Purchase as po, Sales as so
from flask_cors import CORS
from functools import wraps
import jwt, os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRETKEY")

app = Flask(__name__)
CORS(app)

# ======================== TOKEN DECORATOR ========================
def token_requires(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('authToken')
        if not token:
            return jsonify({"errorCode":"-9999", 'errorName': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError as ex:
            return jsonify({"errorCode":"-9997", 'errorName': str(ex) + ' Token has expired'}), 401
        except jwt.InvalidTokenError as ex:
            return jsonify({"errorCode":"-9997", 'errorName': str(ex) + ' Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated

# ======================== MAIN ROUTE ========================
@app.route('/', methods=['GET'])
def main():
    return jsonify({"message": "Welcome to Household Management API"})

# ======================== LOGIN ROUTES ========================
@app.route('/api/loginuser', methods=['POST'])
def login_user():
    data = request.get_json()
    result = li().fnLoginUser(data)
    return jsonify(result)
# ======================== End ========================



# ======================== Product Information ========================
@app.route('/api/addcategory', methods=['POST'])
@token_requires
def main_add_category():
    data = request.get_json()
    result = pi().fnAddCateogies(data)
    return jsonify(result)


@app.route('/api/addproducts', methods=['POST'])
@token_requires
def main_add_products():
    data = request.get_json()
    result = pi().fnAddProducts(data)
    return jsonify(result)


@app.route('/api/showcategories', methods=['GET'])
@token_requires
def main_show_categories():
    result = pi().fnShowcategories()
    return jsonify(result)

@app.route('/api/showproducts', methods=['GET'])
@token_requires
def main_show_products():
    result = pi().fnShowProducts()
    return jsonify(result)
# ======================== End ========================

# ======================== Supplier and Customer Information ========================
@app.route('/api/addsupplier', methods=['POST'])
@token_requires
def main_add_supplier():
    data = request.get_json()
    result = sci().fnAddSupplier(data)
    return jsonify(result)

@app.route('/api/addcustomer', methods=['POST'])
@token_requires
def main_add_customer():
    data = request.get_json()
    result = sci().fnAddCustomer(data)
    return jsonify(result)


@app.route('/api/showcustomers', methods=['GET'])
@token_requires
def main_show_customers():
    result = sci().fnShowCustomers()
    return jsonify(result)

@app.route('/api/showsuppliers', methods=['GET'])
@token_requires
def main_show_suppliers():
    result = sci().fnShowSuppliers()
    return jsonify(result)
# ======================== End ========================


# ======================== Purchase Information ========================
@app.route('/api/addpurchaseorder', methods=['POST'])
@token_requires
def main_add_purchase_order():
    data = request.get_json()
    result = po().fnAddPurchaseOrder(data)
    return jsonify(result)
# ======================== End ========================

# ======================== Sales Information ========================

@app.route('/api/addsalesorder', methods=['POST'])
@token_requires
def main_add_sales_order():
    data = request.get_json()
    result = so().fnAddSalesOrder(data)
    return jsonify(result)
# ======================== End ========================

# ======================== RUN APP ========================
if __name__ == '__main__':
    app.run(host="192.168.1.42", port=5000, debug=True)
