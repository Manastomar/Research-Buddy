-- =====================================================================
-- Research Buddy - Microsoft SQL Server Database Schema
-- Compatible with SQL Server 2016+, 2019, 2022, and SQL Server Express
-- =====================================================================

-- Step 1: Create Database if it does not already exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'research_buddy_db')
BEGIN
    CREATE DATABASE [research_buddy_db];
END
GO

USE [research_buddy_db];
GO

-- Step 2: Create Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users' AND type = 'U')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(100) NOT NULL,
        email NVARCHAR(120) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table [users] created successfully.';
END
GO

-- Step 3: Create History Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'history' AND type = 'U')
BEGIN
    CREATE TABLE history (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NULL,
        tool_type NVARCHAR(50) NOT NULL,
        input_text NVARCHAR(MAX) NOT NULL,
        output_result NVARCHAR(MAX) NOT NULL,
        score NVARCHAR(50) NULL,
        created_at DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_history_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    PRINT 'Table [history] created successfully.';
END
GO
