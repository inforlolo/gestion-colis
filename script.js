let colisData = [];

// Charger les colis depuis le localStorage au démarrage
window.onload = function() {
    loadColis();
};

document.getElementById('addForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (editingId !== null) {
        updateColis(editingId);
    } else {
        addColis();
    }
});

function loadColis() {
    const storedColis = localStorage.getItem('colisData');
    if (storedColis) {
        colisData = JSON.parse(storedColis);
        updateTable();
    }
}

function saveColis() {
    localStorage.setItem('colisData', JSON.stringify(colisData));
}

function addColis() {
    const nom = document.getElementById('nom').value;
    const numeroSuivi = document.getElementById('numeroSuivi').value;
    const statut = document.getElementById('statut').value;
    const date = document.getElementById('date').value;

    const colis = {
        id: colisData.length + 1,
        nom,
        numeroSuivi,
        statut,
        date
    };

    colisData.push(colis);
    updateTable();
    saveColis();
    closeAddModal();
}

function updateTable() {
    const tableBody = document.querySelector('#colisTable tbody');
    tableBody.innerHTML = '';

    colisData.forEach(colis => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${colis.id}</td>
            <td>${colis.nom}</td>
            <td>${colis.statut}</td>
            <td>${colis.date}</td>
            <td>${colis.numeroSuivi}</td>
            <td><button onclick="editColis(${colis.id})">Modifier</button></td>
            <td><button onclick="deleteColis(${colis.id})">Supprimer</button></td>
        `;
        tableBody.appendChild(row);
    });
}

let editingId = null;

function openAddModal() {
    document.getElementById('addModal').style.display = 'flex';
    document.getElementById('addForm').reset();
    document.getElementById('modalTitle').textContent = "Ajouter un Colis";
    editingId = null;
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

function searchColis() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filteredData = colisData.filter(colis => 
        colis.nom.toLowerCase().includes(query) || colis.numeroSuivi.includes(query)
    );
    
    const tableBody = document.querySelector('#colisTable tbody');
    tableBody.innerHTML = '';

    filteredData.forEach(colis => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${colis.id}</td>
            <td>${colis.nom}</td>
            <td>${colis.statut}</td>
            <td>${colis.date}</td>
            <td>${colis.numeroSuivi}</td>
            <td><button onclick="editColis(${colis.id})">Modifier</button></td>
            <td><button onclick="deleteColis(${colis.id})">Supprimer</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteColis(id) {
    colisData = colisData.filter(colis => colis.id !== id);
    updateTable();
    saveColis();
}

function editColis(id) {
    const colis = colisData.find(colis => colis.id === id);

    document.getElementById('nom').value = colis.nom;
    document.getElementById('numeroSuivi').value = colis.numeroSuivi;
    document.getElementById('statut').value = colis.statut;
    document.getElementById('date').value = colis.date;
    
    document.getElementById('modalTitle').textContent = "Modifier un Colis";
    editingId = id;
    openAddModal();
}

function updateColis(id) {
    const index = colisData.findIndex(colis => colis.id === id);
    
    colisData[index] = {
        id,
        nom: document.getElementById('nom').value,
        numeroSuivi: document.getElementById('numeroSuivi').value,
        statut: document.getElementById('statut').value,
        date: document.getElementById('date').value
    };

    updateTable();
    saveColis();
    closeAddModal();
}

