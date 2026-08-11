-- =============================================================================
-- NexBiz - Next-Generation Business Management Platform
-- Complete Production Database DDL & Seed Script
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `nexbiz_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `nexbiz_db`;

-- Disable foreign key checks during reset
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `payroll_runs`;
DROP TABLE IF EXISTS `stock_movements`;
DROP TABLE IF EXISTS `transactions_ledger`;
DROP TABLE IF EXISTS `invoice_items`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `leads`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Roles Table
-- -----------------------------------------------------------------------------
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE,
  `permissions_json` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `role_name`, `permissions_json`) VALUES
(1, 'Admin', '["*"]'),
(2, 'Employee', '["read:customers", "write:customers", "read:leads", "write:leads", "read:invoices", "read:products"]'),
(3, 'Customer', '["read:invoices", "read:profile"]');

-- -----------------------------------------------------------------------------
-- 2. Users Table
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role_id`) VALUES
(1, 'Rajesh Sharma', 'admin@nexbiz.in', '$2b$10$e7W...hashPlaceholder', 1),
(2, 'Priya Patel', 'priya.patel@nexbiz.in', '$2b$10$e7W...hashPlaceholder', 2),
(3, 'Amit Verma', 'amit.verma@techsolutions.in', '$2b$10$e7W...hashPlaceholder', 3),
(4, 'Sneha Rao', 'sneha.rao@nexbiz.in', '$2b$10$e7W...hashPlaceholder', 2);

-- -----------------------------------------------------------------------------
-- 3. Customers Table
-- -----------------------------------------------------------------------------
CREATE TABLE `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL DEFAULT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `contact_person` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `status` ENUM('Active', 'Inactive', 'Lead', 'Archived') NOT NULL DEFAULT 'Active',
  `lead_source` VARCHAR(100) DEFAULT 'Direct',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_customers_status` (`status`),
  INDEX `idx_customers_company` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `customers` (`id`, `user_id`, `company_name`, `contact_person`, `phone`, `email`, `address`, `status`, `lead_source`) VALUES
(1, 3, 'TechSolutions India Pvt Ltd', 'Amit Verma', '+91 98765 43210', 'amit.verma@techsolutions.in', 'Indiranagar, Bengaluru, Karnataka 560038', 'Active', 'Website'),
(2, NULL, 'Apex Enterprises', 'Sunil Mehta', '+91 98123 45678', 'contact@apexent.in', 'BKC, Mumbai, Maharashtra 400051', 'Active', 'Referral'),
(3, NULL, 'Bharat Retail Chain', 'Deepak Gupta', '+91 97111 22334', 'procurement@bharatretail.co.in', 'Connaught Place, New Delhi 110001', 'Lead', 'LinkedIn'),
(4, NULL, 'Kaveri Logistics', 'Rohan Kaveri', '+91 94444 55666', 'rohan@kaverilogistics.com', 'T. Nagar, Chennai, Tamil Nadu 600017', 'Active', 'Direct');

-- -----------------------------------------------------------------------------
-- 4. Leads Pipeline Table (Kanban Board)
-- -----------------------------------------------------------------------------
CREATE TABLE `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NULL DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `value` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Lead', 'Contacted', 'Qualified', 'Won', 'Lost') NOT NULL DEFAULT 'Lead',
  `contact_email` VARCHAR(150) DEFAULT NULL,
  `contact_phone` VARCHAR(20) DEFAULT NULL,
  `follow_up_date` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_leads_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_leads_status` (`status`),
  INDEX `idx_leads_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `leads` (`id`, `customer_id`, `title`, `value`, `status`, `contact_email`, `contact_phone`, `follow_up_date`, `notes`) VALUES
(1, 1, 'Enterprise SaaS License Upgrade (500 users)', 450000.00, 'Qualified', 'amit.verma@techsolutions.in', '+91 98765 43210', '2026-08-15', 'Negotiating annual billing terms.'),
(2, 2, 'Cloud ERP Implementation Phase 2', 820000.00, 'Contacted', 'contact@apexent.in', '+91 98123 45678', '2026-08-18', 'Sent technical proposal.'),
(3, 3, 'Retail POS & Inventory Software', 320000.00, 'Lead', 'procurement@bharatretail.co.in', '+91 97111 22334', '2026-08-20', 'Inbound inquiry from landing page.'),
(4, 4, 'Logistics Tracking Portal Integration', 650000.00, 'Won', 'rohan@kaverilogistics.com', '+91 94444 55666', '2026-08-01', 'Contract signed, invoice generated.'),
(5, NULL, 'Smart Warehouse Sensors Trial', 180000.00, 'Lost', 'vendor@logismart.in', '+91 93333 44455', '2026-07-25', 'Budget frozen till Q4.');

-- -----------------------------------------------------------------------------
-- 5. Products Table (Inventory)
-- -----------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Hardware',
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `low_stock_threshold` INT NOT NULL DEFAULT 10,
  `unit` VARCHAR(20) DEFAULT 'Pcs',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `sku`, `name`, `category`, `price`, `stock_quantity`, `low_stock_threshold`, `unit`) VALUES
(1, 'SKU-NEX-001', 'Enterprise Cloud Gateway Terminal', 'Hardware', 14500.00, 42, 10, 'Units'),
(2, 'SKU-NEX-002', 'Smart Thermal Invoice Printer', 'Peripherals', 6800.00, 4, 15, 'Pcs'),
(3, 'SKU-NEX-003', 'Wireless Barcode Scanner 2D', 'Peripherals', 3200.00, 8, 12, 'Pcs'),
(4, 'SKU-NEX-004', 'NexBiz SaaS Annual License Code', 'Software', 49999.00, 150, 20, 'Keys'),
(5, 'SKU-NEX-005', 'IoT Warehouse Tracking Hub', 'Hardware', 28500.00, 3, 10, 'Units');

-- -----------------------------------------------------------------------------
-- 6. Stock Movements Log Table
-- -----------------------------------------------------------------------------
CREATE TABLE `stock_movements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `movement_type` ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
  `quantity` INT NOT NULL,
  `reference` VARCHAR(100) DEFAULT NULL,
  `notes` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_stock_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `stock_movements` (`product_id`, `movement_type`, `quantity`, `reference`, `notes`) VALUES
