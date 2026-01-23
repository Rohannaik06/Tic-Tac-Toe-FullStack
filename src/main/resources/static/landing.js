function selectFriend() {
    document.getElementById("playersBox").style.display = "flex";
    document.getElementById("playerO").disabled = false;
    document.getElementById("playerO").value = "";
}

function selectComputer() {
    document.getElementById("playersBox").style.display = "flex";
    document.getElementById("playerO").value = "Computer";
    document.getElementById("playerO").disabled = true;
}

function startGame() {
    const pX = document.getElementById("playerX").value || "Player X";
    const pO = document.getElementById("playerO").value || "Player O";
    localStorage.setItem("playerX", pX);
    localStorage.setItem("playerO", pO);
    window.location.href = "/game"; // Ensure your Spring Controller maps /game to sindex.html
}

// FETCH LIVE LEADERBOARD FROM SUPABASE
window.onload = function() {
    fetch('/api/leaderboard')
        .then(res => res.json())
        .then(data => {
            const top3Container = document.getElementById('top3-container');
            const top10List = document.getElementById('top10-list');
            
            // 1. Fill Top 3
            if(data.length >= 3) {
                top3Container.innerHTML = data.slice(0, 3).map((p, i) => `
                    <div class="player ${i==0?'gold':i==1?'silver':'bronze'}">
                        <div class="icon">${i==0?'🥇':i==1?'🥈':'🥉'}</div>
                        <h3>${p.username}</h3>
                        <p>${p.wins} Wins</p>
                    </div>
                `).join('');
            }

            // 2. Fill Top 10 List
            top10List.innerHTML = data.slice(3, 10).map((p, i) => `
                <li>
                    <span class="rank">${i + 4}</span>
                    <span class="name">${p.username}</span>
                    <span class="wins">${p.wins} Wins</span>
                </li>
            `).join('');
        })
        .catch(err => console.error("Leaderboard error:", err));
};