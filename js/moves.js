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
    linearMove("horizontal");
    linearMove("vertical");
}

function moveKnight() {
    console.log("knight");
    // todo
}

function moveBishop() {
    linearMove("oblique1");
    linearMove("oblique2");
}

function moveQueen() {
    linearMove("horizontal");
    linearMove("vertical");
    linearMove("oblique1");
    linearMove("oblique2");
}

function moveKing() {
    console.log("king");
    // todo
}

function linearMove(direction) {
    //initialisation
    let j, k;
    operation = addition;
    operationMirror = substraction;

    for (let i = 0; i < 2; i++) {
        switch (direction) {
            case "horizontal":
                j = operation(currentPiece.y, 1);
                temp = atIndex(j, currentPiece.x);
                break;
            case "vertical":
                j = operation(currentPiece.x, 1);
                temp = atIndex(currentPiece.y, j);
                break;
            case "oblique1":
                j = operation(currentPiece.y, 1);
                k = operation(currentPiece.x, 1);
                temp = atIndex(j, k);
                break;
            case "oblique2":
                j = operation(currentPiece.y, 1);
                k = operationMirror(currentPiece.x, 1);
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
                case "horizontal":
                    j = operation(j, 1);
                    temp = atIndex(j, currentPiece.x);
                    break;
                case "vertical":
                    j = operation(j, 1);
                    temp = atIndex(currentPiece.y, j);
                    break;
                case "oblique1":
                    j = operation(j, 1);
                    k = operation(k, 1);
                    temp = atIndex(j, k);
                    break;
                case "oblique2":
                    j = operation(j, 1);
                    k = operationMirror(k, 1);
                    temp = atIndex(j, k);
                    break;
            }
        }

        operation = substraction;
        operationMirror = addition;
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
