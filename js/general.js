'use strict';


//fill field according to first click & gfield
// var test is only for console display
function fillField(firstCell, field) {

    //planting mines
    for (var i = 0; i < gLevel.mines; i++) {
        var row = parseInt(Math.random() * gLevel.size);
        var col = parseInt(Math.random() * gLevel.size);
        //if first click location
        if (+firstCell.i === row && +firstCell.j === col) {
            i -= 1;
            continue;
        }
        //if already a mine 
        if (field[row][col]) {
            i -= 1;
        } else {
            field[row][col] = { type: MINE, isShown: false, isMarked: false };
        }
    }

    //setting number in rest of field
    var test = [];
    for (i = 0; i < gLevel.size; i++) {
        test[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            if (!field[i][j]) {
                var location = { i: i, j: j };
                field[i][j] = {
                    type: getMinesNegsCount(location, field),
                    isShown: false,
                    isMarked: false
                };
            }
            test[i][j] = field[i][j].type;
        }
    }

    // console.table(field);
    console.table(test);
    return field;
}

//gets location returns number of mines surronding
function getMinesNegsCount(location, field) {
    var row = location.i;
    var col = location.j;
    var neighborCount = 0;

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gLevel.size - 1) continue;

        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j > gLevel.size - 1) continue;
            if (j === col && i === row) continue;

            //add to count if the neighbor is a mine
            if (field[i][j] && field[i][j].type === MINE) neighborCount++;
        }
    }
    return neighborCount;
}

//when empty cell pressed - expands till reached number cells 
function expandShown(elCell, field) {
    var cell = elCell.classList[0].split('-');

    var expandCells = [];

    //cell's idx
    var row = +cell[1];
    var col = +cell[2];

    //going through the area around given elCell location
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gLevel.size - 1) continue;

        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gLevel.size - 1) continue;
            //is already shown?
            if (field[i][j].isShown) continue;

            //element of near cell
            var idx = '.cell-' + i + '-' + j;
            var elNearCell = document.querySelector(idx);

            if (field[i][j].type !== 0) {
                //update dom
                elNearCell.style.backgroundColor = 'rgb(238, 143, 34)';
                elNearCell.innerHTML = field[i][j].type;
                //update model
                gField[i][j].isShown = true;
                gState.shownCount++;

            } else {
                //update dom
                elNearCell.style.backgroundColor = 'rgb(238, 143, 34)';
                //update model
                gField[i][j].isShown = true;
                gState.shownCount++;
                //array of empty cells
                expandCells.push(elNearCell);
            }
        }
    }

    // continue expanding
    var expandCount = expandCells.length;
    for (i = 0; i < expandCount; i++) {
        expandShown(expandCells[i], field);
    }
    return;
}

//checks if all mines are marked and the rest of cells are shown =game is won
function checkGameWon() {

    //check entire array
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            //is it a mine?
            if (gField[i][j].type === MINE) {
                //is it marked? if not return false
                if (!gField[i][j].isMarked) return;
            } else {
                //is it shown? if not return false
                if (!gField[i][j].isShown) return;
            }
        }
    }
    //game is finished- update and display 
    clearInterval(gTimerInterval);
    document.querySelector('.smiley').innerHTML = '✌🤓';
    var time = document.querySelector('.timer').innerHTML;
    storeBestTime(time);
}

function timer() {
    if (gStartTime) {
        var timeStr = '';
        var second = new Date();
        second = (second - gStartTime) / 1000;
        second = parseInt(second);
        document.querySelector('.timer').innerHTML = second;
        gState.secsPassed = second;
    }
}

function storeBestTime(time) {

    switch (gLevel.name) {
        case 'begginer':
            // if first time played
            if (!localStorage.getItem("bestTimeB")) {
                localStorage.setItem('bestTimeB', time);
            } else {
                //check if faster
                var bestStored = localStorage.getItem("bestTimeB");
                if (time < +bestStored) {
                    localStorage.setItem('bestTimeB', time);
                }
            }
            break;

        case 'moderate':
            // if first time played
            if (!localStorage.getItem("bestTimeM")) {
                localStorage.setItem('bestTimeM', time);
            } else {
                //check if faster
                var bestStored = localStorage.getItem("bestTimeM");
                if (time < +bestStored) {
                    localStorage.setItem('bestTimeM', time);
                }
            }
            break;

        case 'hard':
            // if first time played
            if (!localStorage.getItem("bestTimeH")) {
                localStorage.setItem('bestTimeH', time);
            } else {
                //check if faster
                var bestStored = localStorage.getItem("bestTimeH");
                if (time < +bestStored) {
                    localStorage.setItem('bestTimeH', time);
                }
            }
            break;

        case 'expert':
            // if first time played
            if (!localStorage.getItem("bestTimeE")) {
                localStorage.setItem('bestTimeE', time);
            } else {
                //check if faster
                var bestStored = localStorage.getItem("bestTimeE");
                if (time < +bestStored) {
                    localStorage.setItem('bestTimeE', time);
                }
            }
            break;
    }
}

//set difficulty according to select menu value
function setDiff() {
    var diffValue = document.querySelector('select')
    var diffIdx = diffValue.options[diffValue.selectedIndex].value
    gLevel = gLevels[diffIdx];
}
