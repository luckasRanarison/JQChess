$(document).ready(initialisation);

// get props of a target
function getProps(target) {
    let element = $(target);
    let classList = target.classList;
    let x = element.index();
    let y = element.parent().index("tr");

    for (const moveType in MOVES) {
        if ($(target).hasClass(moveType)) {
            type = moveType;
            break;
        }
    }

    return new Piece(element, classList, type, x, y);
}

function compare(target1, target2) {
    if (target1.x === target2.x && target1.x === target2.y) {
        return true;
    } else {
        return false;
    }
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

    // highlight current selection
    currentPiece.element.addClass("highlight");

    // test if the piece can move (not protecting the king)
    threatCheck("preCheck");

    // call the function relative to the piece type (see moves.js)
    if (currentPiece.mobility) MOVES[currentPiece.type](currentPiece);

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

    $(".highlight-2").removeClass("highlight-2");

    possibleMoves = [];
    possibleCaptures = [];
}

function threatCheck(mode) {
    player.dangerCases = [];
    // swap two players temporarily to simulate attacks
    [player, opponent] = [opponent, player];

    let classes = currentPiece.classList.value;
    let opponentPieces = $(player.className);

    currentPiece.element.removeClass();

    opponentPieces.each(function () {
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

    currentPiece.element.addClass(classes);

    [player, opponent] = [opponent, player];

    for (const danger of player.dangerCases) {
        if (danger.hasClass("king")) {
            switch (mode) {
                case "preCheck":
                    currentPiece.mobility = false;
                    break;

                case "postCheck":
                    danger.addClass("highlight-2");
                    break;
            }
            break;
        }
    }

    // for (const danger of player.dangerCases) {
    //     danger.addClass("highlight-2");
    // }
}

// swap turn
function alternate() {
    [player, opponent] = [opponent, player];

    $(player.className).on("click", selection);
    $(opponent.className).off();

    console.log(`It's ${player.name}'s turn`);

    threatCheck("postCheck");
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
