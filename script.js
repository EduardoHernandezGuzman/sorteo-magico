let participants = JSON.parse(localStorage.getItem('participants') || '[]');
let winnersHistory = JSON.parse(localStorage.getItem('winners') || '[]');

const participantInput = document.getElementById('participantInput');
const addButton = document.getElementById('addButton');
const participantsList = document.getElementById('participantsList');
const selectWinnerButton = document.getElementById('selectWinner');
const winnerSection = document.getElementById('winnerSection');
const winnerName = document.getElementById('winnerName');
const clearAllButton = document.getElementById('clearAll');

function addParticipant() {
    const name = participantInput.value.trim();

    if (name === '') {
        alert('Por favor, ingresa un nombre');
        return;
    }

    if (participants.includes(name)) {
        alert('Este participante ya está en la lista');
        return;
    }

    participants.push(name);
    localStorage.setItem('participants', JSON.stringify(participants));
    updateParticipantsList();
    participantInput.value = '';
}

function updateParticipantsList() {
    participantsList.innerHTML = '';
    participants.forEach((participant, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
    ${participant}
    <button class="delete-btn" onclick="removeParticipant(${index})">×</button>
  `;
        participantsList.appendChild(li);
    });

    selectWinnerButton.style.display = participants.length > 1 ? 'block' : 'none';
}

function removeParticipant(index) {
    participants.splice(index, 1);
    localStorage.setItem('participants', JSON.stringify(participants));
    updateParticipantsList();
}

function selectWinner() {
    if (participants.length < 2) {
        alert('Se necesitan al menos 2 participantes');
        return;
    }

    const duration = 3000;
    const fps = 30;
    let currentIndex = 0;

    winnerSection.classList.remove('hidden');
    winnerSection.classList.add('show');

    const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % participants.length;
        winnerName.textContent = participants[currentIndex];
    }, 1000 / fps);

    setTimeout(() => {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[randomIndex];
        winnerName.textContent = winner;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        winnersHistory.push({
            name: winner,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('winners', JSON.stringify(winnersHistory));
        updateWinnersHistory();
    }, duration);
}

function updateWinnersHistory() {
    const historyList = document.getElementById('winnersHistory');
    historyList.innerHTML = winnersHistory
        .map(w => `<li>${w.name} - ${w.date}</li>`)
        .join('');
}

function clearAll() {
    participants = [];
    localStorage.removeItem('participants');
    updateParticipantsList();
    winnerSection.classList.add('hidden');
}

addButton.addEventListener('click', addParticipant);

participantInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addParticipant();
    }
});

selectWinnerButton.addEventListener('click', selectWinner);
clearAllButton.addEventListener('click', clearAll);

updateParticipantsList();
updateWinnersHistory();
selectWinnerButton.style.display = 'none';

window.removeParticipant = removeParticipant;