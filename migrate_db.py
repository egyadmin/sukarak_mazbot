import sqlite3

conn = sqlite3.connect('sukarak.db')
c = conn.cursor()

# Add unit column to sugar_readings
try:
    c.execute("ALTER TABLE sugar_readings ADD COLUMN unit VARCHAR(20) DEFAULT 'mg/dl'")
    print("Added 'unit' to sugar_readings")
except Exception as e:
    print(f"sugar_readings.unit: {e}")

# Add dosage_unit to drugs_records
try:
    c.execute("ALTER TABLE drugs_records ADD COLUMN dosage_unit VARCHAR(50)")
    print("Added 'dosage_unit' to drugs_records")
except Exception as e:
    print(f"drugs_records.dosage_unit: {e}")

# Add concentration_unit to drugs_records
try:
    c.execute("ALTER TABLE drugs_records ADD COLUMN concentration_unit VARCHAR(50)")
    print("Added 'concentration_unit' to drugs_records")
except Exception as e:
    print(f"drugs_records.concentration_unit: {e}")

conn.commit()

# Verify
c.execute('PRAGMA table_info(sugar_readings)')
print('Sugar readings columns:', [row[1] for row in c.fetchall()])
c.execute('PRAGMA table_info(drugs_records)')
print('Drug records columns:', [row[1] for row in c.fetchall()])

conn.close()
print("Migration complete!")
