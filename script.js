// ===================================
// GEOCACHE-KOORDINAT
// ===================================
//
// Du kan ændre koordinatet her senere.
// Skriv koordinatet mellem citationstegnene.
const geocacheKoordinat = "N 55° 12.345 E 012° 34.567";


// ===================================
// BILLEDER TIL DE 10 PAR
// ===================================

const billeder = [
    "vendespil1.png",
    "vendespil2.png",
    "vendespil3.png",
    "vendespil4.png",
    "vendespil5.png",
    "vendespil6.png",
    "vendespil7.png",
    "vendespil8.png",
    "vendespil9.png",
    "vendespil10.png"
];


// ===================================
// LAV 20 KORT
// 10 forskellige billeder x 2
// ===================================

const alleKort = [];

billeder.forEach(function (billede) {
    alleKort.push(billede);
    alleKort.push(billede);
});


// ===================================
// SPILLETS VARIABLER
// ===================================

let blandedeKort = [];
let førsteKort = null;
let andetKort = null;
let forsøg = 0;
let parFundet = 0;
let spilLåst = false;


// ===================================
// FIND ELEMENTERNE FRA HTML
// ===================================

const spilleplade = document.getElementById("spilleplade");
const forsøgElement = document.getElementById("forsog");
const parFundetElement = document.getElementById("par-fundet");
const startIgenKnap = document.getElementById("start-igen");
const beskedElement = document.getElementById("besked");


// ===================================
// BLAND KORTENE
// ===================================

function blandKortene(kort) {
    for (let i = kort.length - 1; i > 0; i--) {
        const tilfældigPlads = Math.floor(Math.random() * (i + 1));

        [kort[i], kort[tilfældigPlads]] = [
            kort[tilfældigPlads],
            kort[i]
        ];
    }

    return kort;
}


// ===================================
// OPRET ALLE KORT PÅ SIDEN
// ===================================

function opretSpillet() {
    spilleplade.innerHTML = "";

    førsteKort = null;
    andetKort = null;
    spilLåst = false;

    blandedeKort = blandKortene([...alleKort]);

    blandedeKort.forEach(function (billede) {
        const kort = document.createElement("div");

        kort.classList.add("kort");
        kort.dataset.billede = billede;

        kort.innerHTML = `
            <div class="kort-indhold">

                <div class="kort-bag">
                    <img src="geocaching-logo.png" alt="Bagside af kort">
                </div>

                <div class="kort-foran">
                    <img src="${billede}" alt="Billede fra naturen">
                </div>

            </div>
        `;

        kort.addEventListener("click", function () {
            vendKort(kort);
        });

        spilleplade.appendChild(kort);
    });
}


// ===================================
// NÅR ET KORT BLIVER VENDT
// ===================================

function vendKort(kort) {
    if (spilLåst) {
        return;
    }

    if (kort.classList.contains("vent")) {
        return;
    }

    if (kort.classList.contains("ramt")) {
        return;
    }

    if (førsteKort !== null && andetKort !== null) {
        return;
    }

    kort.classList.add("vent");

    if (førsteKort === null) {
        førsteKort = kort;
        return;
    }

    andetKort = kort;
    forsøg++;

    forsøgElement.textContent = forsøg;

    tjekOmKorteneMatcher();
}


// ===================================
// TJEK OM DE TO KORT ER ENS
// ===================================

function tjekOmKorteneMatcher() {
    spilLåst = true;

    setTimeout(function () {
        const korteneMatcher =
            førsteKort.dataset.billede === andetKort.dataset.billede;

        if (korteneMatcher) {
            førsteKort.classList.add("ramt");
            andetKort.classList.add("ramt");

            parFundet++;
            parFundetElement.textContent = parFundet;

            if (parFundet === 10) {
                visTillykkeBesked();
            }
        } else {
            førsteKort.classList.remove("vent");
            andetKort.classList.remove("vent");
        }

        førsteKort = null;
        andetKort = null;
        spilLåst = false;
    }, 800);
}


// ===================================
// BESKED NÅR SPILLET ER GENNEMFØRT
// ===================================

function visTillykkeBesked() {
    beskedElement.innerHTML = `
        🎉 <strong>Tillykke!</strong> 🎉<br>
        Du fandt alle 10 par på ${forsøg} forsøg.<br><br>

        🌿 Du har låst op for en geocache!<br>
        🧭 Koordinat:<br>
        <strong>${geocacheKoordinat}</strong>
    `;

    beskedElement.style.color = "#315c36";
}


// ===================================
// START SPILLET FORFRA
// ===================================

startIgenKnap.addEventListener("click", function () {
    forsøg = 0;
    parFundet = 0;

    forsøgElement.textContent = "0";
    parFundetElement.textContent = "0";
    beskedElement.innerHTML = "";

    opretSpillet();
});


// ===================================
// START SPILLET FØRSTE GANG
// ===================================

opretSpillet();