from passlib.context import CryptContext
import sqlite3

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Get admin password hash from DB
conn = sqlite3.connect('sukarak_v3.db')
cursor = conn.cursor()
cursor.execute("SELECT email, password FROM sukarak_users WHERE email='admin@sukarak.com'")
row = cursor.fetchone()
conn.close()

if row:
    email, hashed = row
    print(f"Email: {email}")
    print(f"Hash: {hashed}")
    try:
        result = pwd_context.verify("Admin@123", hashed)
        print(f"Password 'Admin@123' matches: {result}")
    except Exception as e:
        print(f"ERROR verifying password: {e}")
        print("Resetting password...")
        new_hash = pwd_context.hash("Admin@123")
        conn = sqlite3.connect('sukarak_v3.db')
        conn.execute("UPDATE sukarak_users SET password=? WHERE email='admin@sukarak.com'", (new_hash,))
        conn.commit()
        conn.close()
        print(f"Password reset to 'Admin@123' with new hash: {new_hash[:30]}...")
else:
    print("Admin user not found!")
