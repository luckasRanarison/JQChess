$(document).ready(initialisation);

// get props of a target
function getProps(target) {
    let element = $(target);
    let classList = target.classList;
    let x = element.index();
    let y = element.parent().index();

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
    if (currentPiece.type !== "king") actionCheck(currentPiece);

    // call the function relative to the piece type (see moves.js)
    if (currentPiece.normalMoves) MOVES[currentPiece.type](currentPiece);

    // highlight possible moves and captures
    for (const mv of currentPiece.possibleMoves) {
        mv.addClass("highlight-1");
        mv.on("click", move);
    }

    for (const capt of currentPiece.possibleCaptures) {
        capt.addClass("highlight-2");
        capt.on("click", move);
    }

    if (currentPiece.enPassant) {
        currentPiece.enPassant.addClass("highlight-1");
        currentPiece.enPassant.on("click", move);
    }
}

// subsitute class between two elements to simulate a move
function move() {
    if (currentPiece.enPassant) {
        $(".en-passant").removeClass();
    }

    $(this).removeClass();
    $(this).addClass(currentPiece.classList.value);

    currentPiece.element.removeAttr("class");
    currentPiece.element.off();

    // remove expired en passant possibilty
    $(".en-passant").removeClass("en-passant");

    // check for pawn promotion and en passant
    if (currentPiece.type === "pawn") {
        let destination = $(this).parent().index();

        if (currentPiece.y === player.frontLine) {
            if (destination === player.operation(player.frontLine, 2)) {
                $(this).addClass("en-passant");
            }
        }

        if (destination === opponent.secondLine) {
            pawnPromotion($(this));
        }
    }

    disableMoves();

    swapPlayers();

    player.checkmate = threatCheck();

    if (player.checkmate) $(`${player.className}.king`).addClass("highlight-2");

    !victoryCheck() ? alternate() : end();
}

// disable event listeners for previous possible moves
function disableMoves() {
    $(".highlight").removeClass("highlight");

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
    player.threatMap = [];
    player.assailant = undefined;

    // swap two players temporarily to simulate attacks
    swapPlayers();

    let opponentPieces = $(player.className);

    opponentPieces.each(function () {
        let tempPiece = getProps(this);

        if (tempPiece.type === "pawn") {
            let case1 = atIndex(player.operation(tempPiece.y), tempPiece.x + 1);
            let case2 = atIndex(player.operation(tempPiece.y), tempPiece.x - 1);

            opponent.threatMap.push(case1, case2);

            let temp = [case1, case2];

            for (const capt of temp) {
                if (capt.hasClass(`${opponent.name} king`)) {
                    opponent.assailant = tempPiece;
                    threat = true;
                    break;
                }
            }
        } else {
            tempPiece.type === "king"
                ? MOVES["king"](tempPiece, false)
                : MOVES[tempPiece.type](tempPiece);

            for (const capt of tempPiece.possibleCaptures) {
                if (capt.hasClass(`${opponent.name} king`)) {
                    opponent.assailant = tempPiece;
                    threat = true;
                    break;
                }
            }

            opponent.threatMap = opponent.threatMap.concat(
                tempPiece.possibleMoves
            );
            opponent.threatMap = opponent.threatMap.concat(
                tempPiece.possibleCaptures
            );
        }

        tempPiece.clearMoves();
    });

    swapPlayers();

    // for debug purposes

    // for (const danger of player.threatMap) {
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

    for (const danger of player.threatMap) {
        // test if the piece can take actions (protect, capture)
        if (danger.hasClass(`${player.name} king`)) {
            // verify if there is only one assailant
            if (player.assailant) {
                // verify if the piece can protect the king
                let [protect, capture] = [false, false];
                let temp = [];
                let blockMoves = [];

                let assailant = player.assailant;

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

                    if (!threat) {
                        blockMoves.push(move);
                    }
                }

                if (blockMoves.length > 0) {
                    protect = true;
                    target.possibleMoves = blockMoves;
                }

                for (const capt of target.possibleCaptures) {
                    capture =
                        capt.index("td") === assailant.element.index("td");

                    if (capture) {
                        target.possibleCaptures = [capt];
                        break;
                    }
                }

                if (!protect) target.possibleMoves = [];
                if (!capture) target.possibleCaptures = [];

                if (protect || capture) target.specialActions = true;
            }

            // immobize pieces defending the king if they can't do other actions
            target.normalMoves = false;
            break;
        }
    }
}

function pawnPromotion(target) {
    $("#root").append(
        ` <div class="popup-screen visible">
            <div class="popup promotion">
                <div>Choose a piece</div>
                <div class="grid-container">
                    <img src="./assets/queen_outline.png" alt="Queen" class="queen" />
                    <img src="./assets/rook_outline.png" alt="Rook" class="rook" />
                    <img src="./assets/bishop_outline.png" alt="Bishop" class="bishop"/>
                    <img src="./assets/knight_outline.png" alt="Knight" class="knight"/>
                </div>
            </div>
        </div>`
    );

    $(".grid-container > img").on("click", function () {
        target.removeClass("pawn");
        target.addClass(this.className);

        closePopup();
    });

    player.checkmate = threatCheck();

    if (player.checkmate) $(`${player.className}.king`).addClass("highlight-2");

    if (victoryCheck()) end();
}

// swap players
function swapPlayers() {
    [player, opponent] = [opponent, player];
}

// swap click event
function alternate() {
    // debug
    // $(".highlight-2").removeClass("highlight-2");

    // remove king highlighting
    $(`${opponent.className}.king`).removeClass("highlight-2");

    $(player.className).on("click", selection);
    $(opponent.className).off();
}

function victoryCheck() {
    let kingMove = true;
    let action = false;

    if (player.checkmate) {
        // test if the king can move
        let king = $(`${player.className}.king`);
        let kingPiece = getProps(king);

        MOVES[kingPiece.type](kingPiece);

        if (!kingPiece.checkMoves()) {
            kingMove = false;
        } else {
            kingPiece.clearMoves();
        }

        if (!kingMove) {
            // test if other pieces can move
            for (const piece of $(player.className)) {
                let tempPiece = getProps(piece);

                actionCheck(tempPiece);

                if (tempPiece.specialActions) {
                    action = true;
                    tempPiece.clearMoves();
                    break;
                }
            }
        }

        if (!kingMove && !action) {
            return true;
        }
    }
}

function end() {
    // winner display message
    let winner = opponent.name.toUpperCase();

    $("#root").append(
        `<div class="popup-screen visible" onclick="closePopup()">
            <div class="popup victory">
                <div>CHECKMATE</div>
                <img src="./assets/trophy.png" alt="Victory" />
                <div>
                    <span id="winner" class="${opponent.name}">${winner}</span>
                    <span>Won !</span>
                </div>
            </div>
        </div>`
    );

    // disable click event
    $(player.className).off();
    $(opponent.className).off();
}

function reset() {
    // todo
}

// some other event listeners
function closePopup() {
    $(".popup-screen").remove();
}
