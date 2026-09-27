// Billederne i spillet
const billeder = [
    'vendespil1.png',
    'vendespil2.png',
    'vendespil3.png',
    'vendespil4.png',
    'vendespil5.png',
    'vendespil6.png',
    'vendespil7.png',
    'vendespil8.png',
    'vendespil9.png',
    'vendespil10.png'
];

// Vi skal have 2 af hvert billede = 10 par = 20 kort
const kortene = [];
for (let i = 0; i < billeder.length; i++) {
    kortene.push(billeder[i]);
    kortene.push(billeder[i]);
}

// Bland kortene
function blandKortene(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Spillets variabler
let korteBlandetOgKlare = blandKortene([...kortene]);
let førsteKort = null;
let andetKort = null;
let forsog = 0;
let parFundet = 0;

// Find HTML-elementer
const spilleplade = document.getElementById('spilleplade');
const forsogElement = document.getElementById('forsog');
const parFundetElement = document.getElementById('par-fundet');
const startIgenBtn = document.getElementById('start-igen');
const beskedElement = document.getElementById('besked');

// Opret kortene på siden
function opretKorte() {
    spilleplade.innerHTML = '';
    
    korteBlandetOgKlare.forEach((billede, index) => {
        const kort = document.createElement('div');
        kort.classList.add('kort');
        kort.dataset.billede = billede;
        kort.dataset.index = index;
        
        kort.innerHTML = `
            <div class="kort-indhold">
                <div class="kort-bag">
                    <img src="geocaching-logo.png" alt="Bagside">
                </div>
                <div class="kort-foran">
                    <img src="${billede}" alt="Spillekort">
                </div>
            </div>
        `;
        
        kort.addEventListener('click', () => vendKort(kort));
        spilleplade.appendChild(kort);
    });
}

// Vend et kort
function vendKort(kort) {
    // Hvis kortet allerede er drejet eller både førsteKort og andetKort er valgt
    if (kort.classList.contains('vent') || kort.classList.contains('ramt')) {
        return;
    }
    
    if (førsteKort && andetKort) {
        return;
    }
    
    // Drej kortet
    kort.classList.add('vent');
    
    if (!førsteKort) {
        førsteKort = kort;
    } else {
        andetKort = kort;
        forsog++;
        forsogElement.textContent = forsog;
        
        // Tjek hvis de matcher
        setTimeout(tjekMatch, 600);
    }
}

// Tjek hvis de to kort matcher
function tjekMatch() {
    const match = førsteKort.dataset.billede === andetKort.dataset.billede;
    
    if (match) {
        // De matcher - lad dem blive vendt
        førsteKort.classList.add('ramt');
        andetKort.classList.add('ramt');
        parFundet++;
        parFundetElement.textContent = parFundet;
        
        // Tjek hvis alle par er fundet
        if (parFundet === 10) {
            beskedElement.textContent = `🎉 Tillykke! Du fandt alle 10 par på ${forsog} forsøg!`;
            beskedElement.style.color = '#6b8e23';
        }
    } else {
        // De matcher ikke - drej dem tilbage
        førsteKort.classList.remove('vent');
        andetKort.classList.remove('vent');
    }
    
    // Nulstil
    førsteKort = null;
    andetKort = null;
}

// Start spillet igen
startIgenBtn.addEventListener('click', () => {
    korteBlandetOgKlare = blandKortene([...kortene]);
    førsteKort = null;
    andetKort = null;
    forsog = 0;
    parFundet = 0;
    forsogElement.textContent = '0';
    parFundetElement.textContent = '0';
    beskedElement.textContent = '';
    opretKorte();
});

// Start spillet når siden loader
opretKorte();