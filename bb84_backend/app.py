from fastapi import FastAPI
from pydantic import BaseModel
import random
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="BB84 Quantum Key Distribution API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Data Models
# ---------------------------
class Qubit(BaseModel):
    bit: int          # 0 or 1
    basis: str        # "+" (rectilinear) or "x" (diagonal)

class BobMeasure(BaseModel):
    basis: str        # Bob’s chosen basis


# ---------------------------
# In-Memory State
# ---------------------------
qubits_sent = []      # Store Alice’s sent qubits
qubits_eve = []       # Eve’s intercepted results
qubits_bob = []       # Bob’s measurement results


# ---------------------------
# API Endpoints
# ---------------------------

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/alice/send")
def alice_send(q: Qubit):
    """Alice sends a qubit (bit + basis)."""
    qubits_sent.append(q.dict())
    return {"msg": "Alice sent a qubit", "qubit": q}


@app.get("/eve/intercept/{index}")
def eve_intercept(index: int):
    """
    Eve intercepts and measures qubit at position `index`
    with her own random basis.
    """
    if index >= len(qubits_sent):
        return {"error": "Invalid qubit index"}

    q = qubits_sent[index]
    eve_basis = random.choice(["+", "x"])
    if eve_basis == q["basis"]:
        measured = q["bit"]  # correct
    else:
        measured = random.randint(0, 1)  # disturbance

    eve_result = {"basis": eve_basis, "measured": measured}
    if len(qubits_eve) <= index:
        qubits_eve.extend([None] * (index - len(qubits_eve) + 1))
    qubits_eve[index] = eve_result

    return {"msg": "Eve intercepted", "index": index, "eve_result": eve_result}


@app.post("/bob/measure/{index}")
def bob_measure(index: int, b: BobMeasure):
    """Bob measures qubit at position `index` with his chosen basis."""
    if index >= len(qubits_sent):
        return {"error": "Invalid qubit index"}

    q = qubits_sent[index]
    bob_basis = b.basis

    # If Eve intercepted and used wrong basis, photon is disturbed
    if len(qubits_eve) > index and qubits_eve[index]:
        eve_info = qubits_eve[index]
        if eve_info["basis"] != q["basis"]:
            measured = random.randint(0, 1)  # disturbed
        else:
            measured = eve_info["measured"]
    else:
        # No Eve, normal measurement
        if bob_basis == q["basis"]:
            measured = q["bit"]
        else:
            measured = random.randint(0, 1)

    bob_result = {"basis": bob_basis, "measured": measured}
    if len(qubits_bob) <= index:
        qubits_bob.extend([None] * (index - len(qubits_bob) + 1))
    qubits_bob[index] = bob_result

    return {"msg": "Bob measured", "index": index, "bob_result": bob_result}


@app.get("/compare-bases")
def compare_bases():
    """Alice and Bob publicly compare bases, keep only matching ones."""
    if not qubits_sent or not qubits_bob:
        return {"error": "No qubits to compare"}

    matching_indices = []
    alice_key = []
    bob_key = []

    for i in range(min(len(qubits_sent), len(qubits_bob))):
        if not qubits_bob[i]:
            continue
        if qubits_sent[i]["basis"] == qubits_bob[i]["basis"]:
            matching_indices.append(i)
            alice_key.append(qubits_sent[i]["bit"])
            bob_key.append(qubits_bob[i]["measured"])

    return {
        "matching_indices": matching_indices,
        "alice_key": alice_key,
        "bob_key": bob_key
    }


@app.get("/final-key")
def final_key():
    """Compute final shared key and error rate."""
    comp = compare_bases()
    if "error" in comp:
        return comp

    alice_key = comp["alice_key"]
    bob_key = comp["bob_key"]

    if not alice_key:
        return {"error": "No matching bases → no key"}

    errors = sum(1 for i in range(len(alice_key)) if alice_key[i] != bob_key[i])
    error_rate = (errors / len(alice_key)) * 100

    if error_rate < 20:
        return {
            "shared_key": "".join(map(str, alice_key)),
            "error_rate": error_rate
        }
    else:
        return {
            "msg": "High error rate detected → possible eavesdropper",
            "error_rate": error_rate
        }


@app.post("/reset")
def reset():
    """Reset all stored data (for new simulation)."""
    global qubits_sent, qubits_eve, qubits_bob
    qubits_sent = []
    qubits_eve = []
    qubits_bob = []
    return {"msg": "State reset"}
