from flask import Flask, request
from flask_cors import CORS
from datetime import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)
ORDERS_FILE = Path("preorders.txt")

@app.get("/health")
def health():
        return {"ok": True}


@app.post("/api/preorder")
def save_preorder():
    data = request.get_json(silent=True) or {}

    required_fields = ["firstName", "lastName", "email", "quantity", "address"]
    missing = [field for field in required_fields if not str(data.get(field, "")).strip()]
    if missing:
        return {"ok": False, "missing": missing}, 400
    
    timestamp = datetime.now().isoformat(timespec="seconds")
    entry = (
        "Andrew Chronicles Pre-Order\n"
        "-------------------------\n"
        f"Submitted: {timestamp}\n"
        f"First Name: {data['firstName']}\n"
        f"Last Name: {data['lastName']}\n"
        f"email: {data['email']}\n"
        f"Quantity: {data['quantity']}\n"
        f"Shipping Address: {data['address']}\n"
        "===========================\n\n"            
    )

    with ORDERS_FILE.open("a", encoding="utf-8") as file:
        file.write(entry)
    return {"ok": True}, 200

    


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

