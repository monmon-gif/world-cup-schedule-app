const matchList = document.getElementById("matchList");
const pageTitle = document.getElementById("pageTitle");

let countryCodeMap = {};

// URLから date を取得
const params = new URLSearchParams(location.search);
const date = params.get("date");

pageTitle.textContent = date;

async function loadMatches() {
  const matchRes = await fetch("./matches.json");
  const matches = await matchRes.json();

  const codeRes = await fetch("./countryCodes.json");
  countryCodeMap = await codeRes.json();

  const dayMatches = matches.filter(
    match => match.date === date
  );

  displayMatches(dayMatches);
}

function formatDate(dateText) {
  const date = new Date(dateText);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function displayMatches(matches) {
  if (matches.length === 0) {
    matchList.innerHTML = "<p>試合がありません</p>";
    return;
  }

  matches.forEach(match => {
    const card = document.createElement("div");
    card.className = "match-card";

    card.innerHTML = `
      <div class="match-date">${formatDate(match.date)}</div>

      <div class="match-time">
        ${match.time}〜
      </div>

      <div class="match-teams">

        <div class="team">
          <img
            class="flag-image"
            src="https://flagcdn.com/w40/${countryCodeMap[match.home]}.png"
          >
          <span>${match.home}</span>
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
        </div>

      </div>
    `;

    matchList.appendChild(card);
  });
}

const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
  history.back();
});

loadMatches();