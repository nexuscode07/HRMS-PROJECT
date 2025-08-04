from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- Root route for health check and default response ---
@app.route('/', methods=['GET'])
def root():
    return jsonify({"message": "HRMS Backend API is running."})

DB_PATH = 'hrms.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- Database Initialization ---
@app.route('/api/init', methods=['POST'])
def init_db():
    conn = get_db_connection()
    conn.executescript('''
    CREATE TABLE IF NOT EXISTS employees (
        employeeId INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        department TEXT,
        position TEXT,
        phone TEXT,
        address TEXT
    );
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeId INTEGER,
        date TEXT,
        clockIn TEXT,
        clockOut TEXT
    );
    CREATE TABLE IF NOT EXISTS leaves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeId INTEGER,
        leaveType TEXT,
        startDate TEXT,
        endDate TEXT,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        appliedDate TEXT DEFAULT (DATE('now'))
    );
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        startDate TEXT,
        endDate TEXT,
        description TEXT
    );
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeId INTEGER,
        message TEXT,
        time TEXT,
        action TEXT
    );
    ''')
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Employee Dashboard Data ---
@app.route('/api/employee/dashboard', methods=['GET'])
def employee_dashboard():
    employee_id = request.args.get('employeeId')
    if not employee_id:
        return jsonify({'error': 'employeeId required'}), 400
    conn = get_db_connection()
    emp = conn.execute('SELECT * FROM employees WHERE employeeId = ?', (employee_id,)).fetchone()
    today = datetime.now().strftime('%Y-%m-%d')
    attendance = conn.execute('SELECT * FROM attendance WHERE employeeId = ? AND date = ?', (employee_id, today)).fetchone()
    announcements = conn.execute('SELECT * FROM announcements ORDER BY startDate DESC').fetchall()
    notifications = conn.execute('SELECT * FROM notifications WHERE employeeId = ? OR employeeId IS NULL ORDER BY time DESC', (employee_id,)).fetchall()
    conn.close()
    return jsonify({
        'employee': dict(emp) if emp else None,
        'attendance': dict(attendance) if attendance else None,
        'announcements': [dict(a) for a in announcements],
        'notifications': [dict(n) for n in notifications]
    })

# --- Employee Clock In/Out ---
@app.route('/api/employee/clock', methods=['POST'])
def employee_clock():
    data = request.json
    employee_id = data.get('employeeId')
    action = data.get('action')  # 'in' or 'out'
    now = datetime.now()
    today = now.strftime('%Y-%m-%d')
    time_str = now.strftime('%H:%M:%S')
    conn = get_db_connection()
    if action == 'in':
        exists = conn.execute('SELECT * FROM attendance WHERE employeeId = ? AND date = ?', (employee_id, today)).fetchone()
        if exists:
            conn.close()
            return jsonify({'error': 'Already clocked in today'}), 400
        conn.execute('INSERT INTO attendance (employeeId, date, clockIn) VALUES (?, ?, ?)', (employee_id, today, time_str))
    elif action == 'out':
        att = conn.execute('SELECT * FROM attendance WHERE employeeId = ? AND date = ?', (employee_id, today)).fetchone()
        if not att or att['clockOut']:
            conn.close()
            return jsonify({'error': 'Cannot clock out'}), 400
        conn.execute('UPDATE attendance SET clockOut = ? WHERE employeeId = ? AND date = ?', (time_str, employee_id, today))
    else:
        conn.close()
        return jsonify({'error': 'Invalid action'}), 400
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Employee Leave Request ---
@app.route('/api/employee/leave', methods=['POST'])
def employee_leave():
    data = request.json
    employee_id = data.get('employeeId')
    leave_type = data.get('leaveType')
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    reason = data.get('reason')
    if not all([employee_id, leave_type, start_date, end_date, reason]):
        return jsonify({'error': 'Missing fields'}), 400
    conn = get_db_connection()
    conn.execute('INSERT INTO leaves (employeeId, leaveType, startDate, endDate, reason) VALUES (?, ?, ?, ?, ?)',
                 (employee_id, leave_type, start_date, end_date, reason))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Employee Leave History ---
@app.route('/api/employee/leaves', methods=['GET'])
def employee_leaves():
    employee_id = request.args.get('employeeId')
    conn = get_db_connection()
    leaves = conn.execute('SELECT * FROM leaves WHERE employeeId = ?', (employee_id,)).fetchall()
    conn.close()
    return jsonify([dict(l) for l in leaves])

# --- Admin: Get All Employees ---
@app.route('/api/admin/employees', methods=['GET'])
def admin_employees():
    conn = get_db_connection()
    employees = conn.execute('SELECT * FROM employees').fetchall()
    conn.close()
    return jsonify([dict(e) for e in employees])

# --- Admin: Get All Leaves ---
@app.route('/api/admin/leaves', methods=['GET'])
def admin_leaves():
    conn = get_db_connection()
    leaves = conn.execute('SELECT * FROM leaves').fetchall()
    conn.close()
    return jsonify([dict(l) for l in leaves])

# --- Admin: Approve/Reject Leave ---
@app.route('/api/admin/leave/<int:leave_id>', methods=['PATCH'])
def admin_update_leave(leave_id):
    data = request.json
    status = data.get('status')  # 'approved' or 'rejected'
    if status not in ['approved', 'rejected']:
        return jsonify({'error': 'Invalid status'}), 400
    conn = get_db_connection()
    conn.execute('UPDATE leaves SET status = ? WHERE id = ?', (status, leave_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Admin: Add Announcement ---
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
    conn.execute('INSERT INTO announcements (title, startDate, endDate, description) VALUES (?, ?, ?, ?)',
                 (title, start_date, end_date, description))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Admin: Delete Announcement ---
@app.route('/api/admin/announcements/<int:announcement_id>', methods=['DELETE'])
def delete_announcement(announcement_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM announcements WHERE id = ?', (announcement_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --- Admin Dashboard Data (example) ---
@app.route('/api/admin/dashboard', methods=['GET'])
def admin_dashboard():
    conn = get_db_connection()
    employees = conn.execute('SELECT COUNT(*) as count FROM employees').fetchone()['count']
    leaves = conn.execute('SELECT COUNT(*) as count FROM leaves').fetchone()['count']
    attendance = conn.execute('SELECT COUNT(*) as count FROM attendance').fetchone()['count']
    announcements = conn.execute('SELECT COUNT(*) as count FROM announcements').fetchone()['count']
    conn.close()
    return jsonify({
        'employeeCount': employees,
        'leaveCount': leaves,
        'attendanceCount': attendance,
        'announcementCount': announcements
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)