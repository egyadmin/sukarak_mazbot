# -*- coding: utf-8 -*-
"""Final comprehensive verification of all Seller & Nursing Dashboard changes"""
import urllib.request, urllib.parse, urllib.error, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = "http://localhost:8001/api/v1"
results = []

def get(path):
    try:
        r = urllib.request.urlopen(f"{BASE}{path}")
        return json.loads(r.read()), True
    except urllib.error.HTTPError as e:
        print(f"  ERROR GET {path}: HTTP {e.code} - {e.read().decode()[:100]}")
        return None, False
    except Exception as e:
        print(f"  ERROR GET {path}: {e}")
        return None, False

def post_json(path, data):
    try:
        body = json.dumps(data).encode()
        req = urllib.request.Request(f"{BASE}{path}", data=body, headers={"Content-Type": "application/json"}, method="POST")
        r = urllib.request.urlopen(req)
        return json.loads(r.read()), True
    except urllib.error.HTTPError as e:
        print(f"  ERROR POST {path}: HTTP {e.code} - {e.read().decode()[:100]}")
        return None, False
    except Exception as e:
        print(f"  ERROR POST {path}: {e}")
        return None, False

def put_json(path, data=None):
    try:
        body = json.dumps(data).encode() if data else b"{}"
        req = urllib.request.Request(f"{BASE}{path}", data=body, headers={"Content-Type": "application/json"}, method="PUT")
        r = urllib.request.urlopen(req)
        return json.loads(r.read()), True
    except urllib.error.HTTPError as e:
        print(f"  ERROR PUT {path}: HTTP {e.code} - {e.read().decode()[:100]}")
        return None, False
    except Exception as e:
        print(f"  ERROR PUT {path}: {e}")
        return None, False

def put_form(path, fields):
    try:
        boundary = "----Boundary7MA4YWxk"
        body = b""
        for k, v in fields.items():
            body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode('utf-8')
        body += f"--{boundary}--\r\n".encode()
        req = urllib.request.Request(f"{BASE}{path}", data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}, method="PUT")
        r = urllib.request.urlopen(req)
        return json.loads(r.read()), True
    except urllib.error.HTTPError as e:
        print(f"  ERROR PUT-FORM {path}: HTTP {e.code} - {e.read().decode()[:100]}")
        return None, False
    except Exception as e:
        print(f"  ERROR PUT-FORM {path}: {e}")
        return None, False

def post_form(path, fields):
    try:
        boundary = "----Boundary7MA4YWxk"
        body = b""
        for k, v in fields.items():
            body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode('utf-8')
        body += f"--{boundary}--\r\n".encode()
        req = urllib.request.Request(f"{BASE}{path}", data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}, method="POST")
        r = urllib.request.urlopen(req)
        return json.loads(r.read()), True
    except urllib.error.HTTPError as e:
        print(f"  ERROR POST-FORM {path}: HTTP {e.code} - {e.read().decode()[:100]}")
        return None, False
    except Exception as e:
        print(f"  ERROR POST-FORM {path}: {e}")
        return None, False

def delete(path):
    try:
        req = urllib.request.Request(f"{BASE}{path}", method="DELETE")
        r = urllib.request.urlopen(req)
        return json.loads(r.read()), True
    except urllib.error.HTTPError as e:
        print(f"  ERROR DELETE {path}: HTTP {e.code} - {e.read().decode()[:100]}")
        return None, False
    except Exception as e:
        print(f"  ERROR DELETE {path}: {e}")
        return None, False

