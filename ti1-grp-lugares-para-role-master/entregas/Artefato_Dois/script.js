// Simple carousel implementation
const carousel = document.querySelector('.simple-carousel');
if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const imgs = track ? Array.from(track.querySelectorAll('img')) : [];
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const btnPrev = carousel.querySelector('.prev');
    const btnNext = carousel.querySelector('.next');
    let current = 0;
    const total = imgs.length;
    let autoplay = null;
    const intervalMs = 3000;

    function update() {
        if (!track) return;
        track.style.transform = `translateX(-${current * 100}%)`;
        // dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }
    }

    function showNext() {
        if (total <= 1) return;
        current = (current + 1) % total;
        update();
    }
    function showPrev() {
        if (total <= 1) return;
        current = (current - 1 + total) % total;
        update();
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const b = document.createElement('button');
            if (i === 0) b.classList.add('active');
            b.addEventListener('click', () => { current = i; update(); });
            dotsContainer.appendChild(b);
        }
    }

    function startAutoplay() {
        if (autoplay || total <= 1) return;
        autoplay = setInterval(showNext, intervalMs);
    }
    function stopAutoplay() {
        if (!autoplay) return;
        clearInterval(autoplay);
        autoplay = null;
    }

    // attach events
    if (btnNext) btnNext.addEventListener('click', showNext);
    if (btnPrev) btnPrev.addEventListener('click', showPrev);
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }

    // touch support (simple)
    let startX = 0;
    let isTouch = false;
    track && track.addEventListener('touchstart', (e) => { isTouch = true; startX = e.touches[0].clientX; });
    track && track.addEventListener('touchmove', (e) => { if (!isTouch) return; const dx = e.touches[0].clientX - startX; if (Math.abs(dx) > 50) { if (dx > 0) showPrev(); else showNext(); isTouch = false; } });
    track && track.addEventListener('touchend', () => { isTouch = false; });

    // init
    createDots();
    update();
    startAutoplay();

    // reload after 24 hours with alert
    setTimeout(() => { alert('A página será atualizada!'); window.location.reload(); }, 24 * 60 * 60 * 1000);
}

