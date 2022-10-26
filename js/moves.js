function movePawn(target) {
    // moves
    target.y === player.frontLine ? (max = 2) : (max = 1);

    // pawn move differently for the two players, that's why each player have his own method
    for (let i = 1; i <= max; i++) {
        let temp = atIndex(player.operation(target.y, i), target.x);

        if (temp.hasClass("white") || temp.hasClass("black")) {
            break;
        }
        target.possibleMoves.push(temp);
    }

    // capture
    let capture1 = atIndex(player.operation(target.y), check(target.x + 1));
    let capture2 = atIndex(player.operation(target.y), check(target.x - 1));

    let captures = [capture1, capture2];

    for (const capt of captures) {
        if (capt.hasClass(opponent.name)) {
            target.possibleCaptures.push(capt);
        }
    }
}

function moveRook(target) {
    linearMove(target, "horizontal");
    linearMove(target, "vertical");
}

function moveKnight(target) {
    let temp = [];
    let x = target.x;
    let y = target.y;
    let operation = increment;

    // loop twice to get all 8 possible moves
    for (let i = 0; i < 2; i++) {
        temp.push(
            // used check() to preventn multiple negative values
            atIndex(check(operation(y, 2)), check(x + 1)),
            atIndex(check(operation(y, 2)), check(x - 1)),
            atIndex(check(y - 1), check(operation(x, 2))),
            atIndex(check(y + 1), check(operation(x, 2)))
        );

        operation = decrement;
    }

    for (const t of temp) {
        // capture
        if (t.hasClass(opponent.name) && !target.possibleCaptures.includes(t)) {
            target.possibleCaptures.push(t);
        }

        // move
        if (!t.hasClass(player.name) && t.length !== 0) {
            if (
                !target.possibleMoves.includes(t) &&
                !target.possibleCaptures.includes(t)
            )
                // to avoid duplication
                target.possibleMoves.push(t);
        }
    }
}

function moveBishop(target) {
    linearMove(target, "diagonal1");
    linearMove(target, "diagonal2");
}

function moveQueen(target) {
    linearMove(target, "horizontal");
    linearMove(target, "vertical");
    linearMove(target, "diagonal1");
    linearMove(target, "diagonal2");
}

function moveKing(target, danger = true) {
    let temp = [];
    let x = target.x;
    let y = target.y;
    let operation = increment;

    // loop twice to get all 8 possible moves
    for (let i = 0; i < 2; i++) {
        temp.push(
            atIndex(check(operation(y)), check(x - 1)),
            atIndex(check(operation(y)), check(x)),
            atIndex(check(operation(y)), check(x + 1)),
            atIndex(check(y), check(operation(x)))
        );

        operation = decrement;
    }

    for (const t of temp) {
        let invalidMove = false;

        // capture
        if (t.hasClass(opponent.name)) {
            let pieceClass = t[0].classList.value;

            // simulate the move
            t.removeClass();

            threatCheck();

            for (const danger of player.dangerCases) {
                if (danger.index("td") === t.index("td")) {
                    invalidMove = true;
                    break;
                }
            }

            // replace the piece
            t.addClass(pieceClass);

            // recheck
            threatCheck();

            if (!invalidMove) target.possibleCaptures.push(t);
            continue;
        }

        // move
        if (!t.hasClass(player.name) && t.length !== 0) {
            // array.includes didn't work so this is a workaround

            if (danger) {
                for (const danger of player.dangerCases) {
                    if (danger.index("td") === t.index("td")) {
                        invalidMove = true;
                        break;
                    }
                }
            }

            if (!invalidMove) target.possibleMoves.push(t);
        }
    }
}

function linearMove(target, direction) {
    //initialisation
    let temp = [];
    let operation = increment;
    let operationMirror = decrement;

    for (let i = 0; i < 2; i++) {
        switch (direction) {
            case "vertical":
                y = check(operation(target.y));
                temp = atIndex(y, target.x);
                break;
            case "horizontal":
                y = check(operation(target.x));
                temp = atIndex(target.y, y);
                break;
            case "diagonal1":
                y = check(operation(target.y));
                x = check(operation(target.x));
                temp = atIndex(y, x);
                break;
            case "diagonal2":
                y = check(operation(target.y));
                x = check(operationMirror(target.x));
                temp = atIndex(y, x);
                break;
        }

        while (!temp.hasClass(player.name) && temp.length !== 0) {
            // capture
            if (temp.hasClass(opponent.name)) {
                target.possibleCaptures.push(temp);
                break;
            }

            // move
            target.possibleMoves.push(temp);

            y = check(operation(y));

            switch (direction) {
                case "vertical":
                    temp = atIndex(y, target.x);
                    break;
                case "horizontal":
                    temp = atIndex(target.y, y);
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

        [operation, operationMirror] = [decrement, increment];
    }
}

function check(n) {
    // prevent negative numbers and query loop
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