(1, 'IN', 50, 'PO-2026-081', 'Received initial manufacturer shipment'),
(2, 'OUT', 6, 'INV-2026-101', 'Dispatched to TechSolutions India'),
(3, 'OUT', 4, 'INV-2026-102', 'Dispatched to Kaveri Logistics'),
(5, 'ADJUSTMENT', -2, 'AUDIT-08', 'Damaged in transit audit');

-- -----------------------------------------------------------------------------
-- 7. Invoices Table
-- -----------------------------------------------------------------------------
CREATE TABLE `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `gst_rate` DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
  `gst_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled') NOT NULL DEFAULT 'Sent',
  `due_date` DATE NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_invoices_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_invoices_number` (`invoice_number`),
  INDEX `idx_invoices_customer` (`customer_id`),
  INDEX `idx_invoices_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `invoices` (`id`, `invoice_number`, `customer_id`, `subtotal`, `gst_rate`, `gst_amount`, `discount_amount`, `total_amount`, `status`, `due_date`, `notes`) VALUES
(1, 'INV-2026-001', 1, 100000.00, 18.00, 18000.00, 5000.00, 113000.00, 'Paid', '2026-08-05', 'Annual SaaS subscription advance payment.'),
(2, 'INV-2026-002', 2, 250000.00, 18.00, 45000.00, 0.00, 295000.00, 'Sent', '2026-08-25', 'Phase 1 Cloud ERP setup fee.'),
(3, 'INV-2026-003', 4, 150000.00, 18.00, 27000.00, 2000.00, 175000.00, 'Overdue', '2026-08-01', 'Logistics Portal integration milestone 1.');

-- -----------------------------------------------------------------------------
-- 8. Invoice Line Items Table
-- -----------------------------------------------------------------------------
CREATE TABLE `invoice_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `description` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT `fk_items_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `invoice_items` (`invoice_id`, `product_id`, `description`, `quantity`, `unit_price`, `amount`) VALUES
(1, 4, 'NexBiz SaaS Annual License Code', 2, 49999.00, 99998.00),
(2, 1, 'Enterprise Cloud Gateway Terminal', 10, 14500.00, 145000.00),
(2, 5, 'IoT Warehouse Tracking Hub', 3, 28500.00, 85500.00),
(3, 3, 'Wireless Barcode Scanner 2D', 20, 3200.00, 64000.00);

-- -----------------------------------------------------------------------------
-- 9. Transactions Ledger (Razorpay Payment Log)
-- -----------------------------------------------------------------------------
CREATE TABLE `transactions_ledger` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `razorpay_order_id` VARCHAR(100) DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(100) DEFAULT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'UPI / Card / NetBanking',
  `status` ENUM('Completed', 'Pending', 'Failed') NOT NULL DEFAULT 'Completed',
  `payment_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ledger_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `transactions_ledger` (`invoice_id`, `transaction_ref`, `razorpay_order_id`, `razorpay_payment_id`, `amount`, `payment_method`, `status`) VALUES
(1, 'TXN-RZP-90812', 'order_Nxb901823', 'pay_Nxb901823_001', 113000.00, 'UPI (Razorpay)', 'Completed');

-- -----------------------------------------------------------------------------
-- 10. Employees Table
-- -----------------------------------------------------------------------------
CREATE TABLE `employees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `employee_code` VARCHAR(20) NOT NULL UNIQUE,
  `department` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `base_salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `joining_date` DATE NOT NULL,
  `bank_account_no` VARCHAR(50) DEFAULT NULL,
  `ifsc_code` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_employees_department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `base_salary`, `joining_date`, `bank_account_no`, `ifsc_code`) VALUES
(1, 1, 'NEX-EMP-001', 'Executive', 'Chief Executive Officer', 185000.00, '2024-01-15', '91800012345678', 'HDFC0000123'),
(2, 2, 'NEX-EMP-002', 'Sales & CRM', 'Senior Account Executive', 75000.00, '2024-06-01', '91800098765432', 'ICIC0000456'),
(3, 4, 'NEX-EMP-003', 'Customer Success', 'Technical Support Lead', 65000.00, '2025-02-10', '91800055544433', 'SBIN0000789');

-- -----------------------------------------------------------------------------
-- 11. Payroll Runs Table
-- -----------------------------------------------------------------------------
CREATE TABLE `payroll_runs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `year` INT NOT NULL,
  `base_salary` DECIMAL(12, 2) NOT NULL,
  `bonus` DECIMAL(12, 2) DEFAULT 0.00,
  `deductions` DECIMAL(12, 2) DEFAULT 0.00,
  `net_salary` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('Pending', 'Processed', 'Paid') NOT NULL DEFAULT 'Paid',
  `payment_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payroll_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `payroll_runs` (`employee_id`, `month`, `year`, `base_salary`, `bonus`, `deductions`, `net_salary`, `status`, `payment_date`) VALUES
(1, 'July', 2026, 185000.00, 15000.00, 18500.00, 181500.00, 'Paid', '2026-07-31'),
(2, 'July', 2026, 75000.00, 8000.00, 7500.00, 75500.00, 'Paid', '2026-07-31'),
(3, 'July', 2026, 65000.00, 2000.00, 6500.00, 60500.00, 'Paid', '2026-07-31');
