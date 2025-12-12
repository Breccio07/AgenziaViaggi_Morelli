"use strict"

// ELEMENTI DOM
const selectCityList = document.getElementById('cityList');
selectCityList.addEventListener('change', updateCityDetails);

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
    document.getElementById('cityDetails').style.display = 'block';
    document.getElementById('cityName').style.display = 'block';
}


// 🔄 AGGIORNA DETTAGLI CITTÀ SELEZIONATA
async function updateCityDetails() {

    let id = selectCityList.value;

    let response = await fetch("http://10.1.0.52:8088/cities/" + id);
    let city = await response.json();

    document.getElementById('cityName').innerText = city.city;
    document.getElementById('detailCountry').innerText = city.country;
    document.getElementById('detailIso2').innerText = city.iso2;
    document.getElementById('detailPopulation').innerText = city.population;
}


// ✈️ PASSA ALLA PRENOTAZIONE
function showBookingForm() {

    document.getElementById('searchCitySection').style.display = 'none';
    document.getElementById('cityDetails').style.display = 'none';

    document.getElementById('bookingSection').style.display = 'block';
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

function searchHotelBooking(){
    document.querySelectorAll('.div')
    document.getElementById('searchPrCity').style.display = 'inline'
}