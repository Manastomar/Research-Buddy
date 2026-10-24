import os
import hashlib
from pathlib import Path
from dotenv import load_dotenv
import pyodbc

# Locate .env in backend folder or current working directory
env_file = Path(__file__).resolve().parent.parent / "backend" / ".env"
if env_file.exists():
    load_dotenv(dotenv_path=env_file)
else:
    load_dotenv()

MSSQL_SERVER = os.getenv("MSSQL_SERVER", r"localhost\SQLEXPRESS")
MSSQL_DATABASE = os.getenv("MSSQL_DATABASE", "research_buddy_db")
MSSQL_DRIVER = os.getenv("MSSQL_DRIVER", "ODBC Driver 18 for SQL Server")
MSSQL_USER = os.getenv("MSSQL_USER", "")
MSSQL_PASSWORD = os.getenv("MSSQL_PASSWORD", "")
MSSQL_TRUSTED = os.getenv("MSSQL_TRUSTED_CONNECTION", "yes")


def hash_password(password):
    """Generates SHA-256 hash for secure password storage."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def get_connection_string(database_name=None):
    """Constructs the ODBC connection string for SQL Server."""
    parts = [
        f"DRIVER={{{MSSQL_DRIVER}}}",
        f"SERVER={MSSQL_SERVER}",
        f"DATABASE={database_name if database_name else 'master'}",
        "TrustServerCertificate=yes"
    ]
    if MSSQL_USER and MSSQL_PASSWORD:
        parts.append(f"UID={MSSQL_USER}")
        parts.append(f"PWD={MSSQL_PASSWORD}")
    else:
        parts.append(f"Trusted_Connection={MSSQL_TRUSTED}")

    return ";".join(parts) + ";"


def get_db_connection(use_database=True):
    """Establishes an autocommit pyodbc connection."""
    db_name = MSSQL_DATABASE if use_database else "master"
    conn_str = get_connection_string(db_name)
    return pyodbc.connect(conn_str, autocommit=True)


def row_to_dict(cursor, row):
    """Converts a database row into a JSON-serializable dictionary."""
    if not row:
        return None
    columns = [column[0] for column in cursor.description]
    data = dict(zip(columns, row))
    for k, v in data.items():
        if hasattr(v, "strftime"):
            data[k] = v.strftime("%Y-%m-%d %H:%M:%S")
    return data


def init_db():
    """Initializes the database and creates tables if they do not exist."""
    try:
        # Check and create database
        master_conn = get_db_connection(use_database=False)
        master_cursor = master_conn.cursor()
        master_cursor.execute("SELECT name FROM sys.databases WHERE name = ?", (MSSQL_DATABASE,))
        exists = master_cursor.fetchone()

        if not exists:
            master_cursor.execute(f"CREATE DATABASE [{MSSQL_DATABASE}]")
            print(f"[Database] Created database '{MSSQL_DATABASE}'.")

        master_cursor.close()
        master_conn.close()

        # Connect to database and create tables
        conn = get_db_connection(use_database=True)
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
        return True

    except Exception as e:
        print(f"[Database Error] Initialization failed: {e}")
        return False


def register_user(full_name, email, password):
    """Registers a new user account."""
    email = email.strip().lower()
    full_name = full_name.strip()

    if not full_name or not email or not password:
        return {"success": False, "error": "All fields are required."}

    if len(password) < 6:
        return {"success": False, "error": "Password must be at least 6 characters."}

    password_hashed = hash_password(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return {"success": False, "error": "An account with this email already exists."}

        cursor.execute(
            "INSERT INTO users (full_name, email, password_hash) OUTPUT INSERTED.id VALUES (?, ?, ?)",
            (full_name, email, password_hashed)
        )
        row = cursor.fetchone()
        new_id = row[0] if row else None

        cursor.close()
        conn.close()

        return {
            "success": True,
            "user": {
                "id": new_id,
                "full_name": full_name,
                "email": email
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Database error: {str(e)}"}


def login_user(email, password):
    """Authenticates user credentials."""
    email = email.strip().lower()

    if not email or not password:
        return {"success": False, "error": "Email and password are required."}

    password_hashed = hash_password(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, full_name, email, password_hash FROM users WHERE email = ?",
            (email,)
        )
        row = cursor.fetchone()
        user = row_to_dict(cursor, row)
        cursor.close()
        conn.close()

        if not user or user["password_hash"] != password_hashed:
            return {"success": False, "error": "Invalid email or password."}

        return {
            "success": True,
            "user": {
                "id": user["id"],
                "full_name": user["full_name"],
                "email": user["email"]
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Database error: {str(e)}"}


def save_history(tool_type, input_text, output_result, user_id=None, score=None):
    """Logs tool usage activity in history."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO history (user_id, tool_type, input_text, output_result, score)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, tool_type, input_text, output_result, score)
        )
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print("[Database Warning] Could not save history:", e)
        return False


def get_user_history(user_id=None, limit=20):
    """Retrieves recent history records."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if user_id:
            cursor.execute(
                "SELECT TOP (?) id, tool_type, input_text, output_result, score, created_at FROM history WHERE user_id = ? ORDER BY created_at DESC",
                (limit, user_id)
            )
        else:
            cursor.execute(
                "SELECT TOP (?) id, tool_type, input_text, output_result, score, created_at FROM history ORDER BY created_at DESC",
                (limit,)
            )

        rows = cursor.fetchall()
        records = [row_to_dict(cursor, row) for row in rows]
        cursor.close()
        conn.close()
        return records
    except Exception as e:
        print("[Database Warning] Could not fetch history:", e)
        return []


if __name__ == "__main__":
    if init_db():
        print("Database initialized successfully.")
    else:
        print("Database initialization failed.")
