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
    let j = antiLoop(currentPiece.x + 2);
    let k = antiLoop(currentPiece.x - 2);
    let l = antiLoop(currentPiece.y + 1);
    let m = antiLoop(currentPiece.y - 1);

    // figured all cases instead of doing a loop
    temp = [
        atIndex(l, j),
        atIndex(m, j),
        atIndex(l, k),
        atIndex(m, k),
        atIndex(l + 1, k + 1),
        atIndex(l + 1, j - 1),
        atIndex(m - 1, k + 1),
        atIndex(m - 1, j - 1),
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
                j = antiLoop(operation(currentPiece.y));
                temp = atIndex(j, currentPiece.x);
                break;
            case "horizontal":
                j = antiLoop(operation(currentPiece.x));
                temp = atIndex(currentPiece.y, j);
                break;
            case "diagonal1":
                j = antiLoop(operation(currentPiece.y));
                k = antiLoop(operation(currentPiece.x));
                temp = atIndex(j, k);
                break;
            case "diagonal2":
                j = antiLoop(operation(currentPiece.y));
                k = antiLoop(operationMirror(currentPiece.x));
                temp = atIndex(j, k);
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

            switch (direction) {
                case "vertical":
                    j = antiLoop(operation(j));
                    temp = atIndex(j, currentPiece.x);
                    break;
                case "horizontal":
                    j = antiLoop(operation(j));
                    temp = atIndex(currentPiece.y, j);
                    break;
                case "diagonal1":
                    j = antiLoop(operation(j));
                    k = antiLoop(operation(k));
                    temp = atIndex(j, k);
                    break;
                case "diagonal2":
                    j = antiLoop(operation(j));
                    k = antiLoop(operationMirror(k));
                    temp = atIndex(j, k);
                    break;
            }
        }

        operation = decrement;
        operationMirror = increment;
    }
}

function antiLoop(n) {
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
