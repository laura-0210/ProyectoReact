from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Importamos el router que acabamos de crear
from routers import game

app = FastAPI()

# --- CONFIGURACIÓN DE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8001",
        "https://tu-app-en-vercel.vercel.app" # Reemplaza con tu URL real de Vercel
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONECTAMOS EL ROUTER ---
# Esto dice: "Coge todas las rutas definidas en game.py y añádelas a mi app"
app.include_router(game.router)

@app.get("/")
def home():
    return {"mensaje": "API Tamagochi Modularizada y Lista"}