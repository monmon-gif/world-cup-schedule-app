const calendarGrid = document.getElementById("calendarGrid");
const teamSearchInput = document.getElementById("teamSearchInput");
const teamSearchButton = document.getElementById("teamSearchButton");
const suggestList = document.getElementById("suggestList");
const monthTitle = document.getElementById("monthTitle");
const prevMonthButton = document.getElementById("prevMonthButton");
const nextMonthButton = document.getElementById("nextMonthButton");

let currentMonth = 6;

let matches = [];

// JSON読み込み
async function loadMatches() {
  const res = await fetch("./matches.json");
  matches = await res.json();

  createCalendar(2026, currentMonth);

  createTeamOptions();
}

// カレンダー作成
function createCalendar(year, month) {
  calendarGrid.innerHTML = "";
  monthTitle.textContent = `${year}年${month}月`;

  const firstDay = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();

  const startDay = firstDay.getDay();

  // 月初の空白
  for (let i = 0; i < startDay; i++) {
    const emptyDiv = document.createElement("div");
    calendarGrid.appendChild(emptyDiv);
  }

  // 日付
  for (let day = 1; day <= lastDate; day++) {
    const dateText = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const dayMatches = matches.filter(
      match => match.date === dateText
    );

    const hasMatch = dayMatches.length > 0;

    const hasJapanMatch = dayMatches.some(
      match =>
        match.home === "日本" ||
        match.away === "日本"
    );

    const knockoutMatch = dayMatches.find(match =>
      match.group.includes("ベスト") ||
      match.group.includes("準") ||
      match.group.includes("3位")||
      match.group.includes("決勝")
    );

    const dayCard = document.createElement("div");
    dayCard.className = "day-card";

    if (hasJapanMatch) {
      dayCard.innerHTML = `
        <div class="day-number">${day}</div>
        <div class="japan-flag"></div>
      `;
    } else {
      dayCard.innerHTML = `
        <div class="day-number">${day}</div>
      `;
    }

    if (hasMatch) {
      dayCard.classList.add("has-match");
    }
    
    if (knockoutMatch) {
      dayCard.innerHTML = `
        <div class="day-number">${day}</div>

        <div class="knockout-label">
          ${knockoutMatch.group}
        </div>
      `;
    } else if (hasJapanMatch) {
      dayCard.innerHTML = `
        <div class="day-number">${day}</div>

        <div class="japan-flag"></div>
      `;
    } else {
      dayCard.innerHTML = `
        <div class="day-number">${day}</div>
      `;
    }

    dayCard.addEventListener("click", () => {
      location.href = `day.html?date=${dateText}`;
    });

    calendarGrid.appendChild(dayCard);
  }
}

function getTeams() {
  const teams = [];

  matches.forEach(match => {
    teams.push(match.home);
    teams.push(match.away);
  });

  return [...new Set(teams)];
}

teamSearchButton.addEventListener("click", () => {
  const team = teamSearchInput.value.trim();

  if (!team) {
    alert("国名を入力してください");
    return;
  }

  location.href = `team.html?team=${encodeURIComponent(team)}`;
});

function createTeamOptions() {
  const teams = [];

  matches.forEach(match => {
    teams.push(match.home);
    teams.push(match.away);
  });

  const uniqueTeams = [...new Set(teams)];

  uniqueTeams.forEach(team => {
    const option = document.createElement("option");

    option.value = team;

    teamList.appendChild(option);
  });
}

prevMonthButton.addEventListener("click", () => {
  currentMonth = 6;
  createCalendar(2026, currentMonth);
});

nextMonthButton.addEventListener("click", () => {
  currentMonth = 7;
  createCalendar(2026, currentMonth);
});

const teamList = document.getElementById("teamList");

loadMatches();