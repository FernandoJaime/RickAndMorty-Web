// Configuración de la API
const url_api = 'https://rickandmortyapi.com/api';
const personajes_por_pagina = 20; // Cantidad de personajes que se mostrarán en cada pagina

// Estado global (variables que se usarán en todo el programa)
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    name: '',
    status: '',
    gender: ''
};

// DOM Elements (obtengo todos los elementos que se usarán)
const elements = {
    nameFilter: document.getElementById('nameFilter'),
    statusFilter: document.getElementById('statusFilter'),
    genderFilter: document.getElementById('genderFilter'),
    applyFiltersBtn: document.getElementById('applyFilters'),
    charactersGrid: document.getElementById('charactersGrid'),
    loading: document.getElementById('loading'),
    message: document.getElementById('message'),
    prevPageBtn: document.getElementById('prevPage'),
    nextPageBtn: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    characterModal: document.getElementById('characterModal'),
    modalContent: document.getElementById('modalContent'),
    closeModal: document.querySelector('.close')
};

// Funcion para mostrar el loading y ocultar el mensaje de error 
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.message.classList.add('hidden');
    elements.charactersGrid.innerHTML = ''; // Limpio la grilla de personajes
}

// Funcion para ocultar el loading cuando ya recibi los datos de la API
function hideLoading() {
    elements.loading.classList.add('hidden');
}

// Funcion para mostrar el mensaje de error
function showMessage(text, type = 'error') {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    elements.message.classList.remove('hidden');
}

// Funcion para ocultar el mensaje de error
function hideMessage() {
    elements.message.classList.add('hidden');
}

// Funcion para construir la URL para hacer la solicitud a la API de personajes (segun que filtros se le pasen)
function buildApiUrl(page = 1, filters = {}) {
    const params = new URLSearchParams();
    
    if (page > 1) {
        params.append('page', page);
    }
    
    if (filters.name && filters.name.trim()) {
        params.append('name', filters.name.trim());
    }
    
    if (filters.status && filters.status.trim()) {
        params.append('status', filters.status.trim());
    }
    
    if (filters.gender && filters.gender.trim()) {
        params.append('gender', filters.gender.trim());
    }
    
    const queryString = params.toString();
    return `${url_api}/character${queryString ? `?${queryString}` : ''}`;
}

// Funcion para validar los filtros (si no se le pasan filtros, no se hace la solicitud a la API)
function validateFilters(filters) {
    const hasFilters = filters.name.trim() || filters.status || filters.gender;
    
    if (!hasFilters) {
        showMessage('Por favor, rellene al menos un campo de filtro', 'error');
        return false;
    }
    
    return true;
}

// Funcion para obtener los datos basandonos en la página actual y en los filtros aplicados
async function fetchCharacters(page = 1, filters = {}) {
    try {
        const url = buildApiUrl(page, filters);
        const response = await fetch(url); // Petición HTTP GET a la API
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No se encontraron personajes con los filtros especificados');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json(); // Convierto la respuesta a JSON
        return data;
    } catch (error) {
        console.error('Error al obtener los personajes:', error);
        throw error;
    }
}

// Funcion para crear la tarjeta de cada personaje 
function createCharacterCard(character) {
    const card = document.createElement('div'); // Creo un div para la tarjeta
    card.className = 'character-card'; 
    card.dataset.characterId = character.id;
    
    const statusClass = `status-${character.status.toLowerCase()}`;
    
    // Creo el HTML de la tarjeta con los datos del personaje
    card.innerHTML = ` 
        <img src="${character.image}" alt="${character.name}" class="character-image">
        <div class="character-info">
            <h3 class="character-name">${character.name}</h3>
            <div class="character-details">
                <div class="character-detail">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value ${statusClass}">${character.status}</span>
                </div>
                <div class="character-detail">
                    <span class="detail-label">Species:</span>
                    <span class="detail-value">${character.species}</span>
                </div>
                <div class="character-detail">
                    <span class="detail-label">Gender:</span>
                    <span class="detail-value">${character.gender}</span>
                </div>
                <div class="character-detail">
                    <span class="detail-label">Origin:</span>
                    <span class="detail-value">${character.origin.name}</span>
                </div>
            </div>
        </div>
    `;
    
    // Añado un evento al hacer click sobre la tarjeta para mostrar el modal con más detalles del pj
    card.addEventListener('click', () => showCharacterModal(character));
    
    return card;
}

