document.addEventListener('DOMContentLoaded', () => {
    // 1. UTM and URL Query Params Capture
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || 'direct';
    const utmMedium = urlParams.get('utm_medium') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';
    const currentVariant = urlParams.get('variant') || 'A';

    // 2. Modal Handling
    const modalOverlay = document.getElementById('qualificationModal');
    const modalCloseBtn = document.getElementById('closeModalBtn');
    const surveyForm = document.getElementById('surveyForm');
    const tierInput = document.getElementById('selectedTierInput');
    const priceInput = document.getElementById('selectedPriceInput');

    // Trigger buttons for reservation / pricing tier smoke test
    document.querySelectorAll('.trigger-preorder').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tier = btn.getAttribute('data-tier') || 'course_29';
            const price = btn.getAttribute('data-price') || '29';
            if (tierInput) tierInput.value = tier;
            if (priceInput) priceInput.value = price;
            openModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    function openModal() {
        if (modalOverlay) modalOverlay.classList.add('active');
    }

    function closeModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    // 3. Quick Email Form in Hero Section
    const quickForm = document.getElementById('quickLeadForm');
    const quickStatus = document.getElementById('quickLeadStatus');

    if (quickForm) {
        quickForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('quickEmail');
            const eloInput = document.getElementById('quickElo');
            const submitBtn = quickForm.querySelector('button[type="submit"]');

            const payload = {
                email: emailInput.value.trim(),
                elo_range: eloInput ? eloInput.value : '800-1200',
                variant: currentVariant.toUpperCase(),
                utm_source: utmSource,
                utm_medium: utmMedium || undefined,
                utm_campaign: utmCampaign || undefined,
                interested_tier: 'course_29',
                willingness_to_pay: 29.0
            };

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                const res = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (res.ok) {
                    quickStatus.className = 'puzzle-feedback success';
                    quickStatus.innerHTML = '🎉 ¡Registro completado con éxito! Revisa tu bandeja de entrada para descargar la guía de aperturas en PDF.';
                    quickStatus.style.display = 'block';
                    quickForm.reset();
                } else {
                    quickStatus.className = 'puzzle-feedback error';
                    quickStatus.textContent = data.detail || 'Hubo un error al registrar tu correo.';
                    quickStatus.style.display = 'block';
                }
            } catch (err) {
                quickStatus.className = 'puzzle-feedback error';
                quickStatus.textContent = 'Error de conexión. Inténtalo de nuevo.';
                quickStatus.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Desbloquear Guía y Acceso VIP';
            }
        });
    }

    // 4. Modal Survey Form Submission
    if (surveyForm) {
        surveyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('modalEmail').value.trim();
            const name = document.getElementById('modalName').value.trim();
            const elo = document.getElementById('modalElo').value;
            const frustration = document.getElementById('modalFrustration').value;
            const tier = document.getElementById('selectedTierInput').value;
            const price = parseFloat(document.getElementById('selectedPriceInput').value) || 29.0;
            const submitBtn = surveyForm.querySelector('button[type="submit"]');
            const statusDiv = document.getElementById('modalStatus');

            const payload = {
                email: email,
                name: name,
                elo_range: elo,
                main_frustration: frustration,
                interested_tier: tier,
                willingness_to_pay: price,
                variant: currentVariant.toUpperCase(),
                utm_source: utmSource,
                utm_medium: utmMedium || undefined,
                utm_campaign: utmCampaign || undefined
            };

            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando reserva...';

            try {
                const res = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (res.ok) {
                    statusDiv.className = 'puzzle-feedback success';
                    statusDiv.innerHTML = '✨ ¡Plaza reservada con éxito con 50% de descuento! Te hemos asignado el cupón <strong>BETA50</strong> por correo.';
                    statusDiv.style.display = 'block';
                    setTimeout(() => {
                        closeModal();
                        statusDiv.style.display = 'none';
                    }, 4000);
                } else {
                    statusDiv.className = 'puzzle-feedback error';
                    statusDiv.textContent = data.detail || 'Hubo un error al procesar la reserva.';
                    statusDiv.style.display = 'block';
                }
            } catch (err) {
                statusDiv.className = 'puzzle-feedback error';
                statusDiv.textContent = 'Error de red. Inténtalo de nuevo.';
                statusDiv.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Confirmar Mi Reserva con 50% Dto';
            }
        });
    }

    // 5. Interactive Puzzle Logic
    const puzzleOptions = document.querySelectorAll('.puzzle-option-btn');
    const puzzleFeedback = document.getElementById('puzzleFeedback');

    puzzleOptions.forEach(btn => {
        btn.addEventListener('click', async () => {
            const puzzleId = btn.getAttribute('data-puzzle-id') || 'puzzle-1';
            const move = btn.getAttribute('data-move');

            try {
                const res = await fetch('/api/puzzles/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ puzzle_id: puzzleId, move: move })
                });
                const result = await res.json();

                if (result.correct) {
                    puzzleFeedback.className = 'puzzle-feedback success';
                    puzzleFeedback.innerHTML = `<strong>${result.message}</strong><br>${result.explanation}`;
                    puzzleFeedback.style.display = 'block';
                } else {
                    puzzleFeedback.className = 'puzzle-feedback error';
                    puzzleFeedback.innerHTML = `<strong>${result.message}</strong><br>${result.explanation}`;
                    puzzleFeedback.style.display = 'block';
                }
            } catch (err) {
                puzzleFeedback.className = 'puzzle-feedback error';
                puzzleFeedback.textContent = 'Error al verificar la jugada.';
                puzzleFeedback.style.display = 'block';
            }
        });
    });
});
