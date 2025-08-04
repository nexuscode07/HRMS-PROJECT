from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_PATH = 'backend/hrms.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- Employee Dashboard Data ---
@app.route('/api/employee/dashboard', methods=['GET'])
def employee_dashboard():
    employee_id = request.args.get('employee_id')
    if not employee_id:
        return jsonify({'error': 'employee_id required'}), 400
    conn = get_db_connection()
    # Fetch employee info
    emp = conn.execute('SELECT * FROM employees WHERE id = ?', (employee_id,)).fetchone()
    # Fetch today's attendance
    today = datetime.now().strftime('%Y-%m-%d')
    attendance = conn.execute('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', (employee_id, today)).fetchone()
    # Fetch announcements
    announcements = conn.execute('SELECT * FROM announcements ORDER BY start_date DESC').fetchall()
    # Fetch notifications
    notifications = conn.execute('SELECT * FROM notifications WHERE employee_id = ? OR employee_id IS NULL ORDER BY time DESC', (employee_id,)).fetchall()
    conn.close()
    return jsonify({
        'employee': dict(emp) if emp else None,
        'attendance': dict(attendance) if attendance else None,
        'announcements': [dict(a) for a in announcements],
        'notifications': [dict(n) for n in notifications]
    })

# --- Admin Dashboard: Get All Employee Data ---
@app.route('/api/admin/employees', methods=['GET'])
def admin_employees():
    conn = get_db_connection()
    employees = conn.execute('SELECT * FROM employees').fetchall()
    conn.close()
    return jsonify([dict(e) for e in employees])

# --- Employee Clock In/Out ---
@app.route('/api/employee/clock', methods=['POST'])
def employee_clock():
    data = request.json
    employee_id = data.get('employee_id')
    action = data.get('action')  # 'in' or 'out'
    now = datetime.now()
    today = now.strftime('%Y-%m-%d')
    time_str = now.strftime('%H:%M:%S')
    conn = get_db_connection()
    if action == 'in':
        # Only allow one clock-in per day
        exists = conn.execute('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', (employee_id, today)).fetchone()
        if exists:
            conn.close()
            return jsonify({'error': 'Already clocked in today'}), 400
        conn.execute('INSERT INTO attendance (employee_id, date, clock_in) VALUES (?, ?, ?)', (employee_id, today, time_str))
    elif action == 'out':
        # Only allow clock-out if clock-in exists and clock-out not set
        att = conn.execute('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', (employee_id, today)).fetchone()
        if not att or att['clock_out']:
            conn.close()
            return jsonify({'error': 'Cannot clock out'}), 400
        conn.execute('UPDATE attendance SET clock_out = ? WHERE employee_id = ? AND date = ?', (time_str, employee_id, today))
    else:
        conn.close()
        return jsonify({'error': 'Invalid action'}), 400
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Add Announcement (Admin) ---
@app.route('/api/admin/announcements', methods=['POST'])
def add_announcement():
    data = request.json
    title = data.get('title')
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    description = data.get('description')
    if not all([title, start_date, end_date, description]):
        return jsonify({'error': 'Missing fields'}), 400
    conn = get_db_connection()
    conn.execute('INSERT INTO announcements (title, start_date, end_date, description) VALUES (?, ?, ?, ?)',
                 (title, start_date, end_date, description))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Delete Announcement (Admin) ---
@app.route('/api/admin/announcements/<int:announcement_id>', methods=['DELETE'])
def delete_announcement(announcement_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM announcements WHERE id = ?', (announcement_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Create Tables (Run once) ---
@app.route('/api/init', methods=['POST'])
def init_db():
    conn = get_db_connection()
    conn.executescript('''
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT
    );
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        date TEXT,
        clock_in TEXT,
        clock_out TEXT
    );
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT
    );
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        name TEXT,
        message TEXT,
        time TEXT,
        action TEXT
    );
    CREATE TABLE IF NOT EXISTS leaves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        start_date TEXT,
        end_date TEXT,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT
    );
    ''')
    conn.commit()
    conn.close()
    return jsonify({'success': True})


# --- Employee Leave Request ---
@app.route('/employee/leave', methods=['POST'])
def employee_leave():
    data = request.json
    employee_id = data.get('employee_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    reason = data.get('reason')
    if not all([employee_id, start_date, end_date, reason]):
        return jsonify({'error': 'Missing fields'}), 400
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    conn = get_db_connection()
    conn.execute('INSERT INTO leaves (employee_id, start_date, end_date, reason, created_at) VALUES (?, ?, ?, ?, ?)',
                 (employee_id, start_date, end_date, reason, created_at))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
