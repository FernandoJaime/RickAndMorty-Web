// API Configuration
const API_BASE_URL = 'https://rickandmortyapi.com/api';
const CHARACTERS_PER_PAGE = 20;

// Global State
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    name: '',
    status: '',
    gender: ''
};

// DOM Elements
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

// Utility Functions
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.message.classList.add('hidden');
    elements.charactersGrid.innerHTML = '';
}

function hideLoading() {
    elements.loading.classList.add('hidden');
}

function showMessage(text, type = 'error') {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    elements.message.classList.remove('hidden');
}

function hideMessage() {
    elements.message.classList.add('hidden');
}

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
    return `${API_BASE_URL}/character${queryString ? `?${queryString}` : ''}`;
}

function validateFilters(filters) {
    const hasFilters = filters.name.trim() || filters.status || filters.gender;
    
    if (!hasFilters) {
        showMessage('Please fill at least one filter field', 'error');
        return false;
    }
    
    return true;
}

// API Functions
async function fetchCharacters(page = 1, filters = {}) {
    try {
        const url = buildApiUrl(page, filters);
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No characters found with the specified filters');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
}

// UI Functions
function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.characterId = character.id;
    
    const statusClass = `status-${character.status.toLowerCase()}`;
    
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
    
    // Add click event to show character details
    card.addEventListener('click', () => showCharacterModal(character));
    
    return card;
}

function renderCharacters(characters) {
    elements.charactersGrid.innerHTML = '';
    
    if (characters.length === 0) {
        showMessage('No characters found', 'error');
        return;
    }
    
    characters.forEach(character => {
        const card = createCharacterCard(character);
        elements.charactersGrid.appendChild(card);
    });
}

function updatePagination(info) {
    currentPage = info.currentPage;
    totalPages = info.pages;
    
    elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    elements.prevPageBtn.disabled = currentPage <= 1;
    elements.nextPageBtn.disabled = currentPage >= totalPages;
}

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

function hideCharacterModal() {
    elements.characterModal.classList.add('hidden');
}

// Main Functions
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

async function loadNextPage() {
    if (currentPage < totalPages) {
        await loadCharacters(currentPage + 1, currentFilters);
    }
}

async function loadPrevPage() {
    if (currentPage > 1) {
        await loadCharacters(currentPage - 1, currentFilters);
    }
}

// Event Listeners
elements.applyFiltersBtn.addEventListener('click', applyFilters);

elements.prevPageBtn.addEventListener('click', loadPrevPage);
elements.nextPageBtn.addEventListener('click', loadNextPage);

elements.closeModal.addEventListener('click', hideCharacterModal);

// Close modal when clicking outside
elements.characterModal.addEventListener('click', (e) => {
    if (e.target === elements.characterModal) {
        hideCharacterModal();
    }
});

// Allow Enter key to apply filters
[elements.nameFilter, elements.statusFilter, elements.genderFilter].forEach(element => {
    element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load initial characters without filters
    loadCharacters(1, {});
});