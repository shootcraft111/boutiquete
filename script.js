const sheetID = "1r_QYLItHIqm7AijDQGqsYW_x-Kj9TrzOxBh6rXyDzAY";
const sheetURL = "https://docs.google.com/spreadsheets/d/1r_QYLItHIqm7AijDQGqsYW_x-Kj9TrzOxBh6rXyDzAY/gviz/tq?tqx=out:json";

async function fetchProduits() {
    const response = await fetch(sheetURL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const produits = rows.map(row => {
        const [
            id, nom, categorie, prix, description,
            imageURL, videoURL, tarifsJSON
        ] = row.c.map(cell => cell ? cell.v : "");

        let tarifs = [];
        try { tarifs = JSON.parse(tarifsJSON || "[]"); } catch(e) { console.warn("Erreur JSON", e); }

        return { id, nom, categorie, prix, description, imageURL, videoURL, tarifs };
    });

    return produits;
}

function afficherListeProduits(produits) {
    const container = document.getElementById("produits");
    produits.forEach(p => {
        const div = document.createElement("div");
        div.className = "produit";
        div.innerHTML = `
            <a href="produit.html?id=${p.id}">
                ${p.videoURL ? `<video src="${p.videoURL}" muted autoplay loop></video>`
                              : `<img src="${p.imageURL}" alt="${p.nom}" />`}
                <h3>${p.nom}</h3>
                <p>${p.prix} €</p>
            </a>
        `;
        container.appendChild(div);
    });
}

function afficherProduitSeul(produits) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const produit = produits.find(p => p.id === id);
    if (!produit) return document.body.innerHTML = "<p>Produit introuvable.</p>";

    document.getElementById("fiche").innerHTML = `
        <h1>${produit.nom}</h1>
        ${produit.videoURL ? `<video src="${produit.videoURL}" controls autoplay loop></video>`
                            : `<img src="${produit.imageURL}" alt="${produit.nom}" />`}
        <p>${produit.description}</p>
        <h3>Prix : ${produit.prix} €</h3>
        ${produit.tarifs.length ? `
            <h4>Tarifs dégressifs :</h4>
            <ul>` + produit.tarifs.map(t => `<li>${t.qte} : ${t.prix} €</li>`).join("") + `</ul>`
            : "" }
        <a href="index.html">⬅ Retour</a>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {
    const produits = await fetchProduits();
    if (document.getElementById("produits")) afficherListeProduits(produits);
    if (document.getElementById("fiche")) afficherProduitSeul(produits);
});
