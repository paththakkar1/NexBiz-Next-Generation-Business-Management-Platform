# NexBiz - REST API Specification (v1)

This documentation defines the REST API endpoints, parameters, payloads, and response structures for the NexBiz platform. All endpoints are prefixed with `/api/v1`.

---

## 1. Global Specifications

- **Content-Type**: `application/json`
- **Authentication**: JWT sent via HTTP-Only Secure Cookie `token` (automatically parsed by backend middleware).
- **Standard Success Response**: `200 OK` or `201 Created` with a wrapper object:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Standard Error Response**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, or `500 Server Error`:
  ```json
  {
    "success": false,
    "error": "Error details or validation message string"
  }
  ```

---

## 2. API Endpoints Reference

### 2.1 Authentication & Profile (`/auth`)

#### `POST /auth/register`
- **Description**: Registers a new business tenant and owner user.
- **Access**: Public
- **Request Payload**:
  ```json
  {
    "businessName": "Acme Corp",
    "name": "Jane Doe",
    "email": "jane@acme.com",
    "password": "SecurePassword123"
  }
  ```
- **Response**: `201 Created` with created user (excluding password hash) and business tenant metadata.

#### `POST /auth/login`
- **Description**: Authenticates user and sets JWT cookie.
- **Access**: Public
- **Request Payload**:
  ```json
  {
    "email": "jane@acme.com",
    "password": "SecurePassword123"
  }
  ```
- **Response**: `200 OK` returning user info. JWT is set in an HTTP-Only secure cookie.

#### `POST /auth/logout`
- **Description**: Standard logout, invalidates token cookie.
- **Access**: Authorized (All roles)
- **Response**: `200 OK`

#### `GET /auth/profile`
- **Description**: Fetches current user profile and role specifications.
- **Access**: Authorized (All roles)
- **Response**: `200 OK` returning details of the logged-in user.

---

### 2.2 CRM & Lead Management (`/crm` / `/leads`)

#### `GET /crm/customers`
- **Description**: Lists all customer profiles associated with the tenant business.
- **Access**: Owner, Manager, Employee
- **Query Params**: `page`, `limit`, `search`
- **Response**: List of customer objects.

#### `POST /crm/customers`
- **Description**: Adds a new customer record.
- **Access**: Owner, Manager, Employee
- **Request Payload**:
  ```json
  {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+919876543210",
    "companyName": "TechSolutions Ltd",
    "address": "123 Business Hub, Bangalore"
  }
  ```

#### `GET /leads`
- **Description**: Retrieves leads and active pipeline deals.
- **Access**: Owner, Manager, Employee

#### `PATCH /leads/:id/status`
- **Description**: Updates deal stages along the sales pipeline.
- **Access**: Owner, Manager, Employee
- **Request Payload**:
  ```json
  {
    "status": "Qualified"
  }
  ```

---

### 2.3 Inventory Management (`/inventory` / `/products`)

#### `GET /products`
- **Description**: Retrieves catalogue of products. Supports SKU search.
- **Access**: Owner, Manager, Employee

#### `POST /products`
- **Description**: Registers a new product SKU.
- **Access**: Owner, Manager
- **Request Payload**:
  ```json
  {
    "categoryId": 2,
    "supplierId": 1,
    "sku": "SKU-PROD-A01",
    "name": "Steel Bolt M8",
    "description": "High tensile carbon steel bolt",
    "price": 25.50,
    "reorderLevel": 50
  }
  ```

#### `GET /inventory/low-stock`
- **Description**: Queries product lines where current inventory stock levels are lower than the reorder levels.
- **Access**: Owner, Manager, Employee

#### `PATCH /inventory/:productId/restock`
- **Description**: Logs incoming product stock from suppliers.
- **Access**: Owner, Manager
- **Request Payload**:
  ```json
  {
    "quantityAdded": 100
  }
  ```

---

### 2.4 Invoice & Razorpay Payments (`/invoices` / `/payments`)

#### `POST /invoices`
- **Description**: Generates a new invoice ledger.
- **Access**: Owner, Manager
- **Request Payload**:
  ```json
  {
    "customerId": 5,
    "dueDate": "2026-08-30",
    "subtotal": 1200.00,
    "taxRate": 18.00,
    "discountAmount": 100.00,
    "items": [
      { "productId": 1, "quantity": 10, "unitPrice": 100.00 },
      { "productId": 2, "quantity": 4, "unitPrice": 50.00 }
    ]
  }
  ```

#### `POST /payments/create-order`
- **Description**: Generates an active Razorpay Order mapping to an invoice.
- **Access**: Customer, Owner, Manager
- **Request Payload**:
  ```json
  {
    "invoiceId": 102
  }
  ```
- **Response**: Razorpay Order details mapping `id` and `amount` to execute checkout scripts.

#### `POST /payments/verify`
- **Description**: Cryptographically verifies the payment credentials captured from the Razorpay checkout redirect.
- **Access**: Customer, Owner, Manager
- **Request Payload**:
  ```json
  {
    "razorpayPaymentId": "pay_O1Xy9zQwert",
    "razorpayOrderId": "order_F2b9kLmnOp",
    "razorpaySignature": "bc34ef56aef7890..."
  }
  ```

#### `POST /payments/webhook`
- **Description**: Webhook listener mapping updates directly from Razorpay.
- **Access**: Public (Verifies signature header `X-Razorpay-Signature`)

---

### 2.5 Employees & Payroll (`/employees` / `/payroll`)

#### `GET /employees`
- **Description**: Lists registered staff.
- **Access**: Owner, Manager

#### `POST /attendance/check-in`
- **Description**: Logs start of employee shift.
- **Access**: Employee, Manager, Owner
- **Request Payload**: `{}` (timestamps recorded by server)

#### `POST /payroll/generate-period`
- **Description**: Runs payroll calculator matching attendance datasets for a defined date range.
- **Access**: Owner
- **Request Payload**:
  ```json
  {
    "startDate": "2026-07-01",
    "endDate": "2026-07-31"
  }
  ```

---

### 2.6 AI Recommendations & Insights (`/recommendations`)

#### `GET /recommendations/insights`
- **Description**: Fetches current recommendations (stock restocking triggers, customer sales forecasts) generated by Scikit-Learn.
- **Access**: Owner, Manager

#### `POST /recommendations/trigger-ml`
- **Description**: Triggers Express to call the Flask AI microservice to rebuild/retrain models on current datasets and write updated insights.
- **Access**: Owner
- **Response**: `200 OK` showing prediction count.
