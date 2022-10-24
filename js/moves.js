function movePawn() {
    // moves
    currentPiece.y === player.frontLine ? (max = 2) : (max = 1);

    // pawn move differently for the two players, that's why each player have his own method
    for (let i = 1; i <= max; i++) {
        let temp = atIndex(player.operation(currentPiece.y, i), currentPiece.x);

        if (temp.hasClass("white") || temp.hasClass("black")) {
            break;
        }
        possibleMoves.push(temp);
    }

    // capture
    let capture1 = atIndex(
        player.operation(currentPiece.y),
        currentPiece.x + 1
    );
    let capture2 = atIndex(
        player.operation(currentPiece.y),
        currentPiece.x - 1
    );

    let captures = [capture1, capture2];

    for (const capt of captures) {
        if (capt.hasClass(opponent.name)) {
            possibleCaptures.push(capt);
        }
    }
}

function moveRook() {
    linearMove("horizontal");
    linearMove("vertical");
}

function moveKnight() {
    // used antiLoop() to preventn multiple negative values
    let x = check(currentPiece.x);
    let y = check(currentPiece.y);

    // figured all cases instead of doing a loop (see previous commits)
    temp = [
        atIndex(check(y - 2), check(x + 1)),
        atIndex(check(y - 2), check(x - 1)),
        atIndex(check(y + 2), check(x + 1)),
        atIndex(check(y + 2), check(x - 1)),
        atIndex(check(y - 1), check(x + 2)),
        atIndex(check(y + 1), check(x + 2)),
        atIndex(check(y - 1), check(x - 2)),
        atIndex(check(y + 1), check(x - 2)),
    ];

    for (const t of temp) {
        // capture
        if (t.hasClass(opponent.name) && !possibleCaptures.includes(t)) {
            possibleCaptures.push(t);
        }

        // move
        if (!t.hasClass(player.name) && t.length !== 0) {
            if (!possibleMoves.includes(t) && !possibleCaptures.includes(t))
                // to avoid duplication
                possibleMoves.push(t);
        }
    }
}

function moveBishop() {
    linearMove("diagonal1");
    linearMove("diagonal2");
}

function moveQueen() {
    linearMove("horizontal");
    linearMove("vertical");
    linearMove("diagonal1");
    linearMove("diagonal2");
}

function moveKing() {
    console.log("king");
    // todo
}

function linearMove(direction) {
    //initialisation
    let operation = increment;
    let operationMirror = decrement;

    for (let i = 0; i < 2; i++) {
        switch (direction) {
            case "vertical":
                y = check(operation(currentPiece.y));
                temp = atIndex(y, currentPiece.x);
                break;
            case "horizontal":
                y = check(operation(currentPiece.x));
                temp = atIndex(currentPiece.y, y);
                break;
            case "diagonal1":
                y = check(operation(currentPiece.y));
                x = check(operation(currentPiece.x));
                temp = atIndex(y, x);
                break;
            case "diagonal2":
                y = check(operation(currentPiece.y));
                x = check(operationMirror(currentPiece.x));
                temp = atIndex(y, x);
                break;
        }

        while (!temp.hasClass(player.name) && temp.length !== 0) {
            // capture
            if (temp.hasClass(opponent.name)) {
                possibleCaptures.push(temp);
                break;
            }

            // move
            possibleMoves.push(temp);

            y = check(operation(y));

            switch (direction) {
                case "vertical":
                    temp = atIndex(y, currentPiece.x);
                    break;
                case "horizontal":
                    temp = atIndex(currentPiece.y, y);
                    break;
                case "diagonal1":
                    x = check(operation(x));
                    temp = atIndex(y, x);
                    break;
                case "diagonal2":
                    x = check(operationMirror(x));
                    temp = atIndex(y, x);
                    break;
            }
        }

        operation = decrement;
        operationMirror = increment;
    }
}

function check(n) {
    // prevent negative numbers
    if (n < 0) {
        return undefined;
    } else return n;
}

const MOVES = {
    pawn: movePawn,
    rook: moveRook,
    knight: moveKnight,
    bishop: moveBishop,
    queen: moveQueen,
    king: moveKing,
};
