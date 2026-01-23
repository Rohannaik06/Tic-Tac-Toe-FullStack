const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const playersText = document.getElementById("players");
const restartBtn = document.getElementById("restart");

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupRestart = document.getElementById("popup-restart");

const playerX = localStorage.getItem("playerX") || "Player X";
const playerO = localStorage.getItem("playerO") || "Player O";

playersText.textContent = `${playerX} (X) vs ${playerO} (O)`;

let currentPlayer = "X";
let gameActive = true;
let board = ["","","","","","","","",""];

const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", clickCell));
restartBtn.addEventListener("click", restartGame);
popupRestart.addEventListener("click", restartGame);

function clickCell() {
    const index = this.dataset.index;
    if (board[index] || !gameActive) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;
    this.classList.add(currentPlayer);

    checkWinner();

    if(gameActive && playerO === "Computer" && currentPlayer === "O"){
        aiMove();
    }
}

function checkWinner() {
    let winnerFound = false;
    for (let combo of wins) {
        const [a,b,c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            combo.forEach(i => cells[i].classList.add("win"));
            winnerFound = true;
            
            const winnerName = currentPlayer === "X" ? playerX : playerO;
            showPopup(`${winnerName} Wins 🎉`);
            
            // SAVE WIN TO SUPABASE
            saveWinToDatabase(winnerName);

            gameActive = false;
            return;
        }
    }

    if (!board.includes("") && !winnerFound) {
        showPopup("It's a Draw 🤝");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer === "X" ? playerX : playerO}'s Turn`;
}

// NEW: This function talks to your Spring Boot Controller
function saveWinToDatabase(winnerName) {
    // 1. Get the name of the person currently logged into this browser
    const activeUser = localStorage.getItem("username");

    // 2. Security Check:
    // Only save the win IF the winner is the person who is logged in.
    if (!activeUser || winnerName !== activeUser) {
        console.warn("Win not recorded: Winner is not the logged-in user.");
        return;
    }

    // 3. Extra check for generic names
    const genericNames = ["Computer", "Player X", "Player O", "Guest"];
    if (genericNames.includes(winnerName)) return;

    console.log("Verified win for logged-in user: " + winnerName);

    // 4. Send to database only after verification
    fetch(`/api/leaderboard/win?username=${encodeURIComponent(winnerName)}`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) console.log("Win successfully saved to Supabase!");
    })
    .catch(err => console.error("Network Error:", err));
}

function restartGame() {
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = `${playerX}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = "cell";
    });
    hidePopup();
}

function aiMove() {
    let emptyIndexes = board.map((v,i) => v === "" ? i : null).filter(v => v!==null);
    if(emptyIndexes.length === 0) return;
    let choice = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    setTimeout(() => { cells[choice].click(); }, 400);
}

function showPopup(message){
    popupMessage.textContent = message;
    popup.classList.remove("hidden");
}

function hidePopup(){
    popup.classList.add("hidden");
}