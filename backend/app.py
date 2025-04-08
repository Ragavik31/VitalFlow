from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Restrict to React app origin
SECRET_KEY = "your-secret-key"  # Replace with a secure key in production

# Initialize SQLite database with users, donors, and receivers tables
def init_db():
    with sqlite3.connect('bloodbank.db') as conn:
        c = conn.cursor()
        # Create users table
        c.execute('''CREATE TABLE IF NOT EXISTS users 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      username TEXT NOT NULL UNIQUE, 
                      email TEXT NOT NULL UNIQUE, 
                      password TEXT NOT NULL, 
                      created_at TEXT DEFAULT CURRENT_TIMESTAMP)''')
        # Create donors table
        c.execute('''CREATE TABLE IF NOT EXISTS donors 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL, 
                      bloodType TEXT NOT NULL, 
                      contact TEXT NOT NULL, 
                      lastDonation TEXT)''')
        # Create receivers table
        c.execute('''CREATE TABLE IF NOT EXISTS receivers 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL, 
                      bloodType TEXT NOT NULL, 
                      contact TEXT NOT NULL, 
                      lastReceived TEXT)''')
        conn.commit()
        print("Database initialized with users, donors, and receivers tables.")

# Middleware to verify JWT token (optional, uncomment to enable)
def token_required(f):
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            token = token.split(" ")[1]  # Expecting "Bearer <token>"
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    decorator.__name__ = f.__name__
    return decorator

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        print(f"Received signup data: {data}")
        username = cause.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            print("Missing required fields")
            return jsonify({"error": "Username, email, and password are required"}), 400

        with sqlite3.connect('bloodbank.db') as conn:
            c = conn.cursor()
            c.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
                     (username, email, password))
            conn.commit()
            print(f"User {username} with email {email} registered successfully")
            return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError as e:
        if "username" in str(e):
            print(f"Username {username} already exists")
            return jsonify({"error": "Username already exists"}), 400
        elif "email" in str(e):
            print(f"Email {email} already exists")
            return jsonify({"error": "Email already exists"}), 400
        else:
            raise e
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    with sqlite3.connect('bloodbank.db') as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = c.fetchone()

    if user:
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)
        return jsonify({"success": True, "message": "Login successful", "token": token, "username": username}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/users', methods=['GET'])
def get_users():
    with sqlite3.connect('bloodbank.db') as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT id, username, email, password, created_at FROM users")
        users = [dict(row) for row in c.fetchall()]
    return jsonify(users)

@app.route('/api/donors', methods=['GET'])
def get_donors():
    try:
        with sqlite3.connect('bloodbank.db') as conn:
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            c.execute("SELECT id, name, bloodType, contact, lastDonation FROM donors")
            donors = [dict(row) for row in c.fetchall()]
            print(f"Fetched donors: {donors}")
        return jsonify(donors), 200
    except Exception as e:
        print(f"Error fetching donors: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/donors', methods=['POST'])
# @token_required  # Uncomment to require authentication
def add_donor():
    try:
        data = request.json
        print(f"Received donor data: {data}")
        name = data.get('name')
        bloodType = data.get('bloodType')
        contact = data.get('contact')
        lastDonation = data.get('lastDonation')

        if not all([name, bloodType, contact]):
            print("Missing required fields")
            return jsonify({"error": "Name, blood type, and contact are required"}), 400

        with sqlite3.connect('bloodbank.db') as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO donors (name, bloodType, contact, lastDonation) VALUES (?, ?, ?, ?)",
                (name, bloodType, contact, lastDonation or None)
            )
            conn.commit()
            print(f"Donor {name} added successfully")
            return jsonify({"message": "Donor added successfully"}), 201
    except Exception as e:
        print(f"Donor add error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/receivers', methods=['GET'])
def get_receivers():
    try:
        with sqlite3.connect('bloodbank.db') as conn:
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            c.execute("SELECT id, name, bloodType, contact, lastReceived FROM receivers")
            receivers = [dict(row) for row in c.fetchall()]
            print(f"Fetched receivers: {receivers}")
        return jsonify(receivers), 200
    except Exception as e:
        print(f"Error fetching receivers: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/receivers', methods=['POST'])
# @token_required  # Uncomment to require authentication
def add_receiver():
    try:
        data = request.json
        print(f"Received receiver data: {data}")
        name = data.get('name')
        bloodType = data.get('bloodType')
        contact = data.get('contact')
        lastReceived = data.get('lastReceived')

        # Validate required fields
        if not all([name, bloodType, contact]):
            print("Missing required fields")
            return jsonify({"error": "Name, blood type, and contact are required"}), 400

        # Optional: Validate bloodType
        valid_blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        if bloodType not in valid_blood_types:
            print(f"Invalid blood type: {bloodType}")
            return jsonify({"error": "Invalid blood type"}), 400

        with sqlite3.connect('bloodbank.db') as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO receivers (name, bloodType, contact, lastReceived) VALUES (?, ?, ?, ?)",
                (name, bloodType, contact, lastReceived or None)
            )
            conn.commit()
            print(f"Receiver {name} added successfully")
            return jsonify({"message": "Receiver added successfully"}), 201
    except sqlite3.Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        print(f"Receiver add error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)