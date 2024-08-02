const spinButton = document.getElementById('spinButton');
const notification = document.getElementById('notification');
const sponsorLink = document.getElementById('sponsorLink');
const slots = document.querySelectorAll('.slot .images');
const attemptCountElem = document.getElementById('attemptCount');
const spinAudio = document.getElementById('spinAudio');
const bonusAudio = new Audio('sounds/intentos.mp3');
let attempts = 5;

const images = ["img/diamante.png", "img/dinero.png", "img/bomba.png"];

function updateAttempts() {
    attemptCountElem.textContent = attempts;
}

function showNotification() {
    notification.style.display = 'block';
}

function hideNotification() {
    notification.style.display = 'none';
}

function spinRoulette() {
    if (attempts > 0) {
        attempts--;
        updateAttempts();

        // Reproducir sonido de giro
        spinAudio.currentTime = 0;
        spinAudio.play();

        let slotResults = [];
        slots.forEach((slot, index) => {
            let count = 0;
            const interval = setInterval(() => {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * images.length);
                } while (!isValidCombination(randomIndex, slotResults, index));
                slot.innerHTML = `<img src="${images[randomIndex]}" alt="image">`;
                slotResults[index] = images[randomIndex];
                count++;
                if (count >= 100) {
                    clearInterval(interval);
                }
            }, 75);
        });

        setTimeout(() => {
            spinAudio.pause();
            const srcArray = Array.from(slots).map(slot => slot.querySelector('img').src);

            if (srcArray.every(src => src.includes('bomba.png'))) {
                alert('No ganaste nada.');
            } else if (srcArray.filter(src => src.includes('diamante.png')).length === 2 &&
                srcArray.filter(src => src.includes('dinero.png')).length === 1) {
                bonusAudio.currentTime = 0;
                bonusAudio.play();
                attempts += 2;
                updateAttempts();
                alert('¡Ganaste 2 giros más!');
            } else if (srcArray.filter(src => src.includes('dinero.png')).length === 2 &&
                srcArray.filter(src => src.includes('diamante.png')).length === 1) {
                bonusAudio.currentTime = 0;
                bonusAudio.play();
                attempts += 2;
                updateAttempts();
                alert('¡Ganaste 2 giros más!');
            }

            if (attempts === 0) {
                showNotification();
            }
        }, 8000);
    }
}

function isValidCombination(randomIndex, slotResults, currentIndex) {
    const tempResults = [...slotResults];
    tempResults[currentIndex] = images[randomIndex];

    const currentSrc = tempResults.map(src => src.includes('diamante.png') ? 'D' : src.includes('dinero.png') ? 'M' : 'B');

    return !(currentSrc.join('').includes('DDD') || currentSrc.join('').includes('MMM'));
}

sponsorLink.addEventListener('click', () => {
    hideNotification();
    attempts = 5;
    updateAttempts();
    window.open(sponsorLink.href, '_blank');
});

spinButton.addEventListener('click', spinRoulette);

window.addEventListener('load', updateAttempts);