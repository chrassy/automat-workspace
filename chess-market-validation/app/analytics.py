from typing import Dict, Any, List, Optional
from app.database import get_leads
from app.models import MarketSimulationRequest, MarketSimulationResponse

def calculate_analytics(db_path: Optional[str] = None) -> Dict[str, Any]:
    leads = get_leads(limit=10000, offset=0, db_path=db_path)
    total_leads = len(leads)
    
    variant_counts: Dict[str, int] = {"A": 0, "B": 0, "C": 0}
    elo_counts: Dict[str, int] = {"beginner": 0, "800-1200": 0, "1200-1600": 0, "1600+": 0}
    tier_counts: Dict[str, int] = {}
    source_counts: Dict[str, int] = {}
    total_wtp = 0.0

    for lead in leads:
        var = lead.get("variant", "A").upper()
        variant_counts[var] = variant_counts.get(var, 0) + 1
        
        elo = lead.get("elo_range", "800-1200")
        elo_counts[elo] = elo_counts.get(elo, 0) + 1
        
        tier = lead.get("interested_tier", "course_29")
        tier_counts[tier] = tier_counts.get(tier, 0) + 1
        
        src = lead.get("utm_source") or "direct"
        source_counts[src] = source_counts.get(src, 0) + 1
        
        wtp = lead.get("willingness_to_pay")
        if wtp is not None:
            total_wtp += float(wtp)

    avg_wtp = round(total_wtp / total_leads, 2) if total_leads > 0 else 29.0
    projected_revenue = round(total_leads * avg_wtp * 0.12, 2)  # assuming 12% conversion to paid

    # Evaluate Go / No-Go decision status based on lead volume & distribution
    if total_leads >= 20 and variant_counts.get("A", 0) >= 8:
        validation_status = "GO (Validación Aprobada)"
        validation_score = 92
        recommendations = [
            "La variante A ('Método 15 Minutos') muestra fuerte tracción entre adultos estancados (800-1200 ELO).",
            "Proceder a la fase 2: Lanzar pre-venta con descuento VIP de €29.",
            "Grabar los primeros 4 módulos de tácticas y repertorio práctico."
        ]
    elif total_leads >= 5:
        validation_status = "EN CURSO (Tracción Inicial Positiva)"
        validation_score = 68
        recommendations = [
            "Aumentar el presupuesto publicitario a €15/día para alcanzar la muestra estadística de 50 leads.",
            "Testear anuncio en Meta enfocado en 'Errores típicos de aperturas' para reducir coste por lead.",
            "Enviar Email 2 con el caso de estudio a la lista captada."
        ]
    else:
        validation_status = "INSUFICIENTE (Esperando Muestra de Datos)"
        validation_score = 35
        recommendations = [
            "Iniciar campañas piloto en Instagram y TikTok Ads con presupuesto de €50.",
            "Compartir el reto interactivo en grupos de ajedrez de Reddit y Facebook en español."
        ]

    return {
        "total_leads": total_leads,
        "leads_last_24h": total_leads,
        "leads_by_variant": variant_counts,
        "leads_by_elo": elo_counts,
        "leads_by_tier": tier_counts,
        "leads_by_source": source_counts,
        "avg_willingness_to_pay": avg_wtp,
        "projected_revenue": projected_revenue,
        "validation_status": validation_status,
        "validation_score": validation_score,
        "recommendations": recommendations
    }

def run_market_simulation(params: MarketSimulationRequest) -> MarketSimulationResponse:
    clicks = int(params.ad_spend / params.cpc) if params.cpc > 0 else 0
    leads = int(clicks * params.landing_conversion_rate)
    buyers = int(leads * params.preorder_conversion_rate)
    
    revenue = round(buyers * params.product_price, 2)
    profit = round(revenue - params.ad_spend, 2)
    roas = round(revenue / params.ad_spend, 2) if params.ad_spend > 0 else 0.0
    cpl = round(params.ad_spend / leads, 2) if leads > 0 else 0.0
    cac = round(params.ad_spend / buyers, 2) if buyers > 0 else 0.0

    if roas >= 2.0:
        verdict = "🟢 Altamente Rentable: El modelo genera retorno positivo directo en preventa."
    elif roas >= 1.0:
        verdict = "🟡 Auto-liquidable: La publicidad se autofinancia; beneficio generado en suscripción / upsells posteriores."
    else:
        verdict = "🔴 Requiere Optimización: Optimizar tasa de conversión de landing o aumentar precio medio de la oferta."

    return MarketSimulationResponse(
        ad_spend=params.ad_spend,
        estimated_clicks=clicks,
        estimated_leads=leads,
        estimated_buyers=buyers,
        estimated_revenue=revenue,
        estimated_profit=profit,
        roas=roas,
        cpl=cpl,
        cac=cac,
        verdict=verdict
    )
