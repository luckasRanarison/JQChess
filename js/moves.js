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
        player.operation(currentPiece.y, 1),
        currentPiece.x + 1
    );
    let capture2 = atIndex(
        player.operation(currentPiece.y, 1),
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
    linearMove("x");
    linearMove("y");
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
    linearMove("x");
    linearMove("y");
    // todo
}

function moveKing() {
    console.log("king");
    // todo
}

function linearMove(static) {
    // "x" as parameter for horizontal moves and "y" for vertical ones
    operation = addition;

    for (let i = 0; i < 2; i++) {
        switch (static) {
            case "x":
                j = operation(currentPiece.y, 1);
                temp = atIndex(j, currentPiece.x);
                break;
            case "y":
                j = operation(currentPiece.x, 1);
                temp = atIndex(currentPiece.y, j);
                break;
        }

        while (!temp.hasClass(player.name) && temp.length !== 0) {
            //prevent query loop
            if (j < 0) break;

            // capture
            if (temp.hasClass(opponent.name)) {
                possibleCaptures.push(temp);
                break;
            }

            // move
            possibleMoves.push(temp);

            j = operation(j, 1);
            switch (static) {
                case "x":
                    temp = atIndex(j, currentPiece.x);
                    break;
                case "y":
                    temp = atIndex(currentPiece.y, j);
                    break;
            }
        }

        operation = substraction;
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
