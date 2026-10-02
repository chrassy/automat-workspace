from typing import List, Dict, Optional
from app.models import PuzzleItem

PUZZLES_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "puzzle-1",
        "title": "Mate del Pasillo en 1 Jugada",
        "difficulty": "Principiante (800 - 1100 ELO)",
        "fen": "6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1",
        "turn": "Blancas",
        "instruction": "Las negras tienen su rey atrapado por sus propios peones. Encuentra el jaque mate en 1 jugada.",
        "solution_move": "Rb8#",
        "alternative_solutions": ["rb8", "rb8#", "tb8", "tb8#", "r1b8", "t1b8"],
        "explanation": "¡Correcto! Torre a b8 (Tb8#) aprovecha la debilidad de la 8ª fila. El rey negro no puede escapar porque sus propios peones (f7, g7, h7) le bloquean la salida.",
        "hint": "Fíjate en la última fila del rey enemigo y en tu torre en b1."
    },
    {
        "id": "puzzle-2",
        "title": "La Horquilla Letal de Caballo",
        "difficulty": "Intermedio (1100 - 1400 ELO)",
        "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
        "turn": "Blancas",
        "instruction": "Blancas juegan y recuperan pieza con ventaja decisiva atacando dos objetivos a la vez.",
        "solution_move": "Qd5",
        "alternative_solutions": ["qd5", "dd5", "d1d5", "q1d5"],
        "explanation": "¡Brillante! Dama a d5 (Dd5) crea una doble amenaza letal: amenaza jaque mate inmediato en f7 (Dxf7#) y al mismo tiempo ataca al caballo desprotegido en e4.",
        "hint": "Busca una casilla central para tu Dama que amenace mate y una pieza enemiga a la vez."
    },
    {
        "id": "puzzle-3",
        "title": "Ataque a la Descubierta con Jaque",
        "difficulty": "Avanzado (1400 - 1600+ ELO)",
        "fen": "r1bq1rk1/pp1nbppp/2p1pn2/8/2PPN3/3B1N2/PP2QPPP/R1B1K2R w KQ - 3 9",
        "turn": "Blancas",
        "instruction": "Encuentra la jugada de ruptura para iniciar el ataque clásico sobre el enroque negro.",
        "solution_move": "Bxh7+",
        "alternative_solutions": ["bxh7", "bxh7+", "axh7", "axh7+", "bd3xh7"],
        "explanation": "¡Extraordinario! El 'Sacrificio Griego' (Axh7+). Desmantela el escudo protector del rey negro y abre el camino para que el caballo en g5 y la dama en h5 entren con mate imparable.",
        "hint": "El alfil de d3 está apuntando directamente a la casilla más vulnerable del enroque."
    }
]

def get_all_puzzles() -> List[Dict[str, Any]]:
    return [
        {
            "id": p["id"],
            "title": p["title"],
            "difficulty": p["difficulty"],
            "fen": p["fen"],
            "turn": p["turn"],
            "instruction": p["instruction"],
            "hint": p["hint"]
        }
        for p in PUZZLES_DATABASE
    ]

def get_puzzle_by_id(puzzle_id: str) -> Optional[Dict[str, Any]]:
    for p in PUZZLES_DATABASE:
        if p["id"] == puzzle_id:
            return p
    return None

def verify_puzzle_solution(puzzle_id: str, move: str) -> Dict[str, Any]:
    puzzle = get_puzzle_by_id(puzzle_id)
    if not puzzle:
        return {
            "correct": False,
            "message": "Puzzle no encontrado.",
            "explanation": "",
            "next_puzzle_id": None
        }
    
    clean_move = move.strip().replace(" ", "").lower()
    accepted = [puzzle["solution_move"].lower()] + [m.lower() for m in puzzle.get("alternative_solutions", [])]
    
    # Check if normalized move is in accepted list
    is_correct = any(clean_move == acc.lower().replace("+", "").replace("#", "") or clean_move == acc.lower() for acc in accepted)
    
    # Find next puzzle ID
    current_idx = next((i for i, p in enumerate(PUZZLES_DATABASE) if p["id"] == puzzle_id), -1)
    next_id = PUZZLES_DATABASE[current_idx + 1]["id"] if current_idx != -1 and current_idx + 1 < len(PUZZLES_DATABASE) else None

    if is_correct:
        return {
            "correct": True,
            "message": "¡Excelente jugada! Has encontrado la táctica correcta.",
            "explanation": puzzle["explanation"],
            "next_puzzle_id": next_id
        }
    else:
        return {
            "correct": False,
            "message": "Esa no es la mejor jugada en esta posición.",
            "explanation": f"Pista: {puzzle['hint']}. Vuelve a intentarlo.",
            "next_puzzle_id": None
        }
