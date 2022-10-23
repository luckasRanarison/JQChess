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
    // y axis
    // let operation = addition;
    // for (let i = 0; i < 2; i++) {
    //     let j = operation(y, 1);
    //     let temp = atIndex(j, x);
    //     if (temp.length !== 0 && j > 0) {
    //         while (!temp.hasClass(player.name)) {
    //             if (temp.hasClass(opponent.name)) {
    //                 possibleCaptures.push(temp);
    //                 temp.on("click", move);
    //                 break;
    //             }
    //             possibleMoves.push(temp);
    //             temp.on("click", move);
    //             j = operation(j, 1);
    //             temp = atIndex(j, x);
    //             if (temp.length === 0) break;
    //         }
    //     }
    //     operation = substraction;
    // }
    // x axis
    // for (let i = 0; i < 2; i++) {
    //     let j = operation(x, 1);
    //     let temp = atIndex(y, j);
    //     if (temp.length !== 0 && j > 0) {
    //         while (!temp.hasClass(player.name)) {
    //             if (temp.hasClass(opponent.name)) {
    //                 possibleCaptures.push(temp);
    //                 temp.on("click", move);
    //                 break;
    //             }
    //             possibleMoves.push(temp);
    //             temp.on("click", move);
    //             j = operation(j, 1);
    //             temp = atIndex(y, j);
    //             if (temp.length === 0) break;
    //         }
    //     }
    //     operation = addition;
    // }
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

const MOVES = {
    pawn: movePawn,
    rook: moveRook,
    knight: moveKnight,
    bishop: moveBishop,
    queen: moveQueen,
    king: moveKing,
};
