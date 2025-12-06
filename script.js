"use strict"

async function ricercaCittà(){
    let città = document.getElementById('i_Città').value;
    
    let risposta = await fetch("http://localhost:8088/cities?city="+città);
    let listaCittà = await risposta.json();
    
    let v = document.getElementById('v_Lista');

    v.innerHTML="";

    for(let i=0; i < listaCittà.length; i++){
        
        let riga = document.createElement('option');
        riga.value = listaCittà[i].id;
        riga.innerText = listaCittà[i].city;

        v.appendChild(riga);
    }
}