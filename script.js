"use strict"

let v = document.getElementById('v_Lista');
v.addEventListener('change', aggiorna);

let n_Città = document.getElementById('n_Città');
let città = document.getElementById('dettagliCittà');
let prenotazione = document.getElementById('prenotazione');

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
    città.style.display = 'inline';
    n_Città.style.display = 'inline';
}

async function aggiorna() {

    let valore = v.value;

    let risposta = await fetch("http://localhost:8088/cities/" + valore);
    let dett_città = await risposta.json();

    n_Città.innerText = dett_città.city;
    let paese = document.getElementById('paese').innerText = dett_città.country;
    let iso = document.getElementById('iso2').innerText = dett_città.iso2;
    let popolazione = document.getElementById('popolazione').innerText = dett_città.population;
}

function visualizzaPrenotazione() {

    let ricercaCittà = document.getElementById('ricercaCittà');
    ricercaCittà.style.display = 'none';

    città.style.display = 'none';
    prenotazione.style.display = 'inline';
}

function impostaMin(idInput) {

    const data = new Date();
    const anno = data.getFullYear();
    const mese = String(data.getMonth() + 1).padStart(2, "0");
    const giorno = String(data.getDate()).padStart(2, "0");

    const oggiFormattato = `${anno}-${mese}-${giorno}`;
    document.getElementById(idInput).min = oggiFormattato;
}

impostaMin("i_DataA");

async function inviaPrenotazione() {
    let nome = document.getElementById('i_Nome').value;
    let dataCheckIn = document.getElementById('i_DataA').value;
    let dataCheckOut = document.getElementById('i_DataR').value;
    let numP = document.getElementById('i_Persone').value;

    let prenotazione = {
        cityId: Number(v.value),
        name: nome,
        from: dataCheckIn,
        to: dataCheckOut,
        guests: Number(numP)
    };

    let parametriRichiesta = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prenotazione)
    };
    let risposta = await fetch("http://localhost:8088/reservations", parametriRichiesta);
}