document.addEventListener("DOMContentLoaded", loadColis);

const username = 'inforlolo'; // Remplace par ton nom GitHub
const repo = 'gestion-colis'; // Nom de ton dépôt
const filePath = 'colis.json'; // Chemin du fichier dans ton dépôt
const token = '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'; // Remplace par ton token d'accès GitHub

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
    let nom = document.getElementById("nom").value.trim();
    let numeroSuivi = document.getElementById("numeroSuivi").value.trim();
    let statut = document.getElementById("statut").value.trim();
    let date = document.getElementById("date").value;

    if (!nom || !numeroSuivi || !statut || !date) {
        alert("Tous les champs doivent être remplis !");
        return;
    }

    let colis = { nom, numeroSuivi, statut, date };
    fetchColisList().then(colisList => {
        if (index) {
            colisList[index] = colis; // Modification
        } else {
            colisList.push(colis); // Ajout
        }

        updateColisOnGitHub(colisList);
        loadColis();
        closeModal();
    });
});

async function fetchColisList() {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`);
        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content);
            return JSON.parse(content);
        }
        return [];
    } catch (error) {
        console.error("Erreur lors de la récupération des colis:", error);
        return [];
    }
}

async function updateColisOnGitHub(colisList) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Mise à jour des colis',
                committer: {
                    name: username,
                    email: `${username}@github.com`
                },
                content: btoa(JSON.stringify(colisList))
            })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour des colis");
        }
    } catch (error) {
        console.error("Erreur API GitHub:", error);
    }
}

function loadColis() {
    fetchColisList().then(colisList => {
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
    });
}

function editColis(index) {
    fetchColisList().then(colisList => {
        let colis = colisList[index];

        document.getElementById("nom").value = colis.nom;
        document.getElementById("numeroSuivi").value = colis.numeroSuivi;
        document.getElementById("statut").value = colis.statut;
        document.getElementById("date").value = colis.date;
        document.getElementById("editIndex").value = index;

        document.getElementById("modalTitle").innerText = "Modifier un Colis";
        document.getElementById("modal").style.display = "flex";
    });
}

function deleteColis(index) {
    fetchColisList().then(colisList => {
        colisList.splice(index, 1);
        updateColisOnGitHub(colisList);
        loadColis();
    });
}

function searchColis() {
    let filter = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#colisList tr");
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
}
