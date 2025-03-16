document.addEventListener("DOMContentLoaded", loadColis);

function openAddModal() {
    document.getElementById("colisForm").reset();
    document.getElementById("modalTitle").innerText = "Ajouter un Colis";
    document.getElementById("editIndex").value = "";
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

document.getElementById("colisForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let index = document.getElementById("editIndex").value;
    let nom = document.getElementById("nom").value;
    let numeroSuivi = document.getElementById("numeroSuivi").value;
    let statut = document.getElementById("statut").value;
    let date = document.getElementById("date").value;

    let colis = { nom, numeroSuivi, statut, date };
    let colisList = JSON.parse(localStorage.getItem("colisList")) || [];

    if (index) {
        colisList[index] = colis; // Modification
    } else {
        colisList.push(colis); // Ajout
    }

    localStorage.setItem("colisList", JSON.stringify(colisList));
    loadColis();
    closeModal();
});

function loadColis() {
    let colisList = JSON.parse(localStorage.getItem("colisList")) || [];
    let tableBody = document.getElementById("colisList");
    tableBody.innerHTML = "";

    colisList.forEach((colis, index) => {
        let row = `<tr>
            <td>${colis.nom}</td>
            <td>${colis.numeroSuivi}</td>
            <td>${colis.statut}</td>
            <td>${colis.date}</td>
            <td>
                <button onclick="editColis(${index})">✏ Modifier</button>
                <button onclick="deleteColis(${index})">🗑 Supprimer</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function editColis(index) {
    let colisList = JSON.parse(localStorage.getItem("colisList"));
    let colis = colisList[index];

    document.getElementById("nom").value = colis.nom;
    document.getElementById("numeroSuivi").value = colis.numeroSuivi;
    document.getElementById("statut").value = colis.statut;
    document.getElementById("date").value = colis.date;
    document.getElementById("editIndex").value = index;

    document.getElementById("modalTitle").innerText = "Modifier un Colis";
    document.getElementById("modal").style.display = "flex";
}

function deleteColis(index) {
    let colisList = JSON.parse(localStorage.getItem("colisList"));
    colisList.splice(index, 1);
    localStorage.setItem("colisList", JSON.stringify(colisList));
    loadColis();
}

function searchColis() {
    let filter = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#colisList tr");
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
}
