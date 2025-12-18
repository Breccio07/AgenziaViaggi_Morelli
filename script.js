"use strict"

let select;

let sito = 'http://localhost:8088';

async function cercaCittà(idSelect) {

    select = document.getElementById(idSelect);
    select.innerHTML = '';

    let nomeCittà = document.getElementById('hotelCittà').value;

    let response = await fetch(sito + "/cities?city=" + nomeCittà);
    let cittàTrovate = await response.json();

    for (let i = 0; i < cittàTrovate.length; i++) {
        let option = document.createElement('option');
        option.value = cittàTrovate[i].id;
        option.innerText = cittàTrovate[i].city + ' (' + cittàTrovate[i].iso2 + ')';
        select.appendChild(option);
    }
}

function impostaDataMinima(idInput, num) {

    const data = new Date();
    data.setDate(data.getDate() + num);

    const anno = data.getFullYear();
    const mese = String(data.getMonth() + 1).padStart(2, "0");
    const giorno = String(data.getDate()).padStart(2, "0");

    const oggi = `${anno}-${mese}-${giorno}`;
    document.getElementById(idInput).min = oggi;
}

impostaDataMinima("hotelCheck-in", 0);
impostaDataMinima("hotelCheck-out", 1);

async function inviaPrenotazione() {

    let nome = document.getElementById('hotelNomePr').value;
    let checkIn = document.getElementById('hotelCheck-in').value;
    let checkOut = document.getElementById('hotelCheck-out').value;
    let persone = document.getElementById('hotelNumPersone').value;

    let prenotazione = {
        cityId: Number(select.value),
        name: nome,
        from: checkIn,
        to: checkOut,
        guests: Number(persone)
    };

    let params = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prenotazione)
    };

    await fetch(sito + "/reservations", params);
}

function visualizzaHotel() {

    document.getElementById('voli').style.display = 'none';
    document.getElementById('ricerca').style.display = 'none';

    document.getElementById('hotel').style.display = 'block';
}

function visualizzaVoli() {

    document.getElementById('hotel').style.display = 'none';
    document.getElementById('ricerca').style.display = 'none';

    document.getElementById('voli').style.display = 'block';
}

function visualizzaRicerca() {

    document.getElementById('voli').style.display = 'none';
    document.getElementById('hotel').style.display = 'none';

    document.getElementById('ricerca').style.display = 'block';
}

async function ricercaHotel() {

    let nome = document.getElementById('ricercaNomePr').value;
    let nomeCittà = document.getElementById('ricercaIdCittà').value;

    let listaRicercaHotel = document.getElementById('listaRicercaHotel');

    listaRicercaHotel.innerHTML = '';

    let response;

    if (nomeCittà !== "") {
        response = await fetch(sito + '/cities/' + nomeCittà);

        let città = await response.json();

        let id=città.id;

        if (nome !== "") {
            response = await fetch(sito + "/reservations?name=" + nome + "?cityId=" + id);
        } else {
            response = await fetch(sito + "/reservations?cityId=" + id);
        }
    } else if (nome !== "") {
        response = await fetch(sito + "/reservations?name=" + nome);
    } else {
        response = await fetch(sito + "/reservations");
    }

    let prTrovate = await response.json();

    for (let i = 0; i < prTrovate.length; i++) {

        let div = document.createElement('div');
        div.innerHTML += '<h3>Prenotazione trovata num '+(i+1)+'</h3>';
        div.innerHTML += '<p> ID città: '+prTrovate[i].cityId+'</p>';
        div.innerHTML += '<p> Nome prenotazione: '+prTrovate[i].name+'</p>';
        div.innerHTML += '<p> Data Check-in: '+prTrovate[i].from+'</p>';
        div.innerHTML += '<p> Data Check-out: '+prTrovate[i].to+'</p>';
        div.innerHTML += '<p> Numero persone: '+prTrovate[i].guests+'</p>';

        listaRicercaHotel.appendChild(div);
    }
}