/* Tic Tac Toe — vanilla JS, no dependencies */
(function () {
  "use strict";

  var WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  var board = ["", "", "", "", "", "", "", "", ""];
  var current = "X";
  var gameOver = false;
  var mode = "2p";            // "2p" | "cpu"
  var locked = false;         // blocks clicks while the computer "thinks"
  var scores = { X: 0, O: 0, draws: 0 };

  var cells = Array.prototype.slice.call(document.querySelectorAll(".cell"));
  var statusEl = document.getElementById("status");
  var oLabel = document.getElementById("o-label");
  var mode2pBtn = document.getElementById("mode-2p");
  var modeCpuBtn = document.getElementById("mode-cpu");
  var newRoundBtn = document.getElementById("new-round");
  var resetAllBtn = document.getElementById("reset-all");

  function opponent(p) { return p === "X" ? "O" : "X"; }

  function winnerOf(state) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var a = WIN_LINES[i][0], b = WIN_LINES[i][1], c = WIN_LINES[i][2];
      if (state[a] && state[a] === state[b] && state[a] === state[c]) {
        return { player: state[a], line: WIN_LINES[i] };
      }
    }
    return null;
  }

  function isFull(state) {
    for (var i = 0; i < state.length; i++) {
      if (!state[i]) return false;
    }
    return true;
  }

  function availableMoves(state) {
    var moves = [];
    for (var i = 0; i < state.length; i++) {
      if (!state[i]) moves.push(i);
    }
    return moves;
  }

  /* Minimax with depth so the computer always plays a best move. */
  function minimax(state, player, aiPlayer, depth) {
    var win = winnerOf(state);
    if (win) return win.player === aiPlayer ? 10 - depth : depth - 10;
    if (isFull(state)) return 0;

    var moves = availableMoves(state);
    var best = player === aiPlayer ? -Infinity : Infinity;

    for (var i = 0; i < moves.length; i++) {
      state[moves[i]] = player;
      var score = minimax(state, opponent(player), aiPlayer, depth + 1);
      state[moves[i]] = "";
      if (player === aiPlayer) {
        if (score > best) best = score;
      } else {
        if (score < best) best = score;
      }
    }
    return best;
  }

  function bestMove(state, aiPlayer) {
    var moves = availableMoves(state);
    if (!moves.length) return -1;
    var bestScore = -Infinity;
    var choice = moves[0];
    for (var i = 0; i < moves.length; i++) {
      state[moves[i]] = aiPlayer;
      var score = minimax(state, opponent(aiPlayer), aiPlayer, 1);
      state[moves[i]] = "";
      if (score > bestScore) {
        bestScore = score;
        choice = moves[i];
      }
    }
    return choice;
  }

  function renderScoreboard() {
    document.querySelector('[data-score="X"]').textContent = scores.X;
    document.querySelector('[data-score="O"]').textContent = scores.O;
    document.querySelector('[data-score="draws"]').textContent = scores.draws;
  }

  function render() {
    for (var i = 0; i < cells.length; i++) {
      var v = board[i];
      var cell = cells[i];
      cell.textContent = v;
      cell.classList.toggle("is-x", v === "X");
      cell.classList.toggle("is-o", v === "O");
      cell.classList.remove("is-win");
      cell.disabled = gameOver || locked || !!v || (mode === "cpu" && current === "O");
    }
  }

  function setStatus(text) { statusEl.textContent = text; }

  function finish(result) {
    gameOver = true;
    if (result) {
      scores[result.player] += 1;
      for (var i = 0; i < result.line.length; i++) {
        cells[result.line[i]].classList.add("is-win");
      }
      var name = result.player === "O" && mode === "cpu" ? "Computer" : "Player " + result.player;
      setStatus(name + " wins!");
    } else {
      scores.draws += 1;
      setStatus("It's a draw.");
    }
    renderScoreboard();
    render();
  }

  function play(index) {
    if (gameOver || locked || board[index]) return;

    board[index] = current;
    var win = winnerOf(board);

    if (win) { finish(win); return; }
    if (isFull(board)) { finish(null); return; }

    current = opponent(current);
    render();
    setStatus((current === "X" ? "Player X" : (mode === "cpu" ? "Computer" : "Player O")) + "'s turn");

    if (mode === "cpu" && current === "O") {
      locked = true;
      render();
      setStatus("Computer is thinking…");
      window.setTimeout(function () {
        locked = false;
        var move = bestMove(board.slice(), "O");
        if (move > -1) play(move);
      }, 320);
    }
  }

  function newRound() {
    board = ["", "", "", "", "", "", "", "", ""];
    current = "X";
    gameOver = false;
    locked = false;
    for (var i = 0; i < cells.length; i++) cells[i].classList.remove("is-win");
    render();
    setStatus("Player X starts — tap a square");
  }

  function resetAll() {
    scores = { X: 0, O: 0, draws: 0 };
    renderScoreboard();
    newRound();
  }

  function setMode(next) {
    mode = next;
    mode2pBtn.classList.toggle("is-active", mode === "2p");
    modeCpuBtn.classList.toggle("is-active", mode === "cpu");
    oLabel.textContent = mode === "cpu" ? "CPU" : "O";
    renderScoreboard();
    newRound();
  }

  for (var i = 0; i < cells.length; i++) {
    (function (index) {
      cells[index].addEventListener("click", function () { play(index); });
    })(i);
  }

  mode2pBtn.addEventListener("click", function () { setMode("2p"); });
  modeCpuBtn.addEventListener("click", function () { setMode("cpu"); });
  newRoundBtn.addEventListener("click", newRound);
  resetAllBtn.addEventListener("click", resetAll);

  render();
  renderScoreboard();

  /* Exposed for automated tests only. */
  window.__game = {
    winnerOf: winnerOf,
    isFull: isFull,
    bestMove: bestMove,
    availableMoves: availableMoves,
    getState: function () { return board.slice(); },
    getCurrent: function () { return current; },
    isGameOver: function () { return gameOver; },
    play: play,
    newRound: newRound,
    setMode: setMode
  };
})();
