from flask import Flask, request, jsonify, g
import sqlite3
from flask_cors import CORS
import jwt
import datetime
import bcrypt  # Added for password hashing

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
SECRET_KEY = "your-secret-key"  # Replace with a secure key in production
DATABASE = 'bloodbank.db'

# Database connection management
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE, timeout=10)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Initialize SQLite database with users, donors, and receivers tables
def init_db():
    with app.app_context():
        db = get_db()
        c = db.cursor()
        # Enable WAL mode
        c.execute("PRAGMA journal_mode=WAL")
        # Create users table
        c.execute('''CREATE TABLE IF NOT EXISTS users 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      username TEXT NOT NULL UNIQUE, 
                      email TEXT NOT NULL UNIQUE, 
                      password TEXT NOT NULL, 
                      created_at TEXT DEFAULT CURRENT_TIMESTAMP)''')
        # Create donors table with city column
        c.execute('''CREATE TABLE IF NOT EXISTS donors 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL, 
                      bloodType TEXT NOT NULL, 
                      contact TEXT NOT NULL, 
                      city TEXT, 
                      lastDonation TEXT)''')
        # Create receivers table
        c.execute('''CREATE TABLE IF NOT EXISTS receivers 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      name TEXT NOT NULL, 
                      bloodType TEXT NOT NULL, 
                      contact TEXT NOT NULL, 
                      lastReceived TEXT)''')
        # Migrate existing donors table to add city column if it doesn't exist
        c.execute("PRAGMA table_info(donors)")
        columns = [col[1] for col in c.fetchall()]
        if 'city' not in columns:
            c.execute("ALTER TABLE donors ADD COLUMN city TEXT")
        db.commit()
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
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        # Enhanced validation
        if not all([username, email, password]):
            print("Missing or empty required fields")
            return jsonify({"error": "Username, email, and password are required and cannot be empty"}), 400

        # Basic email format validation
        if '@' not in email or '.' not in email:
            print(f"Invalid email format: {email}")
            return jsonify({"error": "Invalid email format"}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"Hashed password for {username}: {hashed_password}")

        db = get_db()
        c = db.cursor()
        c.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
                 (username, email, hashed_password))
        db.commit()
        print(f"User {username} with email {email} registered successfully")
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError as e:
        if "username" in str(e).lower():
            print(f"Username {username} already exists")
            return jsonify({"error": "Username already exists"}), 400
        elif "email" in str(e).lower():
            print(f"Email {email} already exists")
            return jsonify({"error": "Email already exists"}), 400
        else:
            print(f"IntegrityError during signup: {str(e)}")
            return jsonify({"error": f"Database integrity error: {str(e)}"}), 500
    except sqlite3.Error as e:
        print(f"Database error during signup: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        print(f"Unexpected signup error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()

        if not all([username, password]):
            return jsonify({"error": "Username and password are required and cannot be empty"}), 400

        db = get_db()
        c = db.cursor()
        c.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = c.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            token = jwt.encode({
                'username': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY)
            return jsonify({"success": True, "message": "Login successful", "token": token, "username": username}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        db = get_db()
        c = db.cursor()
        c.execute("SELECT id, username, email, password, created_at FROM users")
        users = [dict(row) for row in c.fetchall()]
        return jsonify(users), 200
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/donors', methods=['GET'])
def get_donors():
    try:
        db = get_db()
        c = db.cursor()
        c.execute("SELECT id, name, bloodType, contact, city, lastDonation FROM donors")
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
        city = data.get('city')
        lastDonation = data.get('lastDonation')

        if not all([name, bloodType, contact, city]):
            print("Missing required fields")
            return jsonify({"error": "Name, blood type, contact, and city are required"}), 400

        db = get_db()
        c = db.cursor()
        c.execute(
            "INSERT INTO donors (name, bloodType, contact, city, lastDonation) VALUES (?, ?, ?, ?, ?)",
            (name, bloodType, contact, city, lastDonation or None)
        )
        db.commit()
        print(f"Donor {name} added successfully")
        return jsonify({"message": "Donor added successfully"}), 201
    except Exception as e:
        print(f"Donor add error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/receivers', methods=['GET'])
def get_receivers():
    try:
        db = get_db()
        c = db.cursor()
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

        if not all([name, bloodType, contact]):
            print("Missing required fields")
            return jsonify({"error": "Name, blood type, and contact are required"}), 400

        valid_blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        if bloodType not in valid_blood_types:
            print(f"Invalid blood type: {bloodType}")
            return jsonify({"error": "Invalid blood type"}), 400

        db = get_db()
        c = db.cursor()
        c.execute(
            "INSERT INTO receivers (name, bloodType, contact, lastReceived) VALUES (?, ?, ?, ?)",
            (name, bloodType, contact, lastReceived or None)
        )
        db.commit()
        print(f"Receiver {name} added successfully")
        return jsonify({"message": "Receiver added successfully"}), 201
    except sqlite3.Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        print(f"Receiver add error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Comprehensive list of Tamil Nadu blood banks
TAMIL_NADU_BLOOD_BANKS = [
    {"name": "Vijaya Hospital Blood Bank", "address": "No. 434, N.S.K. Salai, Vadapalani, Chennai, Tamil Nadu", "lat": 13.0525, "lng": 80.2135},
    {"name": "Dr. Kamakshi Memorial Hospital Blood Bank", "address": "No. 1, Radial Road, Pallikaranai, Chennai, Tamil Nadu", "lat": 12.9381, "lng": 80.2067},
    {"name": "Madras Medical Mission Blood Bank", "address": "4-A, Dr. J. Jayalalitha Nagar, Mogappair, Chennai, Tamil Nadu", "lat": 13.0840, "lng": 80.1847},
    {"name": "Apollo Hospitals Blood Bank", "address": "No. 21, Greams Lane, Chennai, Tamil Nadu", "lat": 13.0639, "lng": 80.2518},
    {"name": "Government Royapettah Hospital Blood Bank", "address": "Royapettah, Chennai, Tamil Nadu", "lat": 13.0547, "lng": 80.2672},
    {"name": "KG Hospital Regional Blood Bank", "address": "No. 5, Government Arts College Road, Coimbatore, Tamil Nadu", "lat": 11.0183, "lng": 76.9725},
    {"name": "G. Kuppuswamy Naidu Memorial Hospital Blood Bank", "address": "Nethaji Road, Pappanaickenpalayam, Coimbatore, Tamil Nadu", "lat": 11.0286, "lng": 76.9389},
    {"name": "Government Hospital Blood Bank", "address": "Gobichettipalayam, Erode, Tamil Nadu", "lat": 11.4550, "lng": 77.4369},
    {"name": "Sri Ramakrishna Hospital Blood Bank", "address": "No. 395, Sarojini Naidu Road, Coimbatore, Tamil Nadu", "lat": 11.0280, "lng": 76.9367},
    {"name": "Government Rajaji Hospital Blood Bank", "address": "Gandhi Road, Madurai, Tamil Nadu", "lat": 9.9252, "lng": 78.1198},
    {"name": "Vadamalayan Hospital Blood Bank", "address": "No. 15, Jawahar Road, Madurai, Tamil Nadu", "lat": 9.9177, "lng": 78.1141},
    {"name": "Meenakshi Mission Hospital Blood Bank", "address": "Lake Area, Melur Road, Madurai, Tamil Nadu", "lat": 9.9357, "lng": 78.1415},
    {"name": "Government Hospital Blood Bank", "address": "Tiruchirappalli, Tamil Nadu", "lat": 10.7905, "lng": 78.7047},
    {"name": "Kauvery Hospital Blood Bank", "address": "No. 6, Royal Road, Trichy, Tamil Nadu", "lat": 10.8027, "lng": 78.6856},
    {"name": "Christian Medical College Blood Bank", "address": "Thorapadi, Vellore, Tamil Nadu", "lat": 12.9249, "lng": 79.1363},
    {"name": "Government Vellore Medical College Blood Bank", "address": "Adukkamparai, Vellore, Tamil Nadu", "lat": 12.9057, "lng": 79.1325},
    {"name": "Jeyasekharan Hospital Blood Bank", "address": "K.P. Road, Nagercoil, Tamil Nadu", "lat": 8.1833, "lng": 77.4115},
    {"name": "Government Hospital Blood Bank", "address": "Tirunelveli, Tamil Nadu", "lat": 8.7139, "lng": 77.7567},
    {"name": "Shifa Hospitals Blood Bank", "address": "No. 82, Kailasapuram Middle Street, Tirunelveli, Tamil Nadu", "lat": 8.7274, "lng": 77.7103},
    {"name": "Salem Government Mohan Kumaramangalam Medical College Blood Bank", "address": "Salem, Tamil Nadu", "lat": 11.6643, "lng": 78.1460},
    {"name": "Vinayaka Missions Hospital Blood Bank", "address": "Sankari Main Road, Salem, Tamil Nadu", "lat": 11.6780, "lng": 78.1098}
]

@app.route('/api/nearby', methods=['POST'])
def find_nearby():
    try:
        data = request.json
        print(f"Received nearby request: {data}")
        recipient_location = data.get('location')

        if not recipient_location:
            print("Missing location field")
            return jsonify({"error": "Location is required"}), 400

        recipient_location = recipient_location.lower()

        db = get_db()
        c = db.cursor()
        c.execute("SELECT id, name, bloodType, contact, city, lastDonation FROM donors WHERE LOWER(city) LIKE ?",
                  (f"%{recipient_location}%",))
        donors = [dict(row) for row in c.fetchall()]
        print(f"Found donors: {donors}")

        nearby_blood_banks = [
            bb for bb in TAMIL_NADU_BLOOD_BANKS
            if recipient_location in bb['address'].lower()
        ]

        return jsonify({
            "donors": donors,
            "blood_banks": nearby_blood_banks
        }), 200
    except sqlite3.Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        print(f"Nearby search error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)