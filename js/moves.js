function movePawn() {
    // moves
    currentPiece.y === player.frontLine ? (max = 2) : (max = 1);

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
    let temp = [];
    let j, k, l, m;
    let coord1 = currentPiece.x;
    let coord2 = currentPiece.y;
    let operation = increment;
    let operationMirror = decrement;

    // loop twice to get all 8 possibles cases
    for (let i = 0; i < 2; i++) {
        j = operation(coord1, 2);
        k = operationMirror(coord1, 2);
        l = operation(coord2);
        m = operationMirror(coord2);

        // verify if the number is positive to prevent loop
        if (i === 0) {
            if (l > -1 && m > -1) {
                if (j > -1) temp.push(atIndex(l, j), atIndex(m, j));
                if (k > -1) temp.push(atIndex(l, k), atIndex(m, k));
            }
        } else {
            // the second iteration uses the opposite coordinates of the first one
            if (l > -1 && m > -1) {
                if (j > -1) temp.push(atIndex(j, l), atIndex(j, m));
                if (k > -1) temp.push(atIndex(k, l), atIndex(k, m));
            }
        }

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

        // swap values
        coord1 = currentPiece.y;
        coord2 = currentPiece.x;
        operation = decrement;
        operationMirror = increment;
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
    let j, k;
    let operation = increment;
    let operationMirror = decrement;

    for (let i = 0; i < 2; i++) {
        switch (direction) {
            case "vertical":
                j = operation(currentPiece.y);
                temp = atIndex(j, currentPiece.x);
                break;
            case "horizontal":
                j = operation(currentPiece.x);
                temp = atIndex(currentPiece.y, j);
                break;
            case "diagonal1":
                j = operation(currentPiece.y);
                k = operation(currentPiece.x);
                temp = atIndex(j, k);
                break;
            case "diagonal2":
                j = operation(currentPiece.y);
                k = operationMirror(currentPiece.x);
                temp = atIndex(j, k);
                break;
        }

        while (!temp.hasClass(player.name) && temp.length !== 0) {
            //prevent query loop
            if (j < 0 || k < 0) break;

            // capture
            if (temp.hasClass(opponent.name)) {
                possibleCaptures.push(temp);
                break;
            }

            // move
            possibleMoves.push(temp);

            switch (direction) {
                case "vertical":
                    j = operation(j);
                    temp = atIndex(j, currentPiece.x);
                    break;
                case "horizontal":
                    j = operation(j);
                    temp = atIndex(currentPiece.y, j);
                    break;
                case "diagonal1":
                    j = operation(j);
                    k = operation(k);
                    temp = atIndex(j, k);
                    break;
                case "diagonal2":
                    j = operation(j);
                    k = operationMirror(k);
                    temp = atIndex(j, k);
                    break;
            }
        }

        operation = decrement;
        operationMirror = increment;
    }
}

const MOVES = {
    pawn: movePawn,
    rook: moveRook,
    knight: moveKnight,
    bishop: moveBishop,
    queen: moveQueen,
    king: moveKing,
};
