// place.js - render place details based on query params
(function(){
    function qs() {
        const q = {};
        const s = location.search.replace(/^\?/, '');
        if (!s) return q;
        s.split('&').forEach(pair => {
            const [k, v] = pair.split('=');
            if (!k) return;
            q[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
        });
        return q;
    }

    function safeText(s) { return s == null ? '' : String(s); }

    document.addEventListener('DOMContentLoaded', () => {
        const params = qs();
        const root = document.getElementById('place-root');
        const titleEl = document.getElementById('place-title');
        const imgEl = document.getElementById('place-image');
        const descEl = document.getElementById('place-desc');
        const metaEl = document.getElementById('place-meta');
        const hoursEl = document.getElementById('place-hours');
        const linksEl = document.getElementById('place-links');
        const backBtn = document.getElementById('back-btn');

        backBtn && backBtn.addEventListener('click', () => {
            if (history.length > 1) history.back(); else location.href = 'index.html';
        });

        // try to render by place key
        const placeKey = params.place;
        if (placeKey && window.PLACE_DATA && window.PLACE_DATA[placeKey]) {
            const d = window.PLACE_DATA[placeKey];
            titleEl.textContent = d.title || placeKey;
            descEl.textContent = d.html || '';
            if (d.images && d.images.length) imgEl.src = d.images[0];
            imgEl.alt = d.title || '';
            metaEl.textContent = d.address ? 'Endereço: ' + d.address : '';
            hoursEl.textContent = d.hours ? 'Horário: ' + d.hours : '';
            // build links: instagram (if any) and Google Maps link based on address
            const parts = [];
            if (d.instagram) parts.push(`<a href="${d.instagram}" target="_blank" rel="noopener">Instagram</a>`);
            if (d.address) {
                const q = encodeURIComponent(d.address);
                parts.push(`<a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Abrir no mapa</a>`);
            }
            linksEl.innerHTML = parts.join(' ');
            return;
        }

        // fallback: use img and title query params
        const img = params.img;
        const title = params.title || '';
        if (img) {
            imgEl.src = img;
            imgEl.alt = title;
            titleEl.textContent = title || 'Detalhe do lugar';
            descEl.textContent = 'Descrição não disponível para este item.';
            return;
        }

        // nothing to show
        titleEl.textContent = 'Lugar não encontrado';
        descEl.textContent = 'Não foi possível localizar informações deste lugar.';
    });
})();