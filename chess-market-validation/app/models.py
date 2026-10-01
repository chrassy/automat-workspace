from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class LeadCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = Field(default="", max_length=100)
    variant: str = Field(default="A", description="Variant tested: A (15-min daily), B (Master + AI), C (Kids/Family)")
    elo_range: Optional[str] = Field(default="800-1200", description="User rating level")
    main_frustration: Optional[str] = Field(default="", description="Main struggle in chess")
    interested_tier: Optional[str] = Field(default="course_29", description="Chosen pricing tier")
    willingness_to_pay: Optional[float] = Field(default=29.0, ge=0)
    preferred_format: Optional[str] = Field(default="interactive_app")
    utm_source: Optional[str] = Field(default="direct")
    utm_medium: Optional[str] = Field(default=None)
    utm_campaign: Optional[str] = Field(default=None)

class LeadResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    variant: str
    elo_range: Optional[str]
    main_frustration: Optional[str]
    interested_tier: Optional[str]
    willingness_to_pay: Optional[float]
    preferred_format: Optional[str]
    utm_source: Optional[str]
    utm_medium: Optional[str]
    utm_campaign: Optional[str]
    created_at: str
    lead_magnet_sent: bool = True

class VariantStats(BaseModel):
    variant: str
    variant_name: str
    leads_count: int
    share_percent: float
    top_elo: str
    avg_willingness_to_pay: float

class AnalyticsSummary(BaseModel):
    total_leads: int
    leads_last_24h: int
    leads_by_variant: Dict[str, int]
    leads_by_elo: Dict[str, int]
    leads_by_tier: Dict[str, int]
    leads_by_source: Dict[str, int]
    avg_willingness_to_pay: float
    projected_revenue: float
    validation_status: str
    validation_score: int
    recommendations: List[str]

class MarketSimulationRequest(BaseModel):
    ad_spend: float = Field(default=300.0, ge=10.0, description="Total budget in EUR")
    cpc: float = Field(default=0.20, ge=0.01, description="Estimated Cost Per Click in EUR")
    landing_conversion_rate: float = Field(default=0.22, ge=0.01, le=1.0, description="Landing page opt-in rate")
    preorder_conversion_rate: float = Field(default=0.08, ge=0.001, le=1.0, description="Preorder conversion rate from leads")
    product_price: float = Field(default=29.0, ge=1.0, description="Price in EUR")

class MarketSimulationResponse(BaseModel):
    ad_spend: float
    estimated_clicks: int
    estimated_leads: int
    estimated_buyers: int
    estimated_revenue: float
    estimated_profit: float
    roas: float
    cpl: float
    cac: float
    verdict: str

class PuzzleItem(BaseModel):
    id: str
    title: str
    difficulty: str
    fen: str
    turn: str
    instruction: str
    solution_move: str
    explanation: str
    hint: str

class PuzzleVerifyRequest(BaseModel):
    puzzle_id: str
    move: str

class PuzzleVerifyResponse(BaseModel):
    correct: bool
    message: str
    explanation: str
    next_puzzle_id: Optional[str] = None