// Funcion para renderizar los personajes en la grilla (limpia la grilla y crea las tarjetas de cada personaje)
function renderCharacters(characters) {
    elements.charactersGrid.innerHTML = '';
    
    if (characters.length === 0) {
        showMessage('No se encontraron personajes.', 'error');
        return;
    }
    
    characters.forEach(character => { // Creo una tarjeta para cada personaje con la funcion de arriba
        const card = createCharacterCard(character);
        elements.charactersGrid.appendChild(card); // Añado la tarjeta al contenedor de la grilla
    });
}

// Funcion para actualizar la paginación (actualiza el numero de pagina actual y el total de paginas)
function updatePagination(info) {
    currentPage = info.currentPage;
    totalPages = info.pages;
    
    elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    elements.prevPageBtn.disabled = currentPage <= 1;
    elements.nextPageBtn.disabled = currentPage >= totalPages;
}

// Funcion para mostrar el modal con más detalles del personaje seleccionado
function showCharacterModal(character) {
    const statusClass = `status-${character.status.toLowerCase()}`;
    
    elements.modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${character.image}" alt="${character.name}" style="width: 200px; height: 200px; border-radius: 10px; border: 3px solid #00ff88;">
        </div>
        <h2 style="color: #00d4ff; margin-bottom: 20px; text-align: center;">${character.name}</h2>
        <div style="display: grid; gap: 15px;">
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <span style="color: #ffd93d; font-weight: 600;">Status:</span>
                <span class="${statusClass}" style="font-weight: 600;">${character.status}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <span style="color: #ffd93d; font-weight: 600;">Species:</span>
                <span style="color: #fff;">${character.species}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <span style="color: #ffd93d; font-weight: 600;">Gender:</span>
                <span style="color: #fff;">${character.gender}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <span style="color: #ffd93d; font-weight: 600;">Origin:</span>
                <span style="color: #fff;">${character.origin.name}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <span style="color: #ffd93d; font-weight: 600;">Location:</span>
                <span style="color: #fff;">${character.location.name}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <span style="color: #ffd93d; font-weight: 600;">Episodes:</span>
                <span style="color: #fff;">${character.episode.length}</span>
            </div>
        </div>
    `;
    
    elements.characterModal.classList.remove('hidden');
}

// Funcion para ocultar el modal
function hideCharacterModal() {
    elements.characterModal.classList.add('hidden');
}

// Funcion para cargar los personajes (se llama cuando se aplica un filtro o se cambia de pagina)
async function loadCharacters(page = 1, filters = {}) {
    try {
        showLoading();
        hideMessage();
        
        const data = await fetchCharacters(page, filters);
        
        renderCharacters(data.results);
        updatePagination({
            currentPage: page,
            pages: data.info.pages
        });
        
    } catch (error) {
        showMessage(error.message, 'error');
        elements.charactersGrid.innerHTML = '';
    } finally {
        hideLoading();
    }
}

// Funcion para aplicar los filtros (se llama cuando se hace click en el boton de aplicar filtros)
async function applyFilters() {
    const filters = {
        name: elements.nameFilter.value,
        status: elements.statusFilter.value,
        gender: elements.genderFilter.value
    };
    
    if (!validateFilters(filters)) {
        return;
    }
    
    currentFilters = filters;
    currentPage = 1;
    await loadCharacters(currentPage, filters);
}

// Funcion para cargar la pagina siguiente (se llama cuando se hace click en el boton de siguiente pagina)
async function loadNextPage() {
    if (currentPage < totalPages) {
        await loadCharacters(currentPage + 1, currentFilters);
    }
}

// Funcion para cargar la pagina anterior (se llama cuando se hace click en el boton de anterior pagina)
async function loadPrevPage() {
    if (currentPage > 1) {
        await loadCharacters(currentPage - 1, currentFilters);
    }
}

// Evemto de click para aplicar los filtros
elements.applyFiltersBtn.addEventListener('click', applyFilters);
// Tambien para aplicar los filtros cuando se presiona enter
[elements.nameFilter, elements.statusFilter, elements.genderFilter].forEach(element => {
    element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
});

// Evento de click para cargar la pagina siguiente y la anterior
elements.prevPageBtn.addEventListener('click', loadPrevPage);
elements.nextPageBtn.addEventListener('click', loadNextPage);

// Evento de click para cerrar el modal con la info
elements.closeModal.addEventListener('click', hideCharacterModal);
// Tambien para cerrar el modal pero cuando se toca afuera
elements.characterModal.addEventListener('click', (e) => {
    if (e.target === elements.characterModal) {
        hideCharacterModal();
    }
});

// Inicializo la aplicación (carga los personajes sin filtros)
document.addEventListener('DOMContentLoaded', () => {
    loadCharacters(1, {});
});