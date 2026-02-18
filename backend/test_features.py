"""Quick API verification for Lab & Nursing features."""
import requests
import json

BASE = "http://localhost:8001/api/v1"
passed = 0
failed = 0

def test(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        print(f"  ✅ {name}")
    else:
        failed += 1
        print(f"  ❌ {name} - {detail}")

print("=" * 50)
print("1. LAB SERVICES API")
print("=" * 50)

# List lab services
r = requests.get(f"{BASE}/lab/services")
test("GET /lab/services returns 200", r.status_code == 200)
services = r.json()
test("Returns list of services", isinstance(services, list) and len(services) > 0, f"Got {type(services)}")

# Create lab service with country pricing
new_svc = {
    "title": "test_service",
    "title_en": "Test Service",
    "price": 100,
    "duration": "30 min",
    "icon": "🧪",
    "category": "blood",
    "price_eg": 50.0,
    "price_sa": 20.0,
    "price_ae": 25.0,
    "price_kw": 5.0,
}
r = requests.post(f"{BASE}/lab/services", json=new_svc)
test("POST /lab/services (with country pricing)", r.status_code == 200, f"Status {r.status_code}: {r.text[:200]}")
if r.status_code == 200:
    created = r.json()
    svc_id = created.get("id")
    test("Created service has id", svc_id is not None)
    
    # Fetch and check country pricing
    r2 = requests.get(f"{BASE}/lab/services")
    svcs = r2.json()
    found = [s for s in svcs if s.get("id") == svc_id]
    if found:
        s = found[0]
        test("Country pricing: price_eg", s.get("price_eg") == 50.0, f"Got {s.get('price_eg')}")
        test("Country pricing: price_sa", s.get("price_sa") == 20.0, f"Got {s.get('price_sa')}")
    
    # Delete test service
    r3 = requests.delete(f"{BASE}/lab/services/{svc_id}")
    test("DELETE /lab/services/{id}", r3.status_code == 200)

# List with country filter
r = requests.get(f"{BASE}/lab/services?country=eg")
test("GET /lab/services?country=eg", r.status_code == 200)

print()
print("=" * 50)
print("2. NURSING SERVICES API")
print("=" * 50)

r = requests.get(f"{BASE}/nursing/services")
test("GET /nursing/services returns 200", r.status_code == 200)
svcs = r.json()
test("Returns list of services", isinstance(svcs, list) and len(svcs) > 0)

print()
print("=" * 50)
print("3. NURSING SCHEDULES API")
print("=" * 50)

# List schedules (empty at first)
r = requests.get(f"{BASE}/nursing/schedules")
test("GET /nursing/schedules returns 200", r.status_code == 200)
test("Returns empty list initially", r.json() == [])

# Get nurses to find a valid nurse_id
r_nurses = requests.get(f"{BASE}/nursing/nurses")
test("GET /nursing/nurses returns 200", r_nurses.status_code == 200)
nurses = r_nurses.json()

if nurses and len(nurses) > 0:
    nurse_id = nurses[0]["id"]
    
    # Create a schedule slot
    slot_data = {
        "nurse_id": nurse_id,
        "date": "2026-02-20",
        "start_time": "09:00",
        "end_time": "10:00",
    }
    r = requests.post(f"{BASE}/nursing/schedules", json=slot_data)
    test("POST /nursing/schedules (create slot)", r.status_code == 200, f"Status {r.status_code}: {r.text[:200]}")
    
    if r.status_code == 200:
        slot_id = r.json().get("id")
        
        # List schedules after creating
        r2 = requests.get(f"{BASE}/nursing/schedules")
        slots = r2.json()
        test("Schedule list has 1 slot", len(slots) == 1)
        test("Slot has correct date", slots[0].get("date") == "2026-02-20")
        test("Slot is available", slots[0].get("is_available") == True)
        
        # Filter by date
        r3 = requests.get(f"{BASE}/nursing/schedules?date=2026-02-20")
        test("Filter by date works", len(r3.json()) == 1)
        
        r4 = requests.get(f"{BASE}/nursing/schedules?date=2026-01-01")
        test("Filter by wrong date returns empty", len(r4.json()) == 0)
        
        # Available-slots endpoint
        r5 = requests.get(f"{BASE}/nursing/available-slots?date=2026-02-20")
        test("GET /nursing/available-slots?date=...", r5.status_code == 200)
        test("Available slots contains our slot", len(r5.json()) >= 1)
        
        # Delete the slot
        r6 = requests.delete(f"{BASE}/nursing/schedules/{slot_id}")
        test("DELETE /nursing/schedules/{id}", r6.status_code == 200)
        
        # Verify deleted
        r7 = requests.get(f"{BASE}/nursing/schedules")
        test("Schedule list empty after delete", len(r7.json()) == 0)
else:
    print("  ⚠️ No nurses found - cannot test schedule CRUD (need nurse users)")

print()
print("=" * 50)
print("4. ADMIN USER FIELDS")
print("=" * 50)

# Login as admin
r = requests.post(f"{BASE}/auth/login", json={"email": "admin@sukarak.com", "password": "admin123456"})
test("Admin login", r.status_code == 200)

print()
print("=" * 60)
print(f"RESULTS: {passed} passed, {failed} failed, {passed + failed} total")
print("=" * 60)
