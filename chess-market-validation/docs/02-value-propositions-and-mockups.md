# 02. Propuestas de Valor, Wireframes y Conceptos a Testear

## 1. Los 3 Conceptos a Validar (A/B/C Testing)

Para no asumir lo que el mercado prefiere antes de programar, testeamos 3 ángulos de marketing mediante variantes en la landing page:

| Variante | Nombre del Concepto | Ángulo de Venta | Gancho Principal (Hook) |
| :--- | :--- | :--- | :--- |
| **Variante A** | *El Método 15 Minutos al Día* | Productividad y micro-aprendizaje para adultos ocupados | "¿Estancado en 1000 de ELO? Sube +300 puntos entrenando solo 15 minutos al día con nuestro sistema de patrones visuales." |
| **Variante B** | *Ajedrez Pro: Masterclass + Mentor IA* | Aprendizaje profundo, moderno y tecnológico | "Aprende ajedrez como los Grandes Maestros con análisis guiado paso a paso y tutor interactivo inteligente." |
| **Variante C** | *Ajedrez en Familia / Junior Academy* | Beneficios cognitivos para niños y unión familiar | "El método interactivo en español para que tus hijos desarrollen concentración, lógica y memoria jugando al ajedrez." |

---

## 2. Arquitectura de la Landing Page de Validación (Smoke Test)

```
+-----------------------------------------------------------------------------------+
|  [LOGO] AjedrezPro               [Selector de Variante A/B/C]     [Acceso Temprano] |
+-----------------------------------------------------------------------------------+
|  HERO SECTION:                                                                    |
|  - Titular Impactante según variante activa                                       |
|  - Subtítulo con promesa clara de resultado (ej. "+300 puntos de ELO en 30 días")|
|  - Formulario de Captura Rápida (Email + Nivel de ELO)                             |
|  - Social Proof: "Únete a +1,420 jugadores en lista de espera"                    |
|  - Demo interactiva: Mini-Puzzle Táctico en vivo en el navegador                 |
+-----------------------------------------------------------------------------------+
|  BENEFICIOS CLAVE & EL PROBLEMA (Agitación de dolor):                             |
|  - Por qué jugar partidas blitz sin parar NO te hace mejorar                      |
|  - Los 3 errores que comete el 90% de los jugadores en 1000-1400 ELO              |
|  - El método de 3 pasos: Visión Táctica, Planes de Medio Juego, Finales Clave     |
+-----------------------------------------------------------------------------------+
|  DEMOSTRACIÓN INTERACTIVA DEL TABLERO:                                            |
|  - Ejercicio táctico interactivo ("Encuentra el mate en 2")                       |
|  - Feedback inmediato y gancho de lead magnet ("Descarga los 50 patrones gratis") |
+-----------------------------------------------------------------------------------+
|  TEST DE PRECIOS (SMOKE TEST / INTENCIÓN DE COMPRA):                              |
|  - Opción 1: Starter Pack (€19) -> [Reservar con 50% de descuento]                |
|  - Opción 2: Curso Completo + App (€29) -> [Más Popular - Reservar]              |
|  - Opción 3: Membresía VIP + Análisis (€9.99/mes) -> [Quiero ser Beta Tester]    |
|  * Al pulsar, abre Modal de Calificación con encuesta de disposición de pago      |
+-----------------------------------------------------------------------------------+
|  FAQ & TESTIMONIOS (Mocks de Validación):                                         |
|  - Preguntas frecuentes sobre tiempo, compatibilidad móvil, nivel requerido       |
|  - Llamada a la acción final                                                      |
+-----------------------------------------------------------------------------------+
```

---

## 3. Estrategia de Encuesta de Calificación (Micro-Survey Modal)

Cuando el usuario hace clic en "Reservar Descuento" o "Quiero Unirme", se recopilan datos cruciales para el desarrollo del producto:
1. **Nivel actual de Ajedrez:** (Principiante / 800-1200 / 1200-1600 / +1600).
2. **Mayor frustración:** (Cometo errores tontos / No sé qué hacer tras la apertura / Pierdo finales ganados).
3. **Preferencia de formato:** (App móvil / Vídeos paso a paso / Ejercicios interactivos / Clases en vivo).
4. **Precio dispuesto a pagar:** (€15 - €30 - €50+).

---

## 4. Lead Magnet de Entrada (Gancho de Captación)
* **Nombre:** *"El Manual Secreto de los 15 Patrones de Mate que Todo Jugador Debe Conocer" (PDF + 30 Puzzles interactivos).*
* **Costo de Producción:** $0 (creado por nosotros mismos con herramientas estándar).
* **Función:** Generar confianza inmediata, recopilar correo electrónico verificado y preparar el terreno para la preventa.
