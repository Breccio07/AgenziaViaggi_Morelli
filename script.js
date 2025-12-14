"use strict"

const listaCitta = document.getElementById('listaCitta');
listaCitta.addEventListener('change', aggiornaDettagliCitta);

async function cercaCitta() {

    listaCitta.innerHTML = "";

    let citta = document.getElementById('inputCitta').value;

    let response = await fetch("http://localhost:8088/cities?city=" + citta);
    let cittaTrovate = await response.json();

    for (let i = 0; i < cittaTrovate.length; i++) {
        let option = document.createElement('option');
        option.value = cittaTrovate[i].id;
        option.innerText = cittaTrovate[i].city + ' ('+ cittaTrovate[i].iso2 +')';
        listaCitta.appendChild(option);
    }

    aggiornaDettagliCitta();
    mostraSezioneCitta();
}

function mostraSezioneCitta() {
    document.getElementById('dettagliCitta').style.display = 'block';
    document.getElementById('nomeCitta').style.display = 'block';
}

async function aggiornaDettagliCitta() {

    let id = listaCitta.value;

    let response = await fetch("http://localhost:8088/cities/" + id);
    let citta = await response.json();

    document.getElementById('nomeCitta').innerText = citta.city;
    document.getElementById('dettPaese').innerText = citta.country;
    document.getElementById('dettPopolazione').innerText = citta.population;
}

function mostraFormPrenotazione() {
    document.getElementById('ricercaCitta').style.display = 'none';
    document.getElementById('dettagliCitta').style.display = 'none';

    document.getElementById('sezionePrenotazioneHotel').style.display = 'block';
}

function impostaDataMinima(idInput) {

    const data = new Date();
    const anno = data.getFullYear();
    const mese = String(data.getMonth() + 1).padStart(2, "0");
    const giorno = String(data.getDate()).padStart(2, "0");

    const oggi = `${anno}-${mese}-${giorno}`;
    document.getElementById(idInput).min = oggi;
}

impostaDataMinima("inputCheckIn");

async function inviaPrenotazione() {

    let nome = document.getElementById('inputNome').value;
    let checkIn = document.getElementById('inputCheckIn').value;
    let checkOut = document.getElementById('inputCheckOut').value;
    let persone = document.getElementById('inputPersone').value;

    let prenotazione = {
        cityId: Number(listaCitta.value),
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

    await fetch("http://localhost:8088/reservations", params);
}

function mostraRicercaPrenHotel() {

    document.getElementById('sezioneCitta').style.display = 'none';
    document.getElementById('dettagliCitta').style.display = 'none';
    document.getElementById('sezioneVoli').style.display = 'none';

    document.getElementById('ricercaPrenHotelSezione').style.display = 'block';
}

async function cercaPrenotazioniHotel() {

    let nomePr = document.getElementById('inputNomeRicerca');

    let response = await fetch("http://localhost:8088/reservations?name=" + nomePr.value);
    let prTrovate = await response.json();

    let div = document.getElementById('listaPrenotazioni');
    div.innerHTML='';

    for (let i = 0; i < prTrovate.length; i++) {

        div.innerHTML += '<h1>Prenotazione: '+(i+1)+'</h1>'
        div.innerHTML += '<p>CityID: '+prTrovate[i].cityId+'</p>'
        div.innerHTML += '<p>Data check-in: '+prTrovate[i].from+'</p>'
        div.innerHTML += '<p>Data check-out: '+prTrovate[i].to+'</p>'
        div.innerHTML += '<p>Prenotazione: '+prTrovate[i].guests+'</p>'

    }
}
function mostraSezioneVoli() {

    document.getElementById('sezioneCitta').style.display = 'none';
    document.getElementById('dettagliCitta').style.display = 'none';
    document.getElementById('ricercaPrenHotelSezione').style.display = 'none';

    document.getElementById('sezioneVoli').style.display = 'block';
}