$(document).ready(initialisation);

// get props of a target
function getProps(target) {
    let piece = new Piece();
    piece.element = $(target);
    piece.classList = target.classList;
    piece.x = piece.element.index();
    piece.y = piece.element.parent().index("tr");

    for (const type in MOVES) {
        if ($(target).hasClass(type)) {
            piece.type = type;
            break;
        }
    }

    return piece;
}

// click event, this is the entry point of the game
function selection() {
    // disable current highlighting when selecting other pieces
    if (currentPiece.element) {
        currentPiece.element.removeClass("highlight");

        disableMoves();
    }

    // set current props (piece, class, coords, type)
    currentPiece = getProps(this);

    // call the function relative to the piece type (see moves.js)
    MOVES[currentPiece.type](currentPiece);

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

    currentPiece.element.removeAttr("class");
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

function threatCheck() {
    let playerPieces = $(player.className);

    playerPieces.each(function () {
        let tempPiece = getProps(this);

        if (tempPiece.type === "pawn") {
            let case1 = atIndex(player.operation(tempPiece.y), tempPiece.x + 1);
            let case2 = atIndex(player.operation(tempPiece.y), tempPiece.x - 1);

            opponent.dangerCases.push(case1, case2);
        } else {
            MOVES[tempPiece.type](tempPiece);

            opponent.dangerCases = opponent.dangerCases.concat(possibleMoves);
            opponent.dangerCases =
                opponent.dangerCases.concat(possibleCaptures);
        }

        possibleMoves = [];
        possibleCaptures = [];
    });
}

// swap turn
function alternate() {
    threatCheck();

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
