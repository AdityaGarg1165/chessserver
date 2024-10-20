const Game = require("./Game");

class GameManager {
  constructor() {
    this.games = [];
    this.pendingUser = null;
  }

  addUser(socket) {
    socket.emit("cts");
    this.addListener(socket);
    if (this.pendingUser) {
      const game = new Game(this.pendingUser, socket);
      this.games.push(game);
      this.pendingUser.emit("color", "white");
      socket.emit("color", "black");
      this.pendingUser = null;
    } else {
      this.pendingUser = socket;
    }
  }

  addListener(socket) {
    socket.on("move", (data) => {
      const game = this.games.filter(
        (x) => x.Player1_id === socket.id || x.Player2_id === socket.id,
      )[0];
      console.log(game.turn % 2, socket !== game.Player2);
      if (game.turn % 2 === 0 && socket !== game.Player2) {
        // console.log(socket !== game.Player2);
        try {
          game.board.move({ from: data.from, to: data.piece });
          game.turn++;
          game.Player1.emit("board", {
            board: game.board.board(),
            turn: game.turn,
          });
          game.Player2.emit("board", {
            board: game.board.board(),
            turn: game.turn,
          });
          if (game.board.isGameOver()) {
            const winner = game.board.turn() % 2 === 0 ? "white" : "black";
            game.Player1.emit("winner", winner);
            game.Player2.emit("winner", winner);
          }
        } catch (error) {
          console.log(`An Error Occured: ${error}`);
          socket.emit("board", game?.board.board());
        }
      }
      if (game.turn % 2 !== 0 && socket !== game.Player1) {
        try {
          game.board.move({ from: data.from, to: data.piece });
          game.turn++;
          game.Player1.emit("board", {
            board: game.board.board(),
            turn: game.turn,
          });
          game.Player2.emit("board", {
            board: game.board.board(),
            turn: game.turn,
          });
          if (game.board.isGameOver()) {
            console.log("game over");
            const winner = game.board.turn() % 2 === 0 ? "white" : "black";
            game.Player1.emit("winner", winner);
            game.Player2.emit("winner", winner);
          }
        } catch (error) {
          console.log(`An Error Occured: ${error}`);
        }
      }
    });
    socket.on("disconnect", () => {
      const game = this.games.filter(
        (x) => x.Player1_id === socket.id || x.Player2_id === socket.id,
      )[0];
      this.games = this.games.filter(
        (x) => x.Player1_id !== socket.id && x.Player2_id !== socket.id,
      );
      console.log(`User Disconnected with socket id : ${socket.id}`);
      try {
        game.Player1.emit("abd");
      } catch {}
      try {
        game.Player2.emit("abd");
      } catch {}
      if (this.pendingUser === socket) {
        this.pendingUser = null;
      }
    });
  }
}

module.exports = GameManager;
