initialisation();

function selection() {
    // disable current highlighting when selecting other pieces
    if (current.piece && current.piece !== $(this)) {
        current.piece.removeClass("highlight");

        disableMoves();
    }

    // highlight current selection
    $(this).toggleClass("highlight");

    // set current props (piece, class, type)
    current.piece = $(this);
    current.class = this.classList;

    for (const type of TYPES) {
        if ($(this).hasClass(type)) {
            current.type = type;
            break;
        }
    }

    // position the board
    x = current.piece.index();
    y = current.piece.parent().index("tr");

    // functions for finding possible moves (fill the possibleMoves array)
    switch (current.type) {
        case "pawn":
            movePawn();
            break;
        case "rook":
            moveRook();
            break;
        case "knight":
            moveKnight();
            break;
        case "bishop":
            moveBishop();
            break;
        case "queen":
            moveQueen();
            break;
        case "king":
            moveKing();
            break;
    }

    // highlight possible moves and captures
    for (const move of possibleMoves) {
        move.addClass("highlight-1");
    }

    for (const capt of possibleCaptures) {
        capt.addClass("highlight-2");
    }
}

function movePawn() {
    // moves
    switch (player.name) {
        case "white":
            y === 6 ? (max = 2) : (max = 1);
            operation = substraction;
            break;

        case "black":
            y === 1 ? (max = 2) : (max = 1);
            operation = addition;
            break;
    }

    for (let i = 1; i <= max; i++) {
        let temp = $(`tr:eq(${operation(y, i)})>td:eq(${x})`);

        if (temp.hasClass("white") || temp.hasClass("black")) {
            break;
        }

        possibleMoves.push(temp);
        temp.on("click", move);
    }

    // capture
    let case1 = $(`tr:eq(${operation(y, 1)})>td:eq(${x + 1})`);
    let case2 = $(`tr:eq(${operation(y, 1)})>td:eq(${x - 1})`);

    let cases = [case1, case2];

    for (const capt of cases) {
        if (capt.hasClass(opponent.name)) {
            possibleCaptures.push(capt);
            capt.on("click", move);
        }
    }
}

function moveRook() {
    console.log("rook");
    // todo
}

function moveKnight() {
    console.log("knight");
    // todo
}

function moveBishop() {
    console.log("bishop");
    // todo
}

function moveQueen() {
    console.log("queen");
    // todo
}

function moveKing() {
    console.log("king");
    // todo
}

function threat() {
    // todo
}

function move() {
    $(this).removeClass(opponent.name);
    $(this).addClass(current.class.value);
    current.piece.removeClass();
    current.piece.off();

    disableMoves();
    alternate();
}

function disableMoves() {
    for (const move of possibleMoves) {
        move.removeClass("highlight highlight-1");
        move.off();
    }

    for (const capt of possibleCaptures) {
        capt.removeClass("highlight highlight-2");
        capt.off();
    }

    possibleMoves = [];
    possibleCaptures = [];
}

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

// lol
function addition(x, y) {
    return x + y;
}

function substraction(x, y) {
    return x - y;
}
