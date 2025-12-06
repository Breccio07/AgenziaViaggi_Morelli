"use strict"

let v = document.getElementById('v_Lista');

v.addEventListener('change', aggiorna);

async function ricercaCittà() {

    v.innerHTML = "";

    let città = document.getElementById('i_Città').value;

    let risposta = await fetch("http://localhost:8088/cities?city=" + città);
    let listaCittà = await risposta.json();

    for (let i = 0; i < listaCittà.length; i++) {

        let riga = document.createElement('option');
        riga.value = listaCittà[i].id;
        riga.innerText = listaCittà[i].city;

        v.appendChild(riga);
    }
    aggiorna();

    visualizzaCittà();
}

function visualizzaCittà() {

    let prenotazione = document.getElementById('dettagliCittà');
    prenotazione.style.display = 'inline';
}

async function aggiorna() {
    
    let valore = v.value;

    let risposta = await fetch("http://localhost:8088/cities/" + valore);
    let dett_città = await risposta.json();

    let n_Città = document.getElementById('n_Città').innerText = dett_città.city;
    let paese = document.getElementById('paese').innerText = dett_città.country;
    let iso = document.getElementById('iso2').innerText = dett_città.iso2;
    let popolazione = document.getElementById('popolazione').innerText = dett_città.population;
}