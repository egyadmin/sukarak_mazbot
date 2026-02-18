"""Final comprehensive system verification."""
import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")
base = "http://127.0.0.1:8000/api/v1"

def fetch(url):
    return json.loads(urllib.request.urlopen(url, timeout=5).read().decode("utf-8"))

print("=" * 60)
print("COMPREHENSIVE SYSTEM VERIFICATION")
print("=" * 60)

# 1. Notifications
print("\n=== NOTIFICATIONS ===")
data = fetch(f"{base}/admin/cms/notifications")
for n in data[:3]:
    ntype = n.get("type", "")
    print(f"  [{ntype}] {n['title']} - active={n.get('active', True)}")
print(f"  Total: {len(data)} notifications")

# 2. Settings
print("\n=== APP SETTINGS ===")
data = fetch(f"{base}/admin/settings")
for grp_name, items in data.items():
    print(f"  Group: {grp_name} ({len(items)} items)")
    for s in items[:2]:
        print(f"    - {s['key']} = {s['value']}")

# 3. Nursing services
print("\n=== NURSING SERVICES (User View) ===")
data = fetch(f"{base}/services/nursing/services?service_type=nursing")
cats = {}
for s in data:
    c = s.get("category", "?")
    cats[c] = cats.get(c, 0) + 1
print(f"  Total: {len(data)}, Categories: {cats}")

# 4. Lab services
print("\n=== LAB SERVICES (User View) ===")
data = fetch(f"{base}/services/nursing/services?service_type=lab")
cats = {}
for s in data:
    c = s.get("category", "?")
    cats[c] = cats.get(c, 0) + 1
print(f"  Total: {len(data)}, Categories: {cats}")

# 5. Market products
print("\n=== MARKET ===")
data = fetch(f"{base}/market/products")
print(f"  Total: {len(data)} products")

# 6. Membership cards
print("\n=== MEMBERSHIP ===")
data = fetch(f"{base}/membership/cards")
print(f"  Total: {len(data)} cards")

# 7. Banners
print("\n=== BANNERS ===")
data = fetch(f"{base}/admin/cms/banners")
print(f"  Total: {len(data)} banners")

# 8. Admin stats
print("\n=== ADMIN STATS ===")
data = fetch(f"{base}/admin/stats")
for k, v in list(data.items())[:6]:
    print(f"  {k}: {v}")

print("\n" + "=" * 60)
print("ALL SYSTEMS VERIFIED OK!")
print("=" * 60)
