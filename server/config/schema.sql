-- =============================================================================
-- NexBiz - Next-Generation Business Management Platform
-- MySQL Database DDL Schema (Production-Grade)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `nexbiz_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `nexbiz_db`;

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `leads`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Roles Table
-- Defines system RBAC hierarchy (Admin, Employee, Customer, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE,
  `permissions_json` JSON DEFAULT NULL COMMENT 'Structured permissions array/object',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default roles
INSERT INTO `roles` (`id`, `role_name`, `permissions_json`) VALUES
(1, 'Admin', '["*"]'),
(2, 'Employee', '["read:customers", "write:customers", "read:leads", "write:leads", "read:invoices", "read:products"]'),
(3, 'Customer', '["read:invoices", "read:profile"]');

-- -----------------------------------------------------------------------------
-- 2. Users Table
-- Central authentication credentials and basic profile information
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

-- -----------------------------------------------------------------------------
-- 3. Customers Table
-- CRM Customer directory details linked optionally to user login accounts
-- -----------------------------------------------------------------------------
CREATE TABLE `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL DEFAULT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `status` ENUM('Active', 'Inactive', 'Lead', 'Archived') NOT NULL DEFAULT 'Active',
  `lead_source` VARCHAR(100) DEFAULT 'Direct',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_customers_status` (`status`),
  INDEX `idx_customers_company` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Leads Table
-- Pipeline management tracking potential deal opportunities
-- -----------------------------------------------------------------------------
CREATE TABLE `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NULL DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `value` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Lead', 'Contacted', 'Qualified', 'Won', 'Lost') NOT NULL DEFAULT 'Lead',
  `follow_up_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_leads_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_leads_status` (`status`),
  INDEX `idx_leads_customer` (`customer_id`),
  INDEX `idx_leads_followup` (`follow_up_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Products Table
-- Product catalog & inventory stock levels
-- -----------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `low_stock_threshold` INT NOT NULL DEFAULT 10,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Invoices Table
-- Billing & invoicing for Indian SaaS context (includes GST calculation support)
-- -----------------------------------------------------------------------------
CREATE TABLE `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `gst_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled') NOT NULL DEFAULT 'Draft',
  `due_date` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_invoices_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_invoices_number` (`invoice_number`),
  INDEX `idx_invoices_customer` (`customer_id`),
  INDEX `idx_invoices_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Employees Table
-- HR directory records bound uniquely to user profiles
-- -----------------------------------------------------------------------------
CREATE TABLE `employees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `department` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `joining_date` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_employees_department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