// --------- Cafés clickable cards -> detail panel ---------
// Map data-key to full descriptions provided by the user
const cafeDescriptions = {
    uluru: {
        title: 'Uluru Café',
        html: 'Uluru Café — localizado no coração de um bairro com boas opções gastronômicas, o Uluru Café combina um ambiente acolhedor com um cardápio caprichado. É famoso pelo brunch, com pratos elaborados a partir de ingredientes locais e uma seleção de cafés especiais. Além do menu, o espaço oferece eventos culturais ocasionais e um atendimento atencioso que conquista moradores e visitantes.',
        images: ['images/uluru-cafe-o-brunch-mais.jpg'],
        address: 'Rua Exemplo, 45 - Centro',
        hours: 'Ter–Dom 09:00–15:00',
        instagram: 'https://instagram.com/uluru_cafe'
    },
    sterna: {
        title: 'Sterna Café',
        html: 'Sterna Café — começou como um pequeno projeto independente e ganhou reconhecimento por suas receitas autorais e atmosfera descontraída. Com a proposta de reunir pessoas, oferece opções para o dia todo: desde café da manhã reforçado a sanduíches e sobremesas. A expansão para novas unidades reflete sua aceitação local.',
        images: ['images/sterna-cafe-abrira-duas-unidades-belo-horizonte.jpg'],
        address: 'Av. Exemplo, 123 - Buritis',
        hours: 'Seg–Dom 08:00–18:00',
        instagram: 'https://instagram.com/sterna'
    },
    hangar: {
        title: 'Hangar dos Pães',
        html: 'Hangar dos Pães — uma padaria-cafeteria que se destaca por seus pães artesanais e confeitaria fina. O ambiente é ideal para quem busca um café da manhã caprichado ou uma pausa no fim da tarde. A combinação de padeiros experientes e ingredientes selecionados garante uma experiência saborosa.',
        images: ['images/hangar_paes.png'],
        address: 'Praça Exemplo, 7 - Savassi',
        hours: 'Seg–Sáb 07:00–19:00',
        instagram: 'https://instagram.com/hangardopaes'
    }
    ,
    mercado_central: {
        title: 'Mercado Central de Belo Horizonte',
        html: 'O Mercado Central é um dos pontos mais icônicos da cidade: arquitetura tradicional, bancas de comida, artesanato e produtos locais. Ideal para quem quer provar doces típicos, queijos mineiros e uma grande variedade de especiarias. Ótimo para fotos, lembranças e para entender a cultura local.',
        images: ['images/mercado_central.jpg'],
        address: 'Av. Augusto de Lima, 744 - Centro',
        hours: 'Seg–Sáb 07:00–18:00; Dom 07:00–14:00',
        instagram: 'https://instagram.com/mercadocentralbh'
    },
    parque_mangabeiras: {
        title: 'Parque das Mangabeiras',
        html: 'O Parque das Mangabeiras oferece trilhas, mirantes e vasta área verde com vistas panorâmicas da cidade. Ótimo para caminhadas ao ar livre, piqueniques e para quem busca contato com a natureza sem sair da cidade. Possui mirante com bela vista da cidade ao pôr do sol.',
        images: ['images/parque_mangabeiras.jpg'],
        address: 'R. Antônio Aleixo, s/n - Mangabeiras',
        hours: 'Diariamente 06:00–18:00',
        instagram: 'https://instagram.com/parquemangabeiras'
    },
    praca_liberdade: {
        title: 'Praça da Liberdade',
        html: 'A Praça da Liberdade é um espaço histórico e cultural, cercado por edifícios importantes e museus. É perfeita para passeios, exposições ao ar livre e para quem aprecia arquitetura e jardins bem cuidados.',
        images: ['images/praca_da_liberdade.avif'],
        address: 'Praça da Liberdade - Centro',
        hours: 'Aberta 24h (áreas públicas); museus têm horários variados',
        instagram: ''
    },
    lagoa_pampulha: {
        title: 'Lagoa da Pampulha',
        html: 'A Lagoa da Pampulha é um conjunto paisagístico com obras de Oscar Niemeyer, espaços culturais e opções de passeio à beira da água. Ideal para caminhadas, passeio de bicicleta e para apreciar a arquitetura moderna.',
        images: ['images/lagoa_da_pampulha.jpg'],
        address: 'Av. Otacílio Negrão de Lima - Pampulha',
        hours: 'Área externa aberta 24h; atrações e museus com horários específicos',
        instagram: 'https://instagram.com/pampulha'
    }
    ,
    parque_municipal: {
        title: 'Parque Municipal Américo Renné Giannetti',
        html: 'O Parque Municipal é uma área verde histórica no centro da cidade, com jardins bem cuidados, lagos e trilhas curtas. Frequentado por famílias e esportistas, abriga eventos culturais e feiras aos finais de semana.',
        images: ['images/parque.avif'],
        address: 'Av. Afonso Pena, s/n - Centro',
        hours: 'Diariamente 06:00–18:00',
        instagram: ''
    },
    museu_artes_oficios: {
        title: 'Museu de Artes e Ofícios',
        html: 'O Museu de Artes e Ofícios conta a história do trabalho e da indústria no Brasil, com acervo de ferramentas, máquinas e objetos do cotidiano. É uma ótima parada para quem gosta de história, design e do patrimônio material.',
        images: ['images/museu-de-artes-e-oficios-sesi_mg-1_0.jpg'],
        address: 'Praça da Estação, s/n - Centro',
        hours: 'Ter–Dom 10:00–17:00',
        instagram: 'https://instagram.com/museudeartesoficios'
    },
    praca_do_papa: {
        title: 'Praça do Papa',
        html: 'A Praça do Papa (Mirante) oferece uma das vistas mais famosas da cidade, localizada em um ponto alto com espaço para contemplação e eventos ao ar livre. É um lugar popular para ver o pôr do sol.',
        images: ['images/praca_do_papa.jpg'],
        address: 'Av. Afonso Pena - Mirante',
        hours: 'Aberta 24h',
        instagram: ''
    },
    igreja_sao_jose: {
        title: 'Igreja de São José',
        html: 'Igreja histórica com arquitetura característica da região, frequentemente utilizada para missas e eventos religiosos. Próxima a pontos culturais e centros históricos.',
        images: ['images/igreja_sao_jose.jpeg'],
        address: 'Rua da Igreja, s/n - Centro Histórico',
        hours: 'Seg–Dom 07:00–19:00',
        instagram: ''
    }
    ,
    igreja_pampulha: {
        title: 'Igreja São Francisco de Assis (Igrejinha)',
        html: 'A Igrejinha da Pampulha, projetada por Oscar Niemeyer com painéis de Cândido Portinari, é um ícone do conjunto arquitetônico e cultural da lagoa.',
        images: ['images/lagoa_da_pampulha.jpg'],
        address: 'Av. Otacílio Negrão de Lima - Pampulha',
        hours: 'Visitação conforme eventos e cerimônias; ver programações locais',
        instagram: ''
    },
    casa_do_baile: {
        title: 'Casa do Baile',
        html: 'A Casa do Baile é um espaço cultural e ponto de referência arquitetônica na orla da Pampulha, perfeito para fotos e exposições temporárias.',
        images: ['images/Parque_Ecologico_da_Pampulha.jpg'],
        address: 'Orla da Lagoa - Pampulha',
        hours: 'Horario de abertura variável conforme exposições',
        instagram: ''
    },
    museu_pampulha: {
        title: 'Museu de Arte da Pampulha',
        html: 'Espaço com programação cultural focada em artes visuais e atividades educativas ao redor da Lagoa da Pampulha.',
        images: ['images/Parque_Ecologico_da_Pampulha.jpg'],
        address: 'Orla da Lagoa - Pampulha',
        hours: 'Consulte agenda do museu para horários',
        instagram: ''
    },
    orla_pampulha: {
        title: 'Orla da Pampulha e Ciclovia',
        html: 'A orla da Pampulha possui pista para caminhada e ciclovia, com mirantes e locais para observação do pôr do sol.',
        images: ['images/lagoa_da_pampulha.jpg'],
        address: 'Orla da Lagoa da Pampulha',
        hours: 'Área pública aberta 24h',
        instagram: ''
    }
};

