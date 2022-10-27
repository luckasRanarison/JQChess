class Player {
    constructor(name, className, frontLine, operation) {
        this.name = name;
        this.className = className;
        this.frontLine = frontLine; // for pawn moves
        this.operation = operation;
        this.checkmate = false;
        this.assailant = undefined;
        this.dangerCases = [];
    }
}

class Piece {
    constructor(element, classList, type, x, y) {
        this.element = element;
        this.classList = classList;
        this.type = type;
        this.x = x;
        this.y = y;
        this.normalMoves = true;
        this.specialActions = false;
        this.possibleMoves = [];
        this.possibleCaptures = [];
    }

    clearMoves() {
        this.possibleMoves = [];
        this.possibleCaptures = [];
    }

    checkMoves() {
        if (
            this.possibleCaptures.length === 0 &&
            this.possibleMoves.length === 0
        ) {
            return false;
        }
    }
}

// globals
const increment = (x, y = 1) => x + y;
const decrement = (x, y = 1) => x - y;

const atIndex = (i, j) => $(`tr:eq(${i})>td:eq(${j})`);

let player, opponent;
let currentPiece;

// game initialisation
function initialisation() {
    // create the board
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");
        $("#chess-board").append(tr);

        for (let j = 0; j < 8; j++) {
            let td = document.createElement("td");
            $(tr).append(td);
            $(td).append("<div></div>");
        }
    }

    // place pieces on the board
    $("td")
        .slice(48) //(48, 63)
        .each(function () {
            $(this).addClass("white");
        });

    $("td")
        .slice(0, 16)
        .each(function () {
            $(this).addClass("black");
        });

    $("tr:eq(1), tr:eq(6)")
        .children()
        .each(function () {
            $(this).addClass("pawn");
        });

    $("td:eq(0), td:eq(7), td:eq(56), td:eq(63)").addClass("rook");

    $("td:eq(1), td:eq(6), td:eq(57), td:eq(62)").addClass("knight");

    $("td:eq(2), td:eq(5), td:eq(58), td:eq(61)").addClass("bishop");

    $("td:eq(3), td:eq(59)").addClass("king");

    $("td:eq(4), td:eq(60)").addClass("queen");

    // variables initialisation
    player = new Player("white", ".white", 6, decrement);
    opponent = new Player("black", ".black", 1, increment);

    currentPiece = new Piece();

    // add click event to current player pieces
    $(player.className).on("click", selection);
}
