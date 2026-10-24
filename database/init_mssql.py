import os
from pathlib import Path
import pyodbc
from dotenv import load_dotenv

# Locate .env in backend folder or current working directory
env_file = Path(__file__).resolve().parent.parent / "backend" / ".env"
if env_file.exists():
    load_dotenv(dotenv_path=env_file)
else:
    load_dotenv()

SERVER = os.getenv("MSSQL_SERVER", r"localhost\SQLEXPRESS")
DATABASE = os.getenv("MSSQL_DATABASE", "research_buddy_db")
DRIVER = os.getenv("MSSQL_DRIVER", "ODBC Driver 18 for SQL Server")
TRUSTED = os.getenv("MSSQL_TRUSTED_CONNECTION", "yes")

MASTER_CONN_STR = (
    f"DRIVER={{{DRIVER}}};"
    f"SERVER={SERVER};"
    f"DATABASE=master;"
    f"Trusted_Connection={TRUSTED};"
    f"TrustServerCertificate=yes;"
)

DB_CONN_STR = (
    f"DRIVER={{{DRIVER}}};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    f"Trusted_Connection={TRUSTED};"
    f"TrustServerCertificate=yes;"
)


def init_mssql():
    """Creates the MSSQL database and tables if not already present."""
    try:
        # Check and create database
        master_conn = pyodbc.connect(MASTER_CONN_STR, autocommit=True)
        master_cursor = master_conn.cursor()
        master_cursor.execute("SELECT name FROM sys.databases WHERE name = ?", (DATABASE,))
        if not master_cursor.fetchone():
            master_cursor.execute(f"CREATE DATABASE [{DATABASE}]")
            print(f"Database '{DATABASE}' created.")
        master_cursor.close()
        master_conn.close()

        # Check and create tables
        conn = pyodbc.connect(DB_CONN_STR, autocommit=True)
        cursor = conn.cursor()

        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users' AND type = 'U')
            BEGIN
                CREATE TABLE users (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    full_name NVARCHAR(100) NOT NULL,
                    email NVARCHAR(120) NOT NULL UNIQUE,
                    password_hash NVARCHAR(255) NOT NULL,
                    created_at DATETIME DEFAULT GETDATE()
                );
            END
        """)

        cursor.execute("""
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
            END
        """)

        cursor.close()
        conn.close()
        print(f"Database '{DATABASE}' and tables ('users', 'history') ready.")
        return True
    except Exception as err:
        print(f"Initialization error: {err}")
        return False


if __name__ == "__main__":
    init_mssql()
