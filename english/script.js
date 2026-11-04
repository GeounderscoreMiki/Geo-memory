// ===================================
// GEOCACHE COORDINATES
// ===================================
//
// You can change the coordinates here later.
// Write the coordinates between the quotation marks.
const geocacheKoordinat = "N 55° 59.027 E 013° 34.468";


// ===================================
// IMAGES FOR THE 10 PAIRS
// ===================================

const billeder = [
    "vendespil1.png",
    "Vendespil2.png",
    "Vendespil3.png",
    "Vendespil4.png",
    "Vendespil5.png",
    "Vendespil6.png",
    "Vendespil7.png",
    "Vendespil8.png",
    "Vendespil9.png",
    "Vendespil10.png"
];


// ===================================
// CREATE 20 CARDS
// 10 different images x 2
// ===================================

const alleKort = [];

billeder.forEach(function (billede) {
    alleKort.push(billede);
    alleKort.push(billede);
});


// ===================================
// GAME VARIABLES
// ===================================

let blandedeKort = [];
let førsteKort = null;
let andetKort = null;
let forsøg = 0;
let parFundet = 0;
let spilLåst = false;


// ===================================
// FIND THE HTML ELEMENTS
// ===================================

const spilleplade = document.getElementById("spilleplade");
const forsøgElement = document.getElementById("forsog");
const parFundetElement = document.getElementById("par-fundet");
const startIgenKnap = document.getElementById("start-igen");
const beskedElement = document.getElementById("besked");


// ===================================
// SHUFFLE THE CARDS
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
// COUNTER: HOW MANY TIMES THE GAME HAS BEEN SOLVED
// ===================================
//
// Uses the free service abacus.jasoncameron.dev.
// Change "geo-memory-english-miki" if you want a fresh counter starting at 0.
const counterUrl = "https://abacus.jasoncameron.dev";
const counterName = "geo-memory-english-miki-2/solved";

const solvedElement = document.getElementById("solved-count");

function showCounter(url) {
    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            solvedElement.textContent = data.value || 0;
        })
        .catch(function () {
            solvedElement.textContent = "?";
        });
}

// Show the current number when the page loads
showCounter(counterUrl + "/get/" + counterName);


// ===================================
// CREATE ALL CARDS ON THE PAGE
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
                    <img src="geocaching-logo.png" alt="Card back">
                </div>

                <div class="kort-foran">
                    <img src="${billede}" alt="Picture from nature">
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
// WHEN A CARD IS FLIPPED
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
// CHECK IF THE TWO CARDS MATCH
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
// MESSAGE WHEN THE GAME IS COMPLETE
// ===================================

function visTillykkeBesked() {
    // Add 1 to the counter and show the new number
    showCounter(counterUrl + "/hit/" + counterName);

    if (forsøg <= 30) {
        beskedElement.innerHTML = `
            🎉 <strong>Congratulations!</strong> 🎉<br>
            You found all 10 pairs in ${forsøg} attempts.<br><br>

            🌿 You have unlocked a geocache!<br>
            🧭 Coordinates:<br>
            <strong>${geocacheKoordinat}</strong>
        `;
        beskedElement.style.color = "#315c36";
    } else {
        beskedElement.innerHTML = `
            You found all 10 pairs in ${forsøg} attempts.<br><br>
            Unfortunately, the reward requires 30 attempts or fewer.<br>
            Try again and see if you can do it faster 🌿
        `;
        beskedElement.style.color = "#8a4b2a";
    }
}


// ===================================
// RESTART THE GAME
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
// START THE GAME FIRST TIME
// ===================================

opretSpillet();