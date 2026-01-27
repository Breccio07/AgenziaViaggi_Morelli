"use strict"

let sito = 'http://10.1.0.52:8088';

async function cercaCittà(idSelect,idInput) {

    let select = document.getElementById(idSelect);
    select.innerHTML = '';

    let nomeCittà = document.getElementById(idInput).value;

    let response = await fetch(sito + "/cities?city=" + nomeCittà);
    let cittàTrovate = await response.json();

    for (let i = 0; i < cittàTrovate.length; i++) {
        let option = document.createElement('option');
        option.value = cittàTrovate[i].id;
        option.innerText = cittàTrovate[i].city + ' (' + cittàTrovate[i].iso2 + ')';
        select.appendChild(option);
    }
}

function impostaDataMinima(idInput) {

    const data = new Date();
    data.setDate(data.getDate());

    const anno = data.getFullYear();
    const mese = String(data.getMonth() + 1).padStart(2, "0");
    const giorno = String(data.getDate()).padStart(2, "0");

    const oggi = `${anno}-${mese}-${giorno}`;
    document.getElementById(idInput).min = oggi;
}

impostaDataMinima("hotelCheck-in");
impostaDataMinima("hotelCheck-out")
impostaDataMinima("voloData");

async function inviaPrenotazione() {

    let nome = document.getElementById('hotelNomePr').value;
    let checkIn = document.getElementById('hotelCheck-in').value;
    let checkOut = document.getElementById('hotelCheck-out').value;
    let persone = document.getElementById('hotelNumPersone').value;

    let select = document.getElementById('hotelListaCittà');

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
    let città = document.getElementById('ricercaListaCittà').value;

    let response;

    let listaRicercaHotel = document.getElementById('listaRicercaHotel');

    listaRicercaHotel.innerHTML = '';

    if(nome !== ''){
        if(città !== ''){
            response = await fetch(sito + "/reservations?name="+nome+"&cityId="+città);
        }else{
            response = await fetch(sito + "/reservations?name="+nome);
        }
    }else{
        if(città !== ''){
            response = await fetch(sito + "/reservations?cityId="+città);
        }else{
            response = await fetch(sito + "/reservations");
        }
    }

    let prTrovate = await response.json();

    for (let i = 0; i < prTrovate.length; i++) {

        response = await fetch(sito + "/cities/"+prTrovate[i].cityId);
        let città = await response.json();

        let nomeCittà = città.city;

        let div = document.createElement('div');
        div.innerHTML += '<h3>Prenotazione trovata num ' + (i + 1) + '</h3>';
        div.innerHTML += '<p> Nome città: ' + nomeCittà + '</p>';
        div.innerHTML += '<p> Nome prenotazione: ' + prTrovate[i].name + '</p>';
        div.innerHTML += '<p> Data Check-in: ' + prTrovate[i].from + '</p>';
        div.innerHTML += '<p> Data Check-out: ' + prTrovate[i].to + '</p>';
        div.innerHTML += '<p> Numero persone: ' + prTrovate[i].guests + '</p>';
        div.innerHTML += '<hr>'

        listaRicercaHotel.appendChild(div);
    }
}

async function aggiornaDestinazione(){

    let idPartenza = document.getElementById('voloListaCittà').value;
    let destinazione = [];

    let select = document.getElementById('voloDestinazione');

    let response = await fetch(sito+'/flights?from='+idPartenza);
    let cittàTrovate = await response.json();

    for( let i = 0; i < cittàTrovate.length; i ++){
        destinazione[i] = cittàTrovate[i].to;
    }

    for (let i = 0; i < destinazione.length; i++) {
        let option = document.createElement('option');
        option.value = destinazione[i].id;
        option.innerText = destinazione[i].city + ' (' + destinazione[i].iso2 + ')';
        select.appendChild(option);
    }
}

async function inviaVolo() {
    
    let nomeVolo = document.getElementById('voloNome').value;
    let data = document.getElementById('voloData').value;

    let idPartenza = document.getElementById('voloListaCittà').value;
    let idDestinazione = document.getElementById('voloDestinazione').value;

    let response = await fetch(sito+'/flights?from='+idPartenza+'&to='+idDestinazione);
    let volo = await response.json();

    let voloId = volo[0].id;

    let biglietto = {
        name: nomeVolo,
        flightId: voloId,
        date: data
    };

    let params = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(biglietto)
    };

    await fetch(sito + "/tickets", params);
}

async function ricercaVolo() {
    
    let nome = document.getElementById('ricercaNomeB').value;
    let biglietto = document.getElementById('ricercaBiglietto').value;

    let response;

    let listaRicercaBiglietto = document.getElementById('listaRicercaBiglietto');

    listaRicercaBiglietto.innerHTML = '';

    if(nome !== ''){
        if(biglietto !== ''){
            response = await fetch(sito + "/tickets?name="+nome+"&flightId="+biglietto);
        }else{
            response = await fetch(sito + "/tickets?name="+nome);
        }
    }else{
        if(biglietto !== ''){
            response = await fetch(sito + "/tickets?flightId="+biglietto);
        }else{
            response = await fetch(sito + "/tickets");
        }
    }

    let bTrovate = await response.json();

    for (let i = 0; i < bTrovate.length; i++) {

        let div = document.createElement('div');
        div.innerHTML += '<h3>Biglietto trovato num ' + (i + 1) + '</h3>';
        div.innerHTML += '<p> Nome biglietto :' + bTrovate[i].name + '</p>';
        div.innerHTML += '<p> ID del volo: ' + bTrovate[i].flightId + '</p>';
        div.innerHTML += '<p> Data: ' + bTrovate[i].date + '</p>';
        div.innerHTML += '<hr>'

        listaRicercaBiglietto.appendChild(div);
    }
}