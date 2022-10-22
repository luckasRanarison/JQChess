// globals
class Player {
    constructor(name, className) {
        this.name = name;
        this.className = className;
    }
}

const TYPES = ["pawn", "rook", "knight", "bishop", "queen", "king"];

let player1 = new Player("white", ".white");
let player2 = new Player("black", ".black");
let player, opponent, current;
let x, y; // position on the board [y,x]
let possibleMoves, possibleCaptures; //will be used for detecting threats later on

// game initialisation
function initialisation() {
    player = player1;
    opponent = player2;

    current = {
        piece: undefined,
        class: undefined,
        type: undefined,
    };

    possibleMoves = [];
    possibleCaptures = [];

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

    // add click event to current player pieces
    $(player.className).on("click", selection);
}
