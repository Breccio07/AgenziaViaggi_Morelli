"use strict"

// ELEMENTI DOM
const selectCityList = document.getElementById('cityList');
selectCityList.addEventListener('change', updateCityDetails);

const divCitySection = document.getElementById('citySection');

const cityNameTitle = document.getElementById('cityName');
const cityDetailsDiv = document.getElementById('cityDetails');
const bookingDiv = document.getElementById('bookingSection');

// CAMPI DI DETTAGLIO
const detailCountry = document.getElementById('detailCountry');
const detailIso2 = document.getElementById('detailIso2');
const detailPopulation = document.getElementById('detailPopulation');


// 🔍 RICERCA CITTÀ
async function searchCity() {

    selectCityList.innerHTML = "";

    let city = document.getElementById('inputCity').value;

    let response = await fetch("http://10.1.0.52:8088/cities?city=" + city);
    let cities = await response.json();

    for (let i = 0; i < cities.length; i++) {
        let option = document.createElement('option');
        option.value = cities[i].id;
        option.innerText = cities[i].city;
        selectCityList.appendChild(option);
    }

    updateCityDetails();
    showCityDetails();
}


// 🎯 MOSTRA SEZIONE DETTAGLI
function showCityDetails() {
    cityDetailsDiv.style.display = 'block';
    cityNameTitle.style.display = 'block';
}


// 🔄 AGGIORNA DETTAGLI CITTÀ SELEZIONATA
async function updateCityDetails() {

    let id = selectCityList.value;

    let response = await fetch("http://10.1.0.52:8088/cities/" + id);
    let city = await response.json();

    cityNameTitle.innerText = city.city;
    detailCountry.innerText = city.country;
    detailIso2.innerText = city.iso2;
    detailPopulation.innerText = city.population;
}


// ✈️ PASSA ALLA PRENOTAZIONE
function showBookingForm() {

    document.getElementById('searchCitySection').style.display = 'none';
    cityDetailsDiv.style.display = 'none';

    bookingDiv.style.display = 'block';
}


// 📅 IMPOSTA DATA MINIMA
function setTodayMin(idInput) {

    const data = new Date();
    const anno = data.getFullYear();
    const mese = String(data.getMonth() + 1).padStart(2, "0");
    const giorno = String(data.getDate()).padStart(2, "0");

    const today = `${anno}-${mese}-${giorno}`;
    document.getElementById(idInput).min = today;
}

setTodayMin("inputCheckIn");


// 📤 INVIA PRENOTAZIONE
async function sendBooking() {
    let name = document.getElementById('inputName').value;
    let checkIn = document.getElementById('inputCheckIn').value;
    let checkOut = document.getElementById('inputCheckOut').value;
    let guests = document.getElementById('inputGuests').value;

    let booking = {
        cityId: Number(selectCityList.value),
        name: name,
        from: checkIn,
        to: checkOut,
        guests: Number(guests)
    };

    let params = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    };

    await fetch("http://10.1.0.52:8088/reservations", params);
}