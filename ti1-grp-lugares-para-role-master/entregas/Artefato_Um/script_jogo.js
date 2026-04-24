const WINNERS_DATA = [
    { 
        name: "Praça da Liberdade", 
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.9999!2d-43.938!3d-19.920!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6998d1234abcd%3A0x123456789!2sPraça%20da%20Liberdade!5e0!3m2!1spt-BR!2sbr!4v1234567890"
    },
    { 
        name: "Mercado Central de BH", 
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.9999!2d-43.940!3d-19.921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6998d5678efgh%3A0x987654321!2sMercado%20Central%20de%20BH!5e0!3m2!1spt-BR!2sbr!4v1234567890"
    },
    { 
        name: "Palácio das Artes", 
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.9999!2d-43.937!3d-19.922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6998d90123456%3A0xabcdef123456789!2sPalácio%20das%20Artes!5e0!3m2!1spt-BR!2sbr!4v1234567890"
    },
    { 
        name: "Café com Letras", 
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.9999!2d-43.939!3d-19.923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6998dabcdef12%3A0x1234abcd5678!2sCafé%20com%20Letras!5e0!3m2!1spt-BR!2sbr!4v1234567890"
    },
    { 
        name: "Cine Theatro Brasil Vallourec", 
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.9999!2d-43.938!3d-19.924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6998dcdef3456%3A0x123456abcdef!2sCine%20Theatro%20Brasil%20Vallourec!5e0!3m2!1spt-BR!2sbr!4v1234567890"
    }
];

let options = [];

function renderOptions() {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.innerHTML = `
            <button class="btn-vote" onclick="removeVote(${option.id})">−</button>
            <span class="option-name">${option.name}</span>
            <span class="vote-count">${option.votes}</span>
            <button class="btn-vote" onclick="addVote(${option.id})">+</button>
        `;
        container.appendChild(optionDiv);
    });

    const addDiv = document.createElement('div');
    addDiv.className = 'option add-option';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Digite o Lugar';
    input.className = 'input-option';
    input.setAttribute('list', 'suggestions');

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            addOption(input.value.trim());
            input.value = '';
        }
    });

    addDiv.appendChild(input);
    container.appendChild(addDiv);

    let datalist = document.getElementById('suggestions');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'suggestions';
        document.body.appendChild(datalist);
    }
    datalist.innerHTML = '';
    WINNERS_DATA.forEach(w => {
        const optionElem = document.createElement('option');
        optionElem.value = w.name;
        datalist.appendChild(optionElem);
    });
}

function addVote(optionId) {
    const option = options.find(o => o.id === optionId);
    if (option) option.votes++;
    renderOptions();
}

// A função createAutocomplete não será utilizada diretamente como antes, mas o datalist já oferece uma funcionalidade similar.
// Mantendo a função para referência, mas o foco será no datalist para manter a simplicidade.
function createAutocomplete(input, data) {
    let suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'autocomplete-items';
    input.parentNode.appendChild(suggestionsContainer);

    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        suggestionsContainer.innerHTML = '';

        if (!value) return;

        data.forEach(item => {
            if (item.name.toLowerCase().includes(value)) {
                const suggestion = document.createElement('div');
                suggestion.textContent = item.name;

                suggestion.addEventListener('click', () => {
                    input.value = item.name; 
                    suggestionsContainer.innerHTML = '';
                });

                suggestionsContainer.appendChild(suggestion);
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (e.target !== input) {
            suggestionsContainer.innerHTML = '';
        }
    });
}

// Uso do autocomplete (mantido para compatibilidade, mas o datalist é o principal)
// const input = document.querySelector('.input-option'); 
// if (input) createAutocomplete(input, WINNERS_DATA);

function removeVote(optionId) {
    const optionIndex = options.findIndex(o => o.id === optionId);
    if (optionIndex !== -1) {
        if (options[optionIndex].votes > -1) {
            options[optionIndex].votes--;
        }
        if (options[optionIndex].votes === -1) {
            options.splice(optionIndex, 1); // Remove a opção se os votos chegarem a -1
        }
    }
    renderOptions();
}

function addOption(name) {
    // Verifica se a opção já existe para evitar duplicatas
    if (!options.some(o => o.name.toLowerCase() === name.toLowerCase())) {
        const newId = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
        options.push({ id: newId, name, votes: 0 });
    }
    renderOptions();
}

function confirmVotes() {
    if (options.length === 0) { alert('Adicione pelo menos uma opção antes de confirmar!'); return; }

    // Filtra opções com votos positivos ou zero, ignorando as que foram "removidas" com -1
    const votableOptions = options.filter(o => o.votes >= 0);

    if (votableOptions.length === 0) { alert('Você precisa votar em pelo menos uma opção com votos positivos!'); return; }

    const maxVotes = Math.max(...votableOptions.map(o => o.votes));
    if (maxVotes === 0) { alert('Você precisa votar em pelo menos uma opção!'); return; }

    const winners = votableOptions.filter(o => o.votes === maxVotes);
    const winner = winners[Math.floor(Math.random() * winners.length)];

    const winnerData = WINNERS_DATA.find(w => w.name === winner.name);

    document.getElementById('winnerName').textContent = winner.name;

    const mapContainer = document.getElementById('winnerMap');
    if (winnerData && winnerData.map) {
        mapContainer.innerHTML = `<iframe 
            src="${winnerData.map}" 
            width="100%" 
            height="300" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>`;
    } else mapContainer.innerHTML = '';

    document.getElementById('votingPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
}

function resetGame() {
    options = [];
    renderOptions();
    document.getElementById('votingPage').classList.remove('hidden');
    document.getElementById('resultPage').classList.add('hidden');
}

renderOptions();