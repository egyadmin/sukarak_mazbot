import urllib.request, urllib.parse, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("=== Login Test ===")
try:
    data = urllib.parse.urlencode({"username": "admin@sukarak.com", "password": "admin123"}).encode()
    req = urllib.request.Request("http://localhost:8001/api/v1/auth/login", data=data,
                                 headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
    r = urllib.request.urlopen(req)
    result = json.loads(r.read())
    user = result.get("user", {})
    print(f"LOGIN SUCCESS!")
    print(f"  Name: {user.get('name')}")
    print(f"  Email: {user.get('email')}")
    print(f"  Role: {user.get('role')}")
    print(f"  Token: {result.get('access_token', '')[:30]}...")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"HTTP {e.code}: {body[:300]}")
except Exception as e:
    print(f"ERROR: {e}")
