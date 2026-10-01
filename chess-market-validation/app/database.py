import sqlite3
import os
import io
import csv
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

def get_db_path() -> str:
    return os.environ.get("CHESS_DB_PATH", os.path.join(os.path.dirname(__file__), "chess_leads.db"))

def get_db_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    path = db_path or get_db_path()
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    # Ensure tables exist
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                name TEXT,
                variant TEXT NOT NULL DEFAULT 'A',
                elo_range TEXT DEFAULT '800-1200',
                main_frustration TEXT,
                interested_tier TEXT DEFAULT 'course_29',
                willingness_to_pay REAL DEFAULT 29.0,
                preferred_format TEXT DEFAULT 'interactive_app',
                utm_source TEXT DEFAULT 'direct',
                utm_medium TEXT,
                utm_campaign TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_variant ON leads(variant);")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);")
    return conn

def init_db(db_path: Optional[str] = None) -> None:
    conn = get_db_connection(db_path)
    conn.close()

def insert_lead(lead_data: Dict[str, Any], db_path: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db_connection(db_path)
    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO leads (
                    email, name, variant, elo_range, main_frustration,
                    interested_tier, willingness_to_pay, preferred_format,
                    utm_source, utm_medium, utm_campaign, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lead_data["email"].strip().lower(),
                lead_data.get("name", "").strip(),
                lead_data.get("variant", "A").upper(),
                lead_data.get("elo_range", "800-1200"),
                lead_data.get("main_frustration", ""),
                lead_data.get("interested_tier", "course_29"),
                float(lead_data.get("willingness_to_pay", 29.0)),
                lead_data.get("preferred_format", "interactive_app"),
                lead_data.get("utm_source", "direct"),
                lead_data.get("utm_medium"),
                lead_data.get("utm_campaign"),
                datetime.now(timezone.utc).isoformat()
            ))
            lead_id = cursor.lastrowid
            cursor.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
            row = cursor.fetchone()
            return dict(row)
    finally:
        conn.close()

def get_lead_by_email(email: str, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads WHERE email = ?", (email.strip().lower(),))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def get_leads(
    limit: int = 100,
    offset: int = 0,
    variant: Optional[str] = None,
    db_path: Optional[str] = None
) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    try:
        cursor = conn.cursor()
        if variant:
            cursor.execute(
                "SELECT * FROM leads WHERE variant = ? ORDER BY id DESC LIMIT ? OFFSET ?",
                (variant.upper(), limit, offset)
            )
        else:
            cursor.execute(
                "SELECT * FROM leads ORDER BY id DESC LIMIT ? OFFSET ?",
                (limit, offset)
            )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

def get_leads_count(db_path: Optional[str] = None) -> int:
    conn = get_db_connection(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM leads")
        row = cursor.fetchone()
        return row["cnt"] if row else 0
    finally:
        conn.close()

def export_leads_csv(db_path: Optional[str] = None) -> str:
    leads = get_leads(limit=10000, offset=0, db_path=db_path)
    output = io.StringIO()
    if not leads:
        output.write("id,email,name,variant,elo_range,main_frustration,interested_tier,willingness_to_pay,preferred_format,utm_source,utm_medium,utm_campaign,created_at\n")
        return output.getvalue()
    
    writer = csv.DictWriter(output, fieldnames=list(leads[0].keys()))
    writer.writeheader()
    writer.writerows(leads)
    return output.getvalue()

def seed_sample_leads_if_empty(db_path: Optional[str] = None) -> int:
    """Seeds initial realistic sample leads for immediate dashboard visualization and test data."""
    if get_leads_count(db_path) > 0:
        return 0
    
    sample_leads = [
        {"email": "carlos.garcia@gmail.com", "name": "Carlos García", "variant": "A", "elo_range": "800-1200", "main_frustration": "Cometo descuidos graves en aperturas", "interested_tier": "course_29", "willingness_to_pay": 29.0, "preferred_format": "interactive_app", "utm_source": "instagram_ads", "utm_campaign": "dolor_elo"},
        {"email": "david.martinez@hotmail.com", "name": "David Martínez", "variant": "A", "elo_range": "1200-1600", "main_frustration": "No tengo tiempo para estudiar libros largos", "interested_tier": "course_29", "willingness_to_pay": 29.0, "preferred_format": "interactive_app", "utm_source": "instagram_ads", "utm_campaign": "metodo_15min"},
        {"email": "elena.rodriguez@yahoo.es", "name": "Elena Rodríguez", "variant": "C", "elo_range": "beginner", "main_frustration": "Quiero que mi hijo de 9 años aprenda a concentrarse", "interested_tier": "family_pack_49", "willingness_to_pay": 49.0, "preferred_format": "video_course", "utm_source": "facebook_ads", "utm_campaign": "padres_educacion"},
        {"email": "marcos.sanz@gmail.com", "name": "Marcos Sanz", "variant": "B", "elo_range": "1200-1600", "main_frustration": "Quiero análisis de partidas con IA para entender mis fallos", "interested_tier": "vip_membership_9", "willingness_to_pay": 19.99, "preferred_format": "ai_coaching", "utm_source": "google_search", "utm_campaign": "curso_ajedrez_online"},
        {"email": "javier.lopez@outlook.com", "name": "Javier López", "variant": "A", "elo_range": "800-1200", "main_frustration": "Pierdo piezas colgadas y no veo tácticas de mate", "interested_tier": "starter_19", "willingness_to_pay": 19.0, "preferred_format": "interactive_app", "utm_source": "tiktok", "utm_campaign": "puzzle_viral"},
        {"email": "lucia.fernandez@gmail.com", "name": "Lucía Fernández", "variant": "C", "elo_range": "beginner", "main_frustration": "Buscando actividad educativa para las tardes", "interested_tier": "family_pack_49", "willingness_to_pay": 49.0, "preferred_format": "interactive_app", "utm_source": "facebook_ads", "utm_campaign": "padres_educacion"},
        {"email": "pablo.navarro@gmail.com", "name": "Pablo Navarro", "variant": "B", "elo_range": "1600+", "main_frustration": "Profundizar repertorio contra la defensa siciliana", "interested_tier": "vip_membership_9", "willingness_to_pay": 39.0, "preferred_format": "ai_coaching", "utm_source": "google_search", "utm_campaign": "aperturas_avanzadas"},
        {"email": "alvaro.ruiz@gmail.com", "name": "Álvaro Ruiz", "variant": "A", "elo_range": "800-1200", "main_frustration": "Llevo 6 meses en 1150 ELO y no consigo avanzar", "interested_tier": "course_29", "willingness_to_pay": 29.0, "preferred_format": "interactive_app", "utm_source": "instagram_ads", "utm_campaign": "dolor_elo"}
    ]
    
    count = 0
    for lead in sample_leads:
        try:
            insert_lead(lead, db_path)
            count += 1
        except Exception:
            pass
    return count
