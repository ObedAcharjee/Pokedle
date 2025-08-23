let pokemonList = [];
let targetPokemon = null;

const input = document.getElementById("guessInput");
const suggestionBox = document.getElementById("suggestions");
const resultsTable = document.getElementById("results");

// ===== Load Pokémon JSON =====
fetch("pokemon.json")
  .then(res => res.json())
  .then(data => {
    pokemonList = data;
    targetPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    console.log("Target Pokémon:", targetPokemon.name);
  });

// ===== Suggestions logic =====
input.addEventListener("input", () => {
  const query = input.value.toLowerCase();
  suggestionBox.innerHTML = "";

  if (!query) {
    suggestionBox.style.display = "none";
    return;
  }

  const matches = pokemonList
    .filter(p => p.name.toLowerCase().startsWith(query))
    .slice(0, 5);

  if (matches.length === 0) {
    suggestionBox.style.display = "none";
    return;
  }

  matches.forEach(p => {
    const div = document.createElement("div");
    div.textContent = p.name;
    div.classList.add("suggestion-item");

    div.addEventListener("click", () => {
      input.value = p.name;
      suggestionBox.style.display = "none";
    });

    suggestionBox.appendChild(div);
  });

  suggestionBox.style.display = "block";
});

document.addEventListener("click", e => {
  if (e.target !== input) suggestionBox.style.display = "none";
});

// ===== Guess Checking Function =====
function checkGuess(guessName) {
  const guess = pokemonList.find(p => p.name.toLowerCase() === guessName.toLowerCase());

  if (!guess) {
    alert("Pokémon not found!");
    return;
  }

  const alphabetMatch = guess.name[0].toUpperCase() === targetPokemon.name[0].toUpperCase();
  const genMatch = guess.generation === targetPokemon.generation;
  const evolutionMatch = guess.evolution === targetPokemon.evolution;

  // ===== Type 1 / Type 2 Check =====
  const type1Guess = guess.type[0] || "";
  const type2Guess = guess.type[1] || "";
  const type1Target = targetPokemon.type[0] || "";
  const type2Target = targetPokemon.type[1] || "";

  const type1Match = type1Guess === type1Target;
  const type2Match = type2Guess === type2Target;

  const typeDisplay = `<span class="${type1Match ? 'correct':'wrong'}">${type1Match ? '✅' : '❌'}</span>` +
                      ` / <span class="${type2Match ? 'correct':'wrong'}">${type2Target ? (type2Match ? '✅' : '❌') : '-'}</span>`;

  // Add row to table
  const row = document.createElement("tr");
row.innerHTML = `
  <td>
    ${guess.name}
    <img src="${guess.image}" alt="${guess.name}" width="50" height="50" style="margin-left: 8px; vertical-align: middle;">
  </td>
  <td class="${alphabetMatch ? "correct" : "wrong"}">${alphabetMatch ? "✅" : "❌"}</td>
  <td>${typeDisplay}</td>
  <td class="${genMatch ? "correct" : "wrong"}">${genMatch ? "✅" : "❌"}</td>
  <td class="${evolutionMatch ? "correct" : "wrong"}">${evolutionMatch ? "✅" : "❌"}</td>
`;
resultsTable.appendChild(row);
  if (guess.name.toLowerCase() === targetPokemon.name.toLowerCase()) {
    alert(`🎉 You guessed it! The Pokémon was ${targetPokemon.name}`);
  }
}

// ===== Guess button click =====
document.getElementById("guessBtn").addEventListener("click", () => {
  const guess = input.value.trim();
  if (guess) checkGuess(guess);
  input.value = "";
});

// ===== Enter key =====
input.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("guessBtn").click();
  }
});



