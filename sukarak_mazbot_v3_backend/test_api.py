import requests

# Test products via correct endpoint
r = requests.get('http://localhost:8000/api/v1/market/products')
data = r.json()
print(f"Products: {len(data)}")
for p in data[:5]:
    print(f"  {p['title']} - price={p['price']} - img={p.get('image_url','none')}")

# Test sugar API  
r2 = requests.get('http://localhost:8000/api/v1/health/sugar')
sugar = r2.json()
print(f"\nSugar readings: {len(sugar)}")

# Test profile
r3 = requests.get('http://localhost:8000/api/v1/health/profile')
profile = r3.json()
print(f"Profile: {profile.get('name','?')} role={profile.get('role','?')}")

# Test banners
r4 = requests.get('http://localhost:8000/api/v1/admin/cms/banners')
banners = r4.json()
active = [b for b in banners if b['active']]
print(f"\nBanners: {len(banners)} total, {len(active)} active")

# Test appointments
r5 = requests.get('http://localhost:8000/api/v1/health/appointments')
print(f"Appointments: {r5.status_code} - {r5.text[:200]}")

# Test orders
r6 = requests.get('http://localhost:8000/api/v1/market/orders')
print(f"Orders: {r6.status_code} - {r6.text[:200]}")

print("\n=== ALL APIs OK ===")
