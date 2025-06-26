// script.js
let hunger = 50;
let happiness = 50;
let hygiene = 50;

const hungerSpan = document.getElementById("hunger");
const happinessSpan = document.getElementById("happiness");
const hygieneSpan = document.getElementById("hygiene");

function updateStats() {
  hungerSpan.textContent = hunger;
  happinessSpan.textContent = happiness;
  hygieneSpan.textContent = hygiene;

  const bunny = document.querySelector(".bunny");

  // Determine mood
  if (happiness > 70 && hunger < 30 && hygiene > 50) {
    // Happy
    bunny.className = "bunny happy";
  } else if (happiness < 30 || hunger > 70 || hygiene < 30) {
    // Sad or sick
    bunny.className = "bunny sad";
  } else {
    // Neutral
    bunny.className = "bunny neutral";
  }
}

function feed() {
  hunger = Math.max(0, hunger - 10);
  updateStats();
}

function play() {
  happiness = Math.min(100, happiness + 10);
  hunger += 5;
  updateStats();
}

function clean() {
  hygiene = 100;
  updateStats();
}

// Stats decrease over time
setInterval(() => {
  hunger = Math.min(100, hunger + 2);
  happiness = Math.max(0, happiness - 1);
  hygiene = Math.max(0, hygiene - 1);
  updateStats();
}, 3000);

updateStats();
