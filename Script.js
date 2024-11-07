document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById('app');

    let boardSize = 4;
    let turnCount = 0;
    let currentPlayer = 1;
    let scores = [0, 0];
    let flippedCards = [];
    let matchedPairs = 0;
    let board;

    function initializeGame() {
        app.innerHTML = `
            <div class="controls">
                <button onclick="startGame()">Nová hra</button>
                <span id="status"></span>
            </div>
            <div id="board" class="board"></div>
        `;
        updateStatus();
        startGame();
    }

    function startGame() {
        board = createBoard(boardSize);
        renderBoard();
        turnCount = 0;
        currentPlayer = 1;
        scores = [0, 0];
        flippedCards = [];
        matchedPairs = 0;
        updateStatus();
    }

    function createBoard(size) {
        const totalCards = size * size;
        const cardValues = Array(totalCards / 2)
            .fill()
            .map((_, i) => i + 1)
            .flatMap(v => [v, v]);
        cardValues.sort(() => Math.random() - 0.5);
        return cardValues.map(value => ({ value, matched: false }));
    }

    function renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        boardElement.innerHTML = board
            .map((card, index) => `
                <div class="card" data-index="${index}" onclick="flipCard(${index})">
                    ${card.matched ? card.value : ''}
                </div>
            `).join('');
    }

    function flipCard(index) {
        if (flippedCards.length >= 2 || board[index].matched) return;

        const cardElement = document.querySelector(`[data-index="${index}"]`);
        cardElement.classList.add('flipped');
        cardElement.textContent = board[index].value;
        flippedCards.push({ ...board[index], index });

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
 
    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.value === card2.value) {
            board[card1.index].matched = true;
            board[card2.index].matched = true;
            scores[currentPlayer - 1]++;
            matchedPairs++;
            updateStatus();
            if (matchedPairs === board.length / 2) endGame();
        } else {
            setTimeout(() => {
                document.querySelector(`[data-index="${card1.index}"]`).classList.remove('flipped');
                document.querySelector(`[data-index="${card2.index}"]`).classList.remove('flipped');
                document.querySelector(`[data-index="${card1.index}"]`).textContent = '';
                document.querySelector(`[data-index="${card2.index}"]`).textContent = '';
                flippedCards = [];
                switchPlayer();
            }, 1000);
        }
        flippedCards = [];
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnCount++;
        updateStatus();
    }

    function updateStatus() {
        document.getElementById('status').textContent = `
            Hráč ${currentPlayer} na tahu | Tahy: ${turnCount} |
            Skóre: Hráč 1 - ${scores[0]}, Hráč 2 - ${scores[1]}
        `;
    }

    window.startGame = startGame;
    window.flipCard = flipCard;

    initializeGame();
});
