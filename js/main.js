$(document).ready(initialisation);

// click event, this is the entry point of the game
function selection() {
    // disable current highlighting when selecting other pieces
    if (currentPiece.element) {
        currentPiece.element.removeClass("highlight");

        disableMoves();
    }

    // set current props (piece, class, coords, type)
    currentPiece.element = $(this);
    currentPiece.classList = this.classList;
    currentPiece.x = currentPiece.element.index();
    currentPiece.y = currentPiece.element.parent().index("tr");

    for (const type in MOVES) {
        if ($(this).hasClass(type)) {
            currentPiece.type = type;
            MOVES[type]();
            break;
        }
    } // call the function relative to the piece type (see moves.js)

    // highlight current selection
    currentPiece.element.addClass("highlight");

    // highlight possible moves and captures
    for (const mv of possibleMoves) {
        mv.addClass("highlight-1");
        mv.on("click", move);
    }

    for (const capt of possibleCaptures) {
        capt.addClass("highlight-2");
        capt.on("click", move);
    }
}

// subsitute class between two elements to simulate a move
function move() {
    $(this).removeClass();
    $(this).addClass(currentPiece.classList.value);

    currentPiece.element.removeClass();
    currentPiece.element.off();

    disableMoves();
    alternate();
}

// disable event listeners for previous possible moves
function disableMoves() {
    for (const mv of possibleMoves) {
        mv.removeClass("highlight highlight-1");
        mv.off();
    }

    for (const capt of possibleCaptures) {
        capt.removeClass("highlight highlight-2");
        capt.off();
    }

    possibleMoves = [];
    possibleCaptures = [];
}

function threat() {
    // todo
}

// swap turn
function alternate() {
    let temp = player;
    player = opponent;
    opponent = temp;

    $(player.className).on("click", selection);
    $(opponent.className).off();

    console.log(`It's ${player.name}'s turn`);
}

function victoryChechk() {
    // todo
}

function end() {
    // todo
}

function reset() {
    // todo
}
