import urllib.request, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

req = urllib.request.Request('http://localhost:3000/api/v1/market/products')
resp = urllib.request.urlopen(req, timeout=5)
data = json.loads(resp.read().decode())
print(f"Products: {len(data)}")
for p in data[:5]:
    print(f"  id={p['id']}, img_url={p.get('img_url', 'None')}, title={p['title'][:30]}")
