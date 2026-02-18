import urllib.request
import json
from datetime import datetime, timedelta

base = "http://localhost:8000"

# First delete existing sugar readings by posting new ones with diverse dates
# We'll use the existing POST endpoint
now = datetime.now()
sugar_data = [
    (95.0, 'fasting'),
    (135.0, 'after_meal'),
    (88.0, 'fasting'),
    (155.0, 'after_meal'),
    (102.0, 'random'),
    (78.0, 'fasting'),
    (190.0, 'after_meal'),
    (110.0, 'fasting'),
]

for reading, test_type in sugar_data:
    data = json.dumps({"reading": reading, "test_type": test_type}).encode()
    req = urllib.request.Request(
        f"{base}/api/v1/health/sugar",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            result = json.loads(resp.read().decode())
            print(f"✅ Added: {reading} mg/dL ({test_type})")
    except Exception as e:
        print(f"❌ {e}")

# Check total
req = urllib.request.Request(f"{base}/api/v1/health/sugar")
with urllib.request.urlopen(req, timeout=5) as resp:
    data = json.loads(resp.read().decode())
    print(f"\nTotal sugar readings: {len(data)}")
