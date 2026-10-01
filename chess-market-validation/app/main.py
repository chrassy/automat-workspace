import os
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query, Request, Response, status
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, PlainTextResponse

from app.models import (
    LeadCreate, LeadResponse, AnalyticsSummary,
    MarketSimulationRequest, MarketSimulationResponse,
    PuzzleVerifyRequest, PuzzleVerifyResponse
)
from app.database import (
    init_db, insert_lead, get_leads, get_lead_by_email,
    export_leads_csv, seed_sample_leads_if_empty
)
from app.analytics import calculate_analytics, run_market_simulation
from app.puzzles import get_all_puzzles, verify_puzzle_solution

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed initial data for demo/analytics
    init_db()
    seed_sample_leads_if_empty()
    yield

app = FastAPI(
    title="AjedrezPro - Plataforma de Validación de Mercado",
    description="Smoke test, captación de lista de espera y analítica de conversión para producto de ajedrez en español.",
    version="1.0.0",
    lifespan=lifespan
)

# Static and Templates
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "chess-market-validation", "version": "1.0.0"}

@app.get("/", response_class=HTMLResponse)
async def serve_landing_page(
    request: Request,
    variant: str = Query(default="A", description="Variant A, B, or C"),
    utm_source: Optional[str] = None,
    utm_campaign: Optional[str] = None
):
    valid_variant = variant.upper() if variant.upper() in ["A", "B", "C"] else "A"
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "variant": valid_variant,
            "utm_source": utm_source or "direct",
            "utm_campaign": utm_campaign or ""
        }
    )

@app.get("/admin", response_class=HTMLResponse)
async def serve_admin_dashboard(request: Request):
    analytics_data = calculate_analytics()
    leads = get_leads(limit=50)
    return templates.TemplateResponse(
        request=request,
        name="admin.html",
        context={
            "analytics": analytics_data,
            "leads": leads
        }
    )

# Lead Capture API
@app.post("/api/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(lead_in: LeadCreate):
    existing = get_lead_by_email(lead_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este correo electrónico ya está registrado en la lista de espera prioritaria."
        )
    
    try:
        new_lead = insert_lead(lead_in.model_dump())
        return new_lead
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al registrar lead: {str(e)}"
        )

@app.get("/api/leads", response_model=List[LeadResponse])
def list_leads(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    variant: Optional[str] = Query(default=None)
):
    return get_leads(limit=limit, offset=offset, variant=variant)

@app.get("/api/analytics", response_model=AnalyticsSummary)
def get_analytics():
    return calculate_analytics()

@app.post("/api/simulate", response_model=MarketSimulationResponse)
def simulate_market(params: MarketSimulationRequest):
    return run_market_simulation(params)

@app.get("/api/export/csv")
def export_csv():
    csv_content = export_leads_csv()
    return PlainTextResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ajedrez_leads_waitlist.csv"}
    )

# Interactive Puzzles API
@app.get("/api/puzzles")
def list_puzzles():
    return get_all_puzzles()

@app.post("/api/puzzles/verify", response_model=PuzzleVerifyResponse)
def verify_puzzle(req: PuzzleVerifyRequest):
    result = verify_puzzle_solution(req.puzzle_id, req.move)
    return result
