from fastapi import APIRouter

# Creamos el router (la mini-app)
router = APIRouter()

# --- LA "BASE DE DATOS" (Se mueve aquí porque aquí se usa) ---
tamagochi_data = {
    "health": 100,
    "hunger": 20,
    "happiness": 100,
    "durmiendo": False,
    "is_alive": True
}

# --- FUNCIONES AUXILIARES ---
def update_state(key, value, min_val=0, max_val=100):
    tamagochi_data[key] = max(min_val, min(max_val, value))

# --- ENDPOINTS (Fíjate que ahora es @router, no @app) ---

@router.get("/estado")
def get_status():
    return tamagochi_data

@router.post("/tick")
def pasar_tiempo():
    if tamagochi_data["health"] <= 0:
        tamagochi_data["is_alive"] = False
        return tamagochi_data

    if tamagochi_data["durmiendo"]:
        update_state("health", tamagochi_data["health"] + 5)
        update_state("hunger", tamagochi_data["hunger"] + 2)
    else:
        damage = 0
        if tamagochi_data["hunger"] > 80: damage += 10
        if tamagochi_data["happiness"] < 20: damage += 5

        update_state("health", tamagochi_data["health"] - damage)
        update_state("hunger", tamagochi_data["hunger"] + 2)
        update_state("happiness", tamagochi_data["happiness"] - 1)

    if tamagochi_data["health"] <= 0:
        tamagochi_data["is_alive"] = False

    return tamagochi_data

@router.post("/comer")
def comer():
    if tamagochi_data["health"] <= 0: return tamagochi_data
    tamagochi_data["durmiendo"] = False
    update_state("hunger", tamagochi_data["hunger"] - 20)
    update_state("health", tamagochi_data["health"] + 5)
    return tamagochi_data

@router.post("/jugar")
def jugar():
    if tamagochi_data["health"] <= 0: return tamagochi_data
    tamagochi_data["durmiendo"] = False
    update_state("happiness", tamagochi_data["happiness"] + 20)
    update_state("hunger", tamagochi_data["hunger"] + 10)
    return tamagochi_data

@router.post("/dormir")
def dormir():
    if tamagochi_data["health"] <= 0: return tamagochi_data
    tamagochi_data["durmiendo"] = True
    return tamagochi_data

@router.post("/revivir")
def revivir():
    tamagochi_data["health"] = 100
    tamagochi_data["hunger"] = 20
    tamagochi_data["happiness"] = 100
    tamagochi_data["durmiendo"] = False
    tamagochi_data["is_alive"] = True
    return tamagochi_data