// expose place data for other pages (place.html) to read
window.PLACE_DATA = cafeDescriptions;

// Make images clickable: if an image belongs to a .cafe-card (data-key) navigate to place.html?place=key
// Otherwise navigate to place.html with image and title query params.
function initImageLinks() {
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach(img => {
        // ignore modal images and thumbs
        if (img.closest && (img.closest('#cafe-modal') || img.closest('#category-modal'))) return;
        // set pointer cursor for images that represent a place or have an alt
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            // if the image is inside a cafe-card, prefer that key
            const card = img.closest && img.closest('.cafe-card');
            if (card && card.dataset && card.dataset.key) {
                const key = card.dataset.key;
                window.location.href = `place.html?place=${encodeURIComponent(key)}`;
                return;
            }
            // if image has an explicit data-place attribute, use it
            if (img.dataset && img.dataset.place) {
                window.location.href = `place.html?place=${encodeURIComponent(img.dataset.place)}`;
                return;
            }
            // fallback: open place page with image src and alt as title
            const src = img.getAttribute('src') || '';
            const alt = img.getAttribute('alt') || '';
            window.location.href = `place.html?img=${encodeURIComponent(src)}&title=${encodeURIComponent(alt)}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', initImageLinks);

function initCafeCards() {
    const cards = document.querySelectorAll('.cafe-card');
    const detail = document.getElementById('cafe-detail');
    if (!detail) return;

    function showDetail(key) {
        const d = cafeDescriptions[key];
        if (!d) {
            detail.innerHTML = '<p>Descrição não disponível.</p>';
            return;
        }
        detail.innerHTML = `<h3>${d.title}</h3><p>${d.html}</p>`;
        // scroll into view on small screens
        if (window.innerWidth < 900) {
            detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.key;
            showDetail(key);
            openCafeModal(key);
        });
    });

    // show first available by default
    const first = cards[0];
    if (first) showDetail(first.dataset.key);
}

// initialize when DOM is ready (carousel init already runs on DOMContentLoaded)
document.addEventListener('DOMContentLoaded', initCafeCards);

// -------- Category click -> show short lists --------
function initCategoryLists() {
    const categoryGrid = document.querySelector('.category-grid');
    if (!categoryGrid) return;

    // mapping of category heading -> items (we'll show all available items)
    const categoryData = {
        'Museus': {
            items: ['Museu de Artes e Ofícios', 'Museu Mineiro', 'Museu Inimá de Paula']
        },
        'Parques': {
            items: ['Parque Municipal']
        },
        'Praças': {
            items: ['Praça da Liberdade', 'Praça do Papa', 'Praça Sete de Setembro']
        },
        'Patrimônio': {
            items: ['Igreja de São José', 'Catedral da Boa Viagem', 'Museu Clube da Esquina', 'Casa Fiat de Cultura', 'Casa do Baile', 'Igreja São Francisco de Assis (Pampulha)', 'Edifício Niemeyer', 'Mercado Central (arquitetura)', 'Praça Sete', 'Solar da Baronesa']
        },
        'Outros': {
            items: ['Mercado Central', 'Bairro Savassi', 'Feira de Artesanato', 'Palácio das Artes']
        }
    };

    // create results container (insert after category-grid)
    let results = document.querySelector('.category-results');
    if (!results) {
        results = document.createElement('div');
        results.className = 'category-results';
        // insert after categoryGrid's parent (categories section)
        const categoriesSection = categoryGrid.closest('.categories') || categoryGrid.parentNode;
        categoriesSection.appendChild(results);
    }

    function renderCategory(key) {
        const data = categoryData[key];
        if (!data) {
            results.innerHTML = `<h4>Resultados</h4><p class="meta">Nenhuma informação disponível para '${key}'.</p>`;
            results.scrollIntoView({behavior: 'smooth'});
            return;
        }
    // show all available items for the category
    const listItems = data.items.map(i => `<li class="cat-result-item">${i}</li>`).join('');
    results.innerHTML = `<button class="close-results" aria-label="Fechar">✕</button><h4>${key}</h4><ul>${listItems}</ul>`;
        const closeBtn = results.querySelector('.close-results');
        closeBtn && closeBtn.addEventListener('click', () => { results.innerHTML = ''; });
        results.scrollIntoView({behavior: 'smooth'});
        // if this is the 'Patrimônio' category and it has many items, open the category modal
        if (key === 'Patrimônio' && Array.isArray(data.items) && data.items.length) {
            openCategoryModal(data.items, key);
        }
    }

    // attach click handlers to each category card
    const cards = categoryGrid.querySelectorAll('.category');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const titleEl = card.querySelector('h4');
            const key = titleEl ? titleEl.textContent.trim() : null;
            // visual feedback: mark selected card
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            if (key) renderCategory(key);
        });
    });
}

document.addEventListener('DOMContentLoaded', initCategoryLists);

// -------- Category modal logic (for large categories like 'Patrimônio') --------
const categoryModal = document.getElementById('category-modal');
const catModalTitle = categoryModal && categoryModal.querySelector('.category-window-title');
const catModalDesc = categoryModal && categoryModal.querySelector('.category-window-desc');
const catBtnPrev = categoryModal && categoryModal.querySelector('.category-prev');
const catBtnNext = categoryModal && categoryModal.querySelector('.category-next');
const catClose = categoryModal && categoryModal.querySelector('.category-modal-close');
const catCounter = categoryModal && categoryModal.querySelector('.category-counter');

let categoryState = { items: [], index: 0, title: '' };

function openCategoryModal(items, title) {
    if (!categoryModal) return;
    categoryState.items = Array.isArray(items) ? items : [];
    categoryState.index = 0;
    categoryState.title = title || '';
    categoryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderCategoryModal();
}

function closeCategoryModal() {
    if (!categoryModal) return;
    categoryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    categoryState.items = [];
}

function renderCategoryModal() {
    const idx = categoryState.index || 0;
    const items = categoryState.items || [];
    const item = items[idx] || '';
    if (catModalTitle) catModalTitle.textContent = item || categoryState.title;
    if (catModalDesc) catModalDesc.textContent = item ? `Informação sobre ${item}.` : '';
    if (catCounter) catCounter.textContent = `${idx + 1} de ${items.length}`;
}

if (catBtnPrev) catBtnPrev.addEventListener('click', () => {
    if (!categoryState.items.length) return;
    categoryState.index = (categoryState.index - 1 + categoryState.items.length) % categoryState.items.length;
    renderCategoryModal();
});
if (catBtnNext) catBtnNext.addEventListener('click', () => {
    if (!categoryState.items.length) return;
    categoryState.index = (categoryState.index + 1) % categoryState.items.length;
    renderCategoryModal();
});
if (catClose) catClose.addEventListener('click', closeCategoryModal);

// backdrop and Escape key
document.addEventListener('click', (e) => {
    const action = e.target && e.target.closest && e.target.closest('[data-action]');
    if (action && action.dataset && action.dataset.action === 'close') {
        // close both category and cafe modals if present
        closeCafeModal();
        closeCategoryModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (!categoryModal || categoryModal.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeCategoryModal();
    if (e.key === 'ArrowLeft') catBtnPrev && catBtnPrev.click();
    if (e.key === 'ArrowRight') catBtnNext && catBtnNext.click();
});

// -------- Modal gallery & details --------
const modal = document.getElementById('cafe-modal');
const modalImage = modal && modal.querySelector('.modal-image');
const modalTitle = modal && modal.querySelector('.modal-title');
const modalDesc = modal && modal.querySelector('.modal-desc');
const modalAddr = modal && modal.querySelector('.modal-addr');
const modalHours = modal && modal.querySelector('.modal-hours');
const modalInsta = modal && modal.querySelector('.modal-insta');
const modalMap = modal && modal.querySelector('.modal-map');
const btnPrev = modal && modal.querySelector('.modal-prev');
const btnNext = modal && modal.querySelector('.modal-next');
const modalThumbs = modal && modal.querySelector('.modal-thumbs');

let modalState = { key: null, index: 0 };

function openCafeModal(key) {
    if (!modal) return;
    const data = cafeDescriptions[key];
    if (!data) return;
    modalState.key = key;
    modalState.index = 0;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderModal();
}

function closeCafeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalState.key = null;
}

function renderModal() {
    const key = modalState.key;
    const idx = modalState.index || 0;
    const data = cafeDescriptions[key];
    if (!data) return;
    const imgs = Array.isArray(data.images) && data.images.length ? data.images : [];
    const src = imgs[idx] || imgs[0] || '';
    if (modalImage) { modalImage.src = src; modalImage.alt = data.title; }
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.html;
    if (modalAddr) modalAddr.textContent = 'Endereço: ' + (data.address || '—');
    if (modalHours) modalHours.textContent = 'Horário: ' + (data.hours || '—');
    if (modalInsta) { modalInsta.href = data.instagram || '#'; modalInsta.textContent = data.instagram ? 'Instagram' : ''; modalInsta.style.display = data.instagram ? 'inline-block' : 'none'; }
    if (modalMap) {
        if (data.address) {
            const q = encodeURIComponent(data.address);
            modalMap.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
            modalMap.textContent = 'Abrir no mapa';
            modalMap.style.display = 'inline-block';
        } else {
            modalMap.href = '#';
            modalMap.style.display = 'none';
        }
    }

    // render thumbnails
    if (modalThumbs) {
        modalThumbs.innerHTML = '';
        imgs.forEach((iSrc, i) => {
            const img = document.createElement('img');
            img.src = iSrc;
            img.alt = data.title + ' — foto ' + (i + 1);
            img.className = 'modal-thumb' + (i === idx ? ' active' : '');
            img.addEventListener('click', () => {
                modalState.index = i;
                renderModal();
            });
            modalThumbs.appendChild(img);
        });
    }
}

// navigation
if (btnPrev) btnPrev.addEventListener('click', () => {
    const key = modalState.key; if (!key) return; const imgs = cafeDescriptions[key].images || []; if (!imgs.length) return; modalState.index = (modalState.index - 1 + imgs.length) % imgs.length; renderModal();
});
if (btnNext) btnNext.addEventListener('click', () => {
    const key = modalState.key; if (!key) return; const imgs = cafeDescriptions[key].images || []; if (!imgs.length) return; modalState.index = (modalState.index + 1) % imgs.length; renderModal();
});

// close handlers (buttons and backdrop)
document.addEventListener('click', (e) => {
    const action = e.target && e.target.closest && e.target.closest('[data-action]');
    if (action && action.dataset && action.dataset.action === 'close') closeCafeModal();
});

// keyboard
document.addEventListener('keydown', (e) => {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeCafeModal();
    if (e.key === 'ArrowLeft') btnPrev && btnPrev.click();
    if (e.key === 'ArrowRight') btnNext && btnNext.click();
});

// click outside modal content closes
if (modal) {
    const backdrop = modal.querySelector('.cafe-modal-backdrop');
    backdrop && backdrop.addEventListener('click', closeCafeModal);
}
