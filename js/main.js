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
    actionCheck(currentPiece);

    // call the function relative to the piece type (see moves.js)
    if (currentPiece.mobility) MOVES[currentPiece.type](currentPiece);

    // highlight possible moves and captures
    for (const mv of currentPiece.possibleMoves) {
        mv.addClass("highlight-1");
        mv.on("click", move);
    }

    for (const capt of currentPiece.possibleCaptures) {
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
    for (const mv of currentPiece.possibleMoves) {
        mv.removeClass("highlight highlight-1");
        mv.off();
    }

    for (const capt of currentPiece.possibleCaptures) {
        capt.removeClass("highlight highlight-2");
        capt.off();
    }

    currentPiece.clearMoves();
}

function threatCheck() {
    let threat = false;
    player.dangerCases = [];
    player.assailant = [];

    // swap two players temporarily to simulate attacks
    swapPlayers();

    let opponentPieces = $(player.className);

    opponentPieces.each(function () {
        let tempPiece = getProps(this);

        if (tempPiece.type === "pawn") {
            let case1 = atIndex(player.operation(tempPiece.y), tempPiece.x + 1);
            let case2 = atIndex(player.operation(tempPiece.y), tempPiece.x - 1);

            opponent.dangerCases.push(case1, case2);
        } else {
            MOVES[tempPiece.type](tempPiece);

            for (const capt of tempPiece.possibleCaptures) {
                if (capt.hasClass("king")) {
                    opponent.assailant.push(tempPiece);
                    threat = true;
                    break;
                } else {
                    threat = false;
                }
            }

            opponent.dangerCases = opponent.dangerCases.concat(
                tempPiece.possibleMoves
            );
            opponent.dangerCases = opponent.dangerCases.concat(
                tempPiece.possibleCaptures
            );
        }

        tempPiece.clearMoves();
    });

    swapPlayers();

    // for debug purposes

    // for (const danger of player.dangerCases) {
    //     danger.addClass("highlight-2");
    // }

    return threat;
}

function actionCheck(target) {
    let classes = target.classList.value;

    // test what happens if the selected piece was removed
    target.element.removeClass();

    threatCheck();

    target.element.addClass(classes);

    for (const danger of player.dangerCases) {
        // test if the piece can take actions (protect, capture)
        if (danger.hasClass(`${player.name} king`) && target.type !== "king") {
            // verify if there is only one assailant
            if (player.getAssailant() === 1) {
                // verify if the piece can protect the king
                let protect = false;
                let temp = [];
                let blockMoves = [];

                let assailant = player.assailant[0];

                MOVES[assailant.type](assailant);
                MOVES[target.type](target);

                for (const mv of target.possibleMoves) {
                    for (const path of assailant.possibleMoves) {
                        if (mv.index("td") === path.index("td")) {
                            temp.push(mv);
                        }
                    }
                }

                for (const move of temp) {
                    // simulate the move
                    target.element.removeClass();
                    move.addClass(player.name);

                    let threat = threatCheck();

                    // replace the piece
                    target.element.addClass(classes);
                    move.removeClass(player.name);

                    if (!threat) blockMoves.push(move);
                }

                if (blockMoves.length > 0) {
                    protect = true;
                    target.possibleMoves = blockMoves;
                }

                // verify if the selected piece can capture the assailant
                let capture = target.possibleCaptures.some(
                    (capt) => capt.index("td") === assailant.element.index("td")
                );

                if (!protect) target.possibleMoves = [];
                if (!capture) target.possibleCaptures = [];

                console.log(`protect: ${protect}, capture: ${capture}`);
            }

            // immobize pieces defending the king if they can't do other actions
            target.mobility = false;
            break;
        }
    }
}

function swapPlayers() {
    [player, opponent] = [opponent, player];
}

// swap turn
function alternate() {
    swapPlayers();

    $(player.className).on("click", selection);
    $(opponent.className).off();

    console.log(`It's ${player.name}'s turn`);

    // remove unexpected highlights
    $(".highlight-2").removeClass("highlight-2");

    threatCheck();

    for (const danger of player.dangerCases) {
        if (danger.hasClass("king")) {
            danger.addClass("highlight-2");
        }
    }
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
