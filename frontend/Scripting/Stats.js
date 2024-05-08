import { getAverageScore } from './Api.js';

let word = sessionStorage.getItem('word');
let playerScore = sessionStorage.getItem('score');
let temp = await getAverageScore();
let averageScore = parseInt(temp);

function populateStats(word, playerScore, averageScore) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) {
        console.error('Stats container not found');
        return;
    }

    const html = `
        <section class="inner-stats">
            <h1>Well done!</h1>
            <div class="word">Word: ${word}</div>
            <div class="player-score">Player Score: ${playerScore}</div>
            <div class="average-score">Average Score: ${averageScore}</div>
        </section>
    `;
    
    statsContainer.innerHTML = html;
}

populateStats(word, playerScore, averageScore);



