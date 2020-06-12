//select estado e cidade - api ibge
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((answer)=>{return answer.json()})
    /*também pode ser escrita assim: answer => answer.json() */
    .then( states =>{
        for (const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}<option>`;
        }
    })
}

populateUFs();

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");
    const ufValue = event.target.value; 
    /* usa-se o target para identificar "aonde o evento 
    está ocorrendo". Usamos o value para pegar o valor do id do estado selecionado*/
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text;
    
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;
    
    citySelect.innerHTML = `<option value="">Selecione a cidade</option>`;
    citySelect.disabled = true;

    fetch(url)
    .then((answer)=>{return answer.json()})
    /*também pode ser escrita assim: answer => answer.json() */
    .then( cities =>{

        for (const city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
        }
        citySelect.disabled = false;
    })

} 


document
        .querySelector("select[name=uf]")
        .addEventListener("change",getCities)


//Itens de Coleta
//pegar todos os li
const itensToCollect = document.querySelectorAll(".itens-grid li");

for (const item of itensToCollect){
    item.addEventListener("click", handleSelecteditem)
}

let selectedItens = [];

const collectedItens = document.querySelector("input[name=itens]");

function handleSelecteditem(event) {
   const itemLi = event.target; //pegar o elemento li
   const itemId = itemLi.dataset.id; //pegar o numero id do elemento 

   //adicinar ou remover uma classe com javascript
   itemLi.classList.toggle("selected");
   
   //verificar se existem itens selecionados,
   //se sim, pegar os itens selecionados

   const alreadySelected = selectedItens.findIndex( item => {
       const itemFound = item == itemId
       return itemFound;
       /*pode ser escrito  return item == itemId
         ou também                item == itemId */
    })
   

   //se já estiver selecionado, 
    if (alreadySelected >= 0) {
        //tirar da seleção
        const filteredItens = selectedItens.filter(item => {
            const itemIsDifferent = item != itemId;
            return itemIsDifferent;
        })
        selectedItens = filteredItens;

      //se não estiver selecionado,
    }else{
      // adicionar à seleção
      selectedItens.push(itemId);
    }
   
   //atualizar o campo com os itens selecionados
   collectedItens.value = selectedItens;  
}