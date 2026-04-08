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
        return self.cursor.fetchall()

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


    def fnUpdateCateogies(self, data):
        try:
            return self.execute_sp("EXEC Sp_UpdateCategories ?", self._json_param(data))
        except Exception as e:
            return self._handle_error("895", "fnUpdateCateogies", e)
        finally:
            self.close()

    def fnUpdateProducts(self, data):
        try:
            return self.execute_sp("EXEC Sp_UpdateProducts ?", self._json_param(data))
        except Exception as e:
            return self._handle_error("894", "fnUpdateProducts", e)
        finally:
            self.close()


    def fnShowProductById(self, data):
        try:
            return self.execute_sp("EXEC Sp_ShowProductById ?", (data.get('productId')))
        except Exception as e:
            return self._handle_error("893", "fnShowProductById", e)
        finally:
            self.close()
    
    def fnShowInventoryReportSummary(self, data):
        try:
            return self.execute_sp("EXEC Sp_InventoryTransaction ?, ?, ?",(data.get('dateFrom'), data.get('dateTo'), data.get('productId')))
        except Exception as e:
            return self._handle_error("892", "fnShowInventoryReportSummary", e)
        finally:
            self.close()


    def fnShowInventoryReportDetails(self, data):
        try:
            return self.execute_sp("EXEC Sp_InventoryTransactionDetails ?, ?, ?",(data.get('dateFrom'), data.get('dateTo'), data.get('productId')))
        except Exception as e:
            return self._handle_error("891", "fnShowInventoryReportDetails", e)
        finally:
            self.close()


    def fnShowItemBatch (self, data):
        try:
            return self.execute_sp("EXEC Sp_ShowItemBatch ?, ?, ?, ?",(data.get('productId'), data.get('batchName'),data.get('documentId'), data.get('documentName')))
        except Exception as e:
            return self._handle_error("890", "fnShowItemBatch", e)
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


    def fnUpdateCustomer(self, data):
        try:
            customer_name = data.get("customerName")
            contact_name = data.get("contactName")
            email = data.get("email")
            phone = data.get("phone")
            address = data.get("addresses")
            id= data.get("id")
            return self.execute_sp("EXEC Sp_UpdateCustomer ?,?,?,?,?, ?", (customer_name, contact_name,  phone, email, address, id))
        except Exception as e:
            return self._handle_error("795", "fnUpdateCustomer", e)
        finally:
            self.close()


    def fnUpdateSupplier(self, data):
        try:
            customer_name = data.get("supplierName")
            contact_name = data.get("contactName")
            email = data.get("email")
            phone = data.get("phone")
            address = data.get("addresses")
            id = data.get("id")
            return self.execute_sp("EXEC Sp_UpdateSuppliers ?,?,?,?,?, ?", (customer_name, contact_name,  phone, email, address, id))
        except Exception as e:
            return self._handle_error("794", "fnUpdateSupplier", e)
        finally:
            self.close()

#============================== Purchase Information ==============================
class Purchase(BaseRepository):
    def fnAddPurchaseOrder(self, data):
        try:
            return self.execute_sp("EXEC Sp_AddPurchaseOrder ?", (self._json_param(data)))
        except Exception as e:
            return self._handle_error("699", "fnAddPurchaseOrder", e)
        finally:
            self.close()


    def fnShowPurchaseOrder(self):
        try:
            return self.execute_sp("SELECT * FROM IMS_PurchaseOrder")
        except Exception as e:
            return self._handle_error("698", "fnShowPurchaseOrder", e)
        finally:
            self.close()


    def fnShowPurchaseOrderReport(self, data):
        try:
            return self.execute_sp("EXEC Sp_PurchaseOrderReport ?, ? ",(data.get('dateFrom'), data.get('dateTo')))
        except Exception as e:
            return self._handle_error("697", "fnShowPurchaseOrderReport", e)
        finally:
            self.close()


    def fnShowPurchaseOrderDetailReport(self, data):
        try:
            return self.execute_sp("EXEC Sp_PurchaseOrderDetailReport ? ",(data.get('documentId')))
        except Exception as e:
            return self._handle_error("696", "fnShowPurchaseOrderDetailReport", e)
        finally:
            self.close()

    def fnShowPurchaseItemDetails(self, data):
        try:
            return self.execute_sp("EXEC Sp_ShowPurchaseItemDetails ? ",(data.get('documentId')))
        except Exception as e:
            return self._handle_error("695", "fnShowPurchaseItemDetails", e)
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
            batch_name = data.get("batchName")
            in_stock = data.get("inStock")
            last_pur_price = data.get("lastPurPrice")
            return self.execute_sp("EXEC Sp_AddSalesOrder ?,?,?,?, ?, ?, ?", (customer_id, product_Id, quantity, unit_price, batch_name, in_stock, last_pur_price))
        except Exception as e:
            return self._handle_error("599", "fnAddCustomer", e)
        finally:
            self.close()


    def fnShowSalesOrder(self):
        try:
            return self.execute_sp("SELECT * FROM IMS_SalesOrder")
        except Exception as e:
            return self._handle_error("598", "fnShowSalesOrder", e)
        finally:
            self.close()

    
    def fnShowSalesOrderReport(self, data):
        try:
            return self.execute_sp("EXEC Sp_SalesOrderReport ?, ? ",(data.get('dateFrom'), data.get('dateTo')))
        except Exception as e:
            return self._handle_error("597", "fnShowSalesOrderReport", e)
        finally:
            self.close()


    def fnShowSalesOrderDetailReport(self, data):
        try:
            return self.execute_sp("EXEC Sp_SalesOrderDetailReport ? ",(data.get('documentId')))
        except Exception as e:
            return self._handle_error("596", "fnShowSalesOrderDetailReport", e)
        finally:
            self.close()