def post_urlenc(path, fields):
    try:
        data = urllib.parse.urlencode(fields).encode()
        req = urllib.request.Request(f"{BASE}{path}", data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
        r = urllib.request.urlopen(req)
        return json.loads(r.read()), True
    except urllib.error.HTTPError as e:
        print(f"  ERROR POST-URLENC {path}: HTTP {e.code} - {e.read().decode()[:100]}")
        return None, False
    except Exception as e:
        print(f"  ERROR POST-URLENC {path}: {e}")
        return None, False

def test(name, passed, detail=""):
    status = "[PASS]" if passed else "[FAIL]"
    results.append((name, passed))
    print(f"{status} {name}" + (f" -- {detail}" if detail else ""))

# ====================================================================
print("=" * 60)
print("  1. LOGIN TEST")
print("=" * 60)
data, ok = post_urlenc("/auth/login", {"username": "admin@sukarak.com", "password": "admin123"})
test("Admin login", ok and data and data.get("access_token"), 
     f"name={data.get('user',{}).get('name')}, role={data.get('user',{}).get('role')}" if ok and data else "")

# ====================================================================
print("\n" + "=" * 60)
print("  2. SELLER PRODUCT SYNC TESTS")
print("=" * 60)

# Get seller user id
seller_id = None
data2, ok2 = get("/admin/users")
if ok2 and data2:
    sellers = [u for u in data2 if u.get("role") == "seller"]
    if sellers:
        seller_id = sellers[0]["id"]
        test("Found seller user", True, f"id={seller_id}, name={sellers[0].get('name')}")
    else:
        test("Found seller user", False, "No sellers in DB")
        seller_id = 1  # fallback
else:
    seller_id = 1
    test("Found seller user", False, "Could not load users")

# 2a. Load market products
data, ok = get("/market/products")
initial_market = len(data) if ok and data else 0
test("Load market products", ok, f"{initial_market} products")

# 2b. Add product via seller
form = {"seller_id": str(seller_id), "title": "Test Sync Product", "details": "Test sync",
        "price": "99.99", "stock": "10", "category": "electronics", "sub_category": "",
        "brand": "TestBrand", "sku": "SYNC-001"}
data, ok = post_form("/seller/products", form)
add_ok = ok and data and data.get("status") == "success"
new_id = data.get("id") if add_ok else None
test("Add product via seller dashboard", add_ok, f"id={new_id}")

# 2c. Verify in market
if new_id:
    data, ok = get("/market/products")
    new_count = len(data) if ok and data else 0
    test("Product appears in MarketView", new_count == initial_market + 1, f"{initial_market} -> {new_count}")

# 2d. Edit product (FormData PUT fix)
if new_id:
    data, ok = put_form(f"/seller/products/{new_id}", {"title": "Updated Product", "price": "149.99"})
    test("Edit product (FormData PUT)", ok and data and data.get("status") == "success")

    data, ok = get("/market/products")
    if ok and data:
        edited = [p for p in data if p["id"] == new_id]
        test("Edit reflected in MarketView", edited and float(edited[0]["price"]) == 149.99,
             f"price={edited[0]['price']}" if edited else "not found")

# 2e. Toggle off
if new_id:
    data, ok = put_json(f"/seller/products/{new_id}/toggle")
    test("Toggle product off", ok)

    data, ok = get("/market/products")
    hidden = len(data) if ok and data else 0
    test("Disabled product hidden from market", hidden == initial_market, f"count={hidden}")

    # Toggle back on
    put_json(f"/seller/products/{new_id}/toggle")

# 2f. Delete
if new_id:
    data, ok = delete(f"/seller/products/{new_id}")
    test("Delete product", ok and data and data.get("status") == "success")

    data, ok = get("/market/products")
    final = len(data) if ok and data else 0
    test("Deleted product removed from market", final == initial_market, f"back to {final}")

# ====================================================================
print("\n" + "=" * 60)
print("  3. NURSING SERVICE & BOOKING SYNC TESTS")
print("=" * 60)

# 3a. Load services
data, ok = get("/services/nursing/services?service_type=nursing")
initial_svc = len(data) if ok and data else 0
test("Load nursing services", ok, f"{initial_svc} services")

# 3b. Add service
svc = {"title": "Test Sync Service", "title_en": "Test", "price": 75, "duration": "30 min",
       "icon": "X", "color": "from-teal-500", "category": "other", "service_type": "nursing"}
data, ok = post_json("/nursing/services", svc)
svc_ok = ok and data and data.get("status") == "success"
svc_id = data.get("id") if svc_ok else None
test("Add service via nursing dashboard", svc_ok, f"id={svc_id}")

# 3c. Verify service in app
data, ok = get("/services/nursing/services?service_type=nursing")
new_svc = len(data) if ok and data else 0
test("Service appears in NursingView", new_svc == initial_svc + 1, f"{initial_svc} -> {new_svc}")

# 3d. Create booking with user_id (the fix we made)
booking = {"service_id": svc_id, "service_name": "Test Sync Service", "user_id": 1,
           "user_name": "Test User", "user_phone": "0500000000",
           "date": "2026-03-01", "time": "10:00", "address": "Test Address", "notes": "sync test"}
data, ok = post_json("/nursing/bookings", booking)
book_ok = ok and data and data.get("status") == "success"
book_id = data.get("id") if book_ok else None
test("Create booking from app (with user_id)", book_ok, f"id={book_id}")

# 3e. Verify booking in dashboard
data, ok = get("/nursing/bookings")
if ok and data:
    found = any(b["id"] == book_id for b in data)
    test("Booking visible in NursingDashboard", found, f"{len(data)} total")
else:
    test("Booking visible in NursingDashboard", False)

# 3f. Update booking status
if book_id:
    data, ok = put_json(f"/nursing/bookings/{book_id}/status", {"status": "confirmed"})
    test("Update booking status to confirmed", ok)

# 3g. Toggle service off
if svc_id:
    data, ok = put_json(f"/nursing/services/{svc_id}/toggle")
    test("Toggle service off", ok)
    put_json(f"/nursing/services/{svc_id}/toggle")  # back on

# Cleanup
if book_id: delete(f"/nursing/bookings/{book_id}")
if svc_id: delete(f"/nursing/services/{svc_id}")

data, ok = get("/services/nursing/services?service_type=nursing")
final_svc = len(data) if ok and data else 0
test("Cleanup: service removed", final_svc == initial_svc, f"back to {final_svc}")

# ====================================================================
print("\n" + "=" * 60)
print("  4. SELLER DASHBOARD ANALYTICS")
print("=" * 60)
if seller_id:
    data, ok = get(f"/seller/stats?seller_id={seller_id}")
    test("Seller dashboard stats load", ok and data is not None)

    data, ok = get(f"/seller/reports/sales?seller_id={seller_id}&period=month")
    test("Seller analytics load", ok and data is not None)

# ====================================================================
# SUMMARY
print("\n" + "=" * 60)
passed = sum(1 for _, p in results if p)
total = len(results)
pct = int(passed / total * 100) if total else 0
print(f"  FINAL RESULTS: {passed}/{total} ({pct}%) tests passed")
if passed < total:
    print("\n  FAILED TESTS:")
    for name, p in results:
        if not p: print(f"    [FAIL] {name}")
else:
    print("  ALL TESTS PASSED!")
print("=" * 60)
sys.exit(0 if passed == total else 1)
