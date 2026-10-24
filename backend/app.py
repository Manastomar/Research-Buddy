import os
import re
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from generator import generate
from detector import detect
from humanizer import humanize

# Import database module from dedicated database/ directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "database")))
from database import init_db, register_user, login_user, save_history, get_user_history

app = Flask(__name__)
CORS(app)

# Initialize database and tables on startup
init_db()


def clean_text(text):
    """Strips markdown artifact characters and excessive spacing from text."""
    if not text:
        return ""
    text = re.sub(r'#+\s*', '', text).replace('*', '')
    text = re.sub(r'^[ \t]*-{3,}[ \t]*$', '', text, flags=re.MULTILINE)
    return re.sub(r'\n{3,}', '\n\n', text).strip()


# --- AI Tool Routes ---

@app.route("/text", methods=["POST"])
def get_text():
    data = request.json or {}
    user_text = data.get("text", "")
    user_id = data.get("userId")

    result_text = clean_text(generate(user_text))
    if result_text and not result_text.startswith("Error"):
        save_history("generator", user_text, result_text, user_id=user_id)

    return jsonify({"result": result_text})


@app.route("/detect", methods=["POST"])
def detect_text():
    data = request.json or {}
    user_text = data.get("text", "")
    user_id = data.get("userId")

    result_text = clean_text(detect(user_text))
    if result_text and not result_text.startswith("Error"):
        save_history("detector", user_text, result_text, user_id=user_id)

    return jsonify({"result": result_text})


@app.route("/humanize", methods=["POST"])
def humanize_text():
    data = request.json or {}
    user_text = data.get("text", "")
    user_id = data.get("userId")

    result_text = clean_text(humanize(user_text))
    if result_text and not result_text.startswith("Error"):
        save_history("humanizer", user_text, result_text, user_id=user_id)

    return jsonify({"result": result_text})


# --- Authentication & User Routes ---

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json or {}
    full_name = data.get("fullName", "")
    email = data.get("email", "")
    password = data.get("password", "")

    result = register_user(full_name, email, password)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code


@app.route("/signin", methods=["POST"])
def signin():
    data = request.json or {}
    email = data.get("email", "")
    password = data.get("password", "")

    result = login_user(email, password)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code


@app.route("/history", methods=["GET"])
def history():
    user_id = request.args.get("userId")
    records = get_user_history(user_id=user_id)
    return jsonify({"history": records}), 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
