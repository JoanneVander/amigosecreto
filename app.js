let sorteioMapping = {};
let sorteioRealizado = false;

function adicionarAmigo(){
    if(sorteioRealizado){
        alert("Sorteio já realizado. Limpe as informações para inserir novos nomes.");
        return;
    }
    const input = document.getElementById("amigo");
    const nome = input.value.trim();
    if(nome === "" || !nome.includes(" ")){
        alert("Por favor, digite nome e sobrenome.");
        return;
    }
    const tbody = document.querySelector("#listaAmigos tbody");
    const existingNames = Array.from(tbody.querySelectorAll("tr")).map(tr => tr.getAttribute("data-nome"));
    if(existingNames.includes(nome.toLowerCase())){
         alert("Nome já inserido. Por favor, insira outro nome.");
         return;
    }
    const tr = document.createElement("tr");
    tr.setAttribute("data-nome", nome.toLowerCase());
    const tdNome = document.createElement("td");
    tdNome.textContent = nome;
    const tdAcao = document.createElement("td");
    tdAcao.innerHTML = '<button class="btn-edit" onclick="editarNome(this)"><i class="fas fa-edit"></i></button>';
    tr.appendChild(tdNome);
    tr.appendChild(tdAcao);
    tbody.appendChild(tr);
    input.value = "";
    document.getElementById("listaAmigos").style.display = "table";
}

function editarNome(btn){
    const tr = btn.closest("tr");
    const currentName = tr.getAttribute("data-nome");
    let newName = prompt("Editar nome:", currentName);
    if(newName === null) return;
    newName = newName.trim();
    if(newName === "" || !newName.includes(" ")){
        alert("Por favor, digite nome e sobrenome.");
        return;
    }
    const tbody = tr.parentNode;
    const existingNames = Array.from(tbody.querySelectorAll("tr"))
                           .filter(item => item !== tr)
                           .map(item => item.getAttribute("data-nome"));
    if(existingNames.includes(newName.toLowerCase())){
        alert("Nome já inserido. Por favor, insira outro nome.");
        return;
    }
    tr.setAttribute("data-nome", newName.toLowerCase());
    tr.querySelector("td").textContent = newName;
}

function sortearAmigo(){
    const tbody = document.querySelector("#listaAmigos tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const nomes = rows.map(tr => tr.getAttribute("data-nome"));
    if(nomes.length < 3){
        alert("Por favor, adicione no mínimo 3 participantes para realizar o sorteio.");
        return;
    }
    const sorteados = gerarSorteio(nomes);
    sorteioMapping = {};
    nomes.forEach((nome, i) => {
        sorteioMapping[nome] = sorteados[i];
    });
    const resultadoUl = document.getElementById("resultado");
    resultadoUl.innerHTML = "<li style='color: yellow;'>Sorteio realizado! Agora, digite seu nome no campo abaixo e clique em Verificar para ver seu amigo(a) secreto(a).</li>";
    sorteioRealizado = true;
    document.getElementById("amigo").disabled = true;
    document.querySelector(".button-add").disabled = true;
}

function verificarAmigoSorteado(){
    const input = document.getElementById("verificacao");
    const nome = input.value.trim().toLowerCase();
    if(nome === ""){
        showToast("Agora digite seu nome.");
        return;
    }
    if(sorteioMapping[nome]){
        showToast("E o seu amigo(a) secreto é: " + sorteioMapping[nome]);
    } else {
        showToast("Nome não encontrado ou sorteio ainda não foi realizado.");
    }
}

function gerarSorteio(nomes){
    const indices = nomes.map((_, i) => i);
    let sorteio = [...indices];
    do {
        for(let i = sorteio.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [sorteio[i], sorteio[j]] = [sorteio[j], sorteio[i]];
        }
    } while(sorteio.some((val, index) => val === index));
    return sorteio.map(i => nomes[i]);
}

function limparInformacoes(){
    document.getElementById("listaAmigos").innerHTML = "";
    document.getElementById("listaAmigos").style.display = "none";
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("verificacao").value = "";
    document.getElementById("amigo").disabled = false;
    document.querySelector(".button-add").disabled = false;
    sorteioMapping = {};
    sorteioRealizado = false;
    showToast("Informações limpadas!");
}

function showToast(message){
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
        showImageToast();
    }, 3000);
}

function showImageToast(){
    const imageToast = document.getElementById("imageToast");
    imageToast.style.display = "block";
}

function fecharImageToast(){
    const imageToast = document.getElementById("imageToast");
    imageToast.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const inputAmigo = document.getElementById("amigo");
    inputAmigo.addEventListener("keydown", (event) => {
        if(event.key === "Enter"){
            adicionarAmigo();
        }
    });
});
