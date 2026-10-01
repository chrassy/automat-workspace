# 06. Plan de Pruebas de Mercado y Criterios Go / No-Go

## 1. Criterios de Validación (Matriz Go / No-Go)

Antes de invertir tiempo grabando vídeos o construyendo una plataforma completa, evaluamos los resultados de la fase de validación con las siguientes métricas objetivas:

| Métrica de Validación | Verde (Aprobado / GO) | Amarillo (Iterar Ángulo) | Rojo (No-Go / Pivotar) |
| :--- | :--- | :--- | :--- |
| **Tasa de Conversión Landing (Opt-in)** | > 22% de visitantes dejan email | 12% - 21% | < 12% |
| **Coste por Lead (CPL)** | < €0.80 en España (< €0.30 LATAM) | €0.80 - €1.50 | > €1.50 |
| **Intención de Compra (Clic en Checkout/Precio)** | > 15% de los leads completan encuesta de compra | 8% - 14% | < 8% |
| **Pre-ventas / Compromiso de Pago** | > 15 reservas o depósitos en 14 días | 5 - 14 reservas | < 5 reservas |
| **Tasa de Apertura de Emails (Nurture)** | > 45% en Email 1 / > 30% en secuencia | 25% - 44% | < 25% |

---

## 2. Plan de Acción de 14 Días para la Prueba de Mercado

### Días 1 a 3: Despliegue Técnico y Configuración
* [x] Desplegar la aplicación de landing page y panel de analítica.
* [x] Configurar píxeles de seguimiento (Meta Pixel / Google Tag) y eventos personalizados (`Lead`, `InitiateCheckout`, `SurveyCompleted`).
* [x] Configurar secuencia de email de bienvenida automática.

### Días 4 a 10: Ejecución de Campañas de Tráfico
* [ ] Lanzar campaña en Meta Ads (€15/día) repartida en 3 anuncios (Dolor de ELO, Reto táctico, Niños).
* [ ] Lanzar campaña en Google Search Ads (€5/día) con palabras clave de alta intención.
* [ ] Medir CTR, CPC y tasa de rebote diariamente.
* [ ] Desactivar el anuncio con peor rendimiento al día 3 y redoblar presupuesto en el mejor anuncio.

### Días 11 a 14: Análisis de Datos y Decisión de Negocio
* [ ] Analizar en el panel de control qué variante (A, B o C) generó más registros y mayor intención de compra.
* [ ] Evaluar el nivel promedio de los usuarios registrados y sus respuestas en la encuesta.
* [ ] Enviar el correo de oferta beta con descuento prioritario a los usuarios captados.
* [ ] Medir las conversiones de preventa y tomar la decisión final de grabación y lanzamiento completo.
