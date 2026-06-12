const matchList = document.getElementById("matchList");
const pageTitle = document.getElementById("pageTitle");
const backButton = document.getElementById("backButton");

const params = new URLSearchParams(location.search);
const team = params.get("team");
let countryCodeMap = {};

pageTitle.textContent = `${team}の試合`;

backButton.addEventListener("click", () => {
  history.back();
});

async function loadMatches() {
  const matchRes = await fetch("./matches.json");
  const matches = await matchRes.json();

  const codeRes = await fetch("./countryCodes.json");
  countryCodeMap = await codeRes.json();

  const teamMatches = matches.filter(match =>
    match.home.includes(team) ||
    match.away.includes(team)
  );

  displayMatches(teamMatches);
}

function displayMatches(matches) {
  if (matches.length === 0) {
    matchList.innerHTML = "<p>該当する試合がありません</p>";
    return;
  }

  matches.forEach(match => {
    const card = document.createElement("div");
    card.className = "match-card";
    const hasResult =
    match.homeScore !== undefined &&
    match.awayScore !== undefined;

    card.innerHTML = `
      <div class="match-date">${formatDate(match.date)}</div>

      <div class="match-time">
        ${match.time}〜
      </div>

      <div class="match-group">
        ${match.group}
      </div>

      <div class="match-teams">

        <div class="team">
          <img
            class="flag-image"
            src="https://flagcdn.com/w40/${countryCodeMap[match.home]}.png"
          >
          <span>${match.home}</span>
          <span class="score">
            ${hasResult ? `${match.homeScore}` : ""}
          </span>
        </div>

        <div class="vs">
          VS
        </div>

        <div class="team">
          <img
            class="flag-image"
            src="https://flagcdn.com/w40/${countryCodeMap[match.away]}.png"
          >
          <span>${match.away}</span>
          <span class="score">
            ${hasResult ? `${match.awayScore}` : ""}
          </span>
        </div>

      </div>
    `;

    matchList.appendChild(card);
  });
}

function formatDate(dateText) {
  const date = new Date(dateText);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

loadMatches();