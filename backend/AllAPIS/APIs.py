import pyodbc, os, hashlib, jwt, json
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

SERVERNAME = os.getenv("SERVERNAME")
DATABASENAME = os.getenv("DATABASENAME")
UID = os.getenv("UID")
PWD = os.getenv("PWD")
SECRETKEY = os.getenv("SECRETKEY")
pyodbc.pooling = True 


# ===================== CONNECTION POOL =====================

class DBConnectionPool:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_pool()
        return cls._instance

    def _init_pool(self):
        self.connection_string = (
            f"DRIVER={{SQL Server Native Client 11.0}};"
            f"SERVER={SERVERNAME};"
            f"DATABASE={DATABASENAME};"
            f"UID={UID};"
            f"PWD={PWD};"
        )

    def get_connection(self):
        return pyodbc.connect(self.connection_string)


# ===================== BASE REPOSITORY =====================

class BaseRepository:
    def __init__(self):
        self.conn = DBConnectionPool().get_connection()
        self.cursor = self.conn.cursor()

    def fetch_as_dict(self):
        data = self.cursor.fetchall()
        columns = [column[0] for column in self.cursor.description]
        return [dict(zip(columns, row)) for row in data]

    def execute_sp(self, query, params=None):
        self.cursor.execute(query, params or ())
        return self.fetch_as_dict()

    def execute_raw(self, query, params=None):
        self.cursor.execute(query, params or ())
        return self.fetch_as_dict()

    def _handle_error(self, code, method_name, e):
        return [{"errorCode": code, "errorMessage": f"{method_name} {str(e)}"}]

    def _json_param(self, data):
        return data if isinstance(data, str) else json.dumps(data)

    def close(self):
        self.conn.commit()
        self.cursor.close()
        self.conn.close()  # Returns connection to pool automatically

class LoginInformation(BaseRepository):
    def fnLoginUser(self, data):
        try:
            username = data.get("username")
            pwd = hashlib.sha256(data.get("password").encode()).hexdigest()
            self.cursor.execute("EXEC Tmsp_LoginUser ?, ?", (username, pwd))
            result = self.cursor.fetchall()

            start_date = datetime.now()
            end_date = start_date + timedelta(hours=8)

            for rows in result:
                if rows[5] == 0:
                    token = jwt.encode({
                        'exp': end_date,
                        'tokenUserId': rows[0],
                        'tokenUserCode': rows[1],
                        'tokenUserName': rows[2],
                        'tokenEmailId': rows[3],
                        'tokenIsAdmin': rows[4]
                    }, SECRETKEY, algorithm='HS256')
                    return {"errorCode": 0, "token": token, "userId": rows[0]}
                else:
                    return {"errorCode": rows[5], "token": rows[2], "userId": rows[0]}
        except Exception as e:
            return self._handle_error("999", "fnLoginUser", e)
        finally:
            self.close()


#============================== Product Information ==============================
class ProductInformation(BaseRepository):
    def fnAddCateogies(self, data):
        try:
            return self.execute_sp("EXEC Sp_AddCategories ?", self._json_param(data))
        except Exception as e:
            return self._handle_error("899", "fnAddCateogies", e)
        finally:
            self.close()

    def fnAddProducts(self, data):
        try:
            return self.execute_sp("EXEC Sp_AddProducts ?", self._json_param(data))
        except Exception as e:
            return self._handle_error("898", "fnAddProducts", e)
        finally:
            self.close()

    def fnShowcategories(self):
        try:
            return self.execute_sp("SELECT * FROM IMS_AllCategories")
        except Exception as e:
            return self._handle_error("897", "fnShowcategories", e)
        finally:
            self.close()


    def fnShowProducts(self):
        try:
            return self.execute_sp("SELECT * FROM IMS_Products")
        except Exception as e:
            return self._handle_error("896", "fnShowProducts", e)
        finally:
            self.close()


#============================== Supplier and Customer Information ==============================
class SupplerCustomerInfo(BaseRepository):
    def fnAddSupplier(self, data):
        try:
            supplier_name = data.get("supplierName")
            contact_name = data.get("contactName")
            email = data.get("email")
            phone = data.get("phone")
            address = data.get("addresses")
            return self.execute_sp("EXEC Sp_AddSuppliers ?,?,?,?,?", (supplier_name, contact_name, email, phone, address))
        except Exception as e:
            return self._handle_error("799", "fnAddSupplier", e)
        finally:
            self.close()

    def fnAddCustomer(self, data):
        try:
            customer_name = data.get("customerName")
            contact_name = data.get("contactName")
            email = data.get("email")
            phone = data.get("phone")
            address = data.get("addresses")
            return self.execute_sp("EXEC Sp_AddCustomer ?,?,?,?,?", (customer_name, contact_name,  phone, email, address))
        except Exception as e:
            return self._handle_error("798", "fnAddCustomer", e)
        finally:
            self.close()


    def fnShowCustomers(self):
        try:
            return self.execute_sp("SELECT * FROM IMS_Customers")
        except Exception as e:
            return self._handle_error("797", "fnShowCustomers", e)
        finally:
            self.close()


    def fnShowSuppliers(self):
        try:
            return self.execute_sp("SELECT * FROM IMS_Supliers")
        except Exception as e:
            return self._handle_error("796", "fnShowSuppliers", e)
        finally:
            self.close()

#============================== Purchase Information ==============================
class Purchase(BaseRepository):
    def fnAddPurchaseOrder(self, data):
        try:
            supplier_id = data.get("supplierId")
            product_Id = data.get("productId")
            quantity = data.get("quantity")
            unit_price = data.get("unitPrice")
            return self.execute_sp("EXEC Sp_AddPurchaseOrder ?,?,?,?", (supplier_id, product_Id, quantity, unit_price))
        except Exception as e:
            return self._handle_error("699", "fnAddPurchaseOrder", e)
        finally:
            self.close()

#============================== Sales Information ==============================
class Sales(BaseRepository):
    def fnAddSalesOrder(self, data):
        try:
            customer_id = data.get("customerId")
            product_Id = data.get("productId")
            quantity = data.get("quantity")
            unit_price = data.get("unitPrice")
            return self.execute_sp("EXEC Sp_AddSalesOrder ?,?,?,?", (customer_id, product_Id, quantity, unit_price))
        except Exception as e:
            return self._handle_error("599", "fnAddCustomer", e)
        finally:
            self.close()