"use strict"

let v = document.getElementById('v_Lista');

v.addEventListener('change',aggiornaScritta());

async function ricercaCittà(){

    v.innerHTML="";

    let città = document.getElementById('i_Città').value;
    
    let risposta = await fetch("http://localhost:8088/cities?city="+città);
    let listaCittà = await risposta.json();

    for(let i=0; i < listaCittà.length; i++){
        
        let riga = document.createElement('option');
        riga.value = listaCittà[i].id;
        riga.innerText = listaCittà[i].city;

        v.appendChild(riga);
    }

    visualizzaPrenotazione();
}

function visualizzaPrenotazione(){

    let prenotazione = document.getElementById('prenotazione');

    prenotazione.style.display='inline';

}