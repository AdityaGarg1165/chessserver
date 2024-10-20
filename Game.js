const { Chess } = require("chess.js");

class Game {
  constructor(socket_1, socket_2) {
    this.board = new Chess();
    this.Player1_id = socket_1?.id;
    this.Player2_id = socket_2?.id;
    this.Player1 = socket_1;
    this.Player2 = socket_2;
    this.Player1.emit("INIT");
    this.Player2.emit("INIT");
    this.turn = 0;
  }
  move(data) {
    const { from, to } = data;
    this.board.move(from, to);
    // this.turn++;
    return this.turn;
  }
}

module.exports = Game;
