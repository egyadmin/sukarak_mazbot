import urllib.request
import urllib.parse

data = urllib.parse.urlencode({
    'username': 'admin@sukarak.com',
    'password': 'Admin@123'
}).encode()

req = urllib.request.Request('http://127.0.0.1:3000/api/v1/auth/login', data=data)
req.add_header('Content-Type', 'application/x-www-form-urlencoded')

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print(f"Response: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Response: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
