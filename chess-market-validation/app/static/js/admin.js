document.addEventListener('DOMContentLoaded', () => {
    // Simulator Inputs
    const spendInput = document.getElementById('simSpend');
    const cpcInput = document.getElementById('simCpc');
    const convInput = document.getElementById('simConv');
    const preorderInput = document.getElementById('simPreorder');
    const priceInput = document.getElementById('simPrice');

    const spendVal = document.getElementById('simSpendVal');
    const cpcVal = document.getElementById('simCpcVal');
    const convVal = document.getElementById('simConvVal');
    const preorderVal = document.getElementById('simPreorderVal');
    const priceVal = document.getElementById('simPriceVal');

    // Outputs
    const resClicks = document.getElementById('resClicks');
    const resLeads = document.getElementById('resLeads');
    const resBuyers = document.getElementById('resBuyers');
    const resRevenue = document.getElementById('resRevenue');
    const resProfit = document.getElementById('resProfit');
    const resRoas = document.getElementById('resRoas');
    const resCpl = document.getElementById('resCpl');
    const resCac = document.getElementById('resCac');
    const resVerdict = document.getElementById('resVerdict');

    function updateSimulation() {
        if (!spendInput) return;

        const spend = parseFloat(spendInput.value);
        const cpc = parseFloat(cpcInput.value);
        const conv = parseFloat(convInput.value) / 100;
        const preorder = parseFloat(preorderInput.value) / 100;
        const price = parseFloat(priceInput.value);

        if (spendVal) spendVal.textContent = `€${spend}`;
        if (cpcVal) cpcVal.textContent = `€${cpc.toFixed(2)}`;
        if (convVal) convVal.textContent = `${(conv * 100).toFixed(0)}%`;
        if (preorderVal) preorderVal.textContent = `${(preorder * 100).toFixed(0)}%`;
        if (priceVal) priceVal.textContent = `€${price}`;

        const clicks = Math.floor(spend / cpc);
        const leads = Math.floor(clicks * conv);
        const buyers = Math.floor(leads * preorder);
        const revenue = buyers * price;
        const profit = revenue - spend;
        const roas = spend > 0 ? (revenue / spend).toFixed(2) : 0;
        const cpl = leads > 0 ? (spend / leads).toFixed(2) : 0;
        const cac = buyers > 0 ? (spend / buyers).toFixed(2) : 0;

        if (resClicks) resClicks.textContent = clicks.toLocaleString();
        if (resLeads) resLeads.textContent = leads.toLocaleString();
        if (resBuyers) resBuyers.textContent = buyers.toLocaleString();
        if (resRevenue) resRevenue.textContent = `€${revenue.toLocaleString()}`;
        if (resProfit) {
            resProfit.textContent = `€${profit.toLocaleString()}`;
            resProfit.style.color = profit >= 0 ? '#10b981' : '#ef4444';
        }
        if (resRoas) resRoas.textContent = `${roas}x`;
        if (resCpl) resCpl.textContent = `€${cpl}`;
        if (resCac) resCac.textContent = `€${cac}`;

        if (resVerdict) {
            if (roas >= 2.0) {
                resVerdict.className = 'puzzle-feedback success';
                resVerdict.textContent = '🟢 Altamente Rentable: Retorno inmediato positivo sobre la inversión publicitaria.';
            } else if (roas >= 1.0) {
                resVerdict.className = 'puzzle-feedback success';
                resVerdict.textContent = '🟡 Auto-liquidable: El embudo cubre el coste de adquisición y crea una lista de clientes gratuita.';
            } else {
                resVerdict.className = 'puzzle-feedback error';
                resVerdict.textContent = '🔴 En Pérdida: Requiere mejorar el gancho de la landing page o aumentar el precio del pack inicial.';
            }
            resVerdict.style.display = 'block';
        }
    }

    [spendInput, cpcInput, convInput, preorderInput, priceInput].forEach(inp => {
        if (inp) inp.addEventListener('input', updateSimulation);
    });

    updateSimulation();
});
