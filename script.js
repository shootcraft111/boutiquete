
const sheetID = "1MTRiRhPtcVmGp3C1f9WcLnlxqJ8GZWD1ZK7rLVa_LV8"; // Sheet de démo
const sheetName = "1";
const apiURL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSLpPE6w3LeqTA0_tBXWP_tpfOFMaVYH5gQjhwPgJsa28dXFvsjQtB9GSVIHRZ3Q2xR3bF2GSV3G4GC/pubhtml`;

fetch(apiURL)
  .then(res => res.text())
  .then(rep => {
    const json = JSON.parse(rep.substr(47).slice(0, -2));
    const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));
    const products = rows.slice(1).map(row => ({
      id: row[0], name: row[1], category: row[2], price: row[3],
      description: row[4], image: row[5], video: row[6]
    }));

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) renderProduct(products, id);
    else renderIndex(products);
  });

function renderIndex(products) {
  const filter = document.getElementById("categoryFilter");
  const grid = document.getElementById("productGrid");
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
  filter.addEventListener("change", () => renderIndex(products));

  grid.innerHTML = "";
  const selected = filter.value;
  products.filter(p => selected === "all" || p.category === selected).forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.onclick = () => window.location.href = `produit.html?id=${p.id}`;
    div.innerHTML = p.video ?
      `<video src="${p.video}" autoplay muted loop></video>` :
      `<img src="${p.image}" alt="${p.name}">`;
    div.innerHTML += `<h3>${p.name}</h3><p>${p.price}</p>`;
    grid.appendChild(div);
  });
}

function renderProduct(products, id) {
  const p = products.find(prod => prod.id == id);
  if (!p) return;
  const container = document.getElementById("productDetail");
  container.innerHTML = `
    <h1>${p.name}</h1>
    ${p.image ? `<img src="${p.image}" alt="${p.name}">` : ""}
    ${p.video ? `<video src="${p.video}" controls></video>` : ""}
    <p><strong>Prix :</strong> ${p.price}</p>
    <p><strong>Catégorie :</strong> ${p.category}</p>
    <p>${p.description}</p>
  `;
}
