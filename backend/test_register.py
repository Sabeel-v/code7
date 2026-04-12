import urllib.request
import json
import urllib.error

data = {
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "password123",
    "role": "Admin"
}

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/auth/register",
    data=json.dumps(data).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as res:
        print("STATUS CODE:", res.getcode())
        print("RESPONSE BODY:", res.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("STATUS CODE:", e.code)
    print("RESPONSE BODY:", e.read().decode("utf-8"))
