'use strict';

var gField;
var gStartTime;
var gTimerInterval;
var gIsMenuShown;

const MINE = 'MINE';

var gState;
var gLevel;
var gLevels = [
    { size: 4, mines: 2, name: 'begginer' },
    { size: 6, mines: 6, name: 'moderate' },
    { size: 8, mines: 15, name: 'hard' },
    { size: 10, mines: 30, name: 'expert' }
];


function init() {
    //reset timer
    clearInterval(gTimerInterval);
    setDiff();

    gState = {
        isGameOn: true,
        isFirstClick: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };

    //empty field
    gField = buildField();
    renderField(gField);

    //visual
    document.querySelector('.difficulty').style.display = 'none';
    gIsMenuShown = false;
    displayBestTime();
    document.querySelector('.timer').innerHTML = 0;
    document.querySelector('.marked').innerHTML = 0;
    document.querySelector('.smiley').innerHTML = '🙄';
}

//builds an empty mine field according to diff level
function buildField() {

    var field = new Array(gLevel.size);
    for (var i = 0; i < gLevel.size; i++) {
        field[i] = new Array(gLevel.size);

    }
    return field;
}

function cellClicked(elCell, ev) {

    if (!gState.isGameOn) return;
    if (ev.button === 2) return;

    //set location object for clicked cell
    var cell = elCell.classList[0].split('-');
    var location = { i: cell[1], j: cell[2] };

    //on first click
    if (gState.isFirstClick) onFirstClick(location, gField);

    //if already shown
    if (gField[location.i][location.j].isShown) return;

    //update elCell to new board
    var idx = '.cell-' + location.i + '-' + location.j;
    elCell = document.querySelector(idx);

    //color cell
    elCell.style.backgroundColor = 'rgb(238, 143, 34)';

    //what is the cell value?
    switch (gField[cell[1]][cell[2]].type) {
        case MINE:
            elCell.style.backgroundColor = 'red';
            displayLost();
            break;

        case 0:
            expandShown(elCell, gField);
            break;

        default:
            //show cells value
            elCell.innerText = gField[cell[1]][cell[2]].type;
            //update model to isShown true
            gField[cell[1]][cell[2]].isShown = true;
            gState.shownCount++;
            break;

    }
    checkGameWon();
}

function cellMarked(elCell) {

    if (!gState.isGameOn) return;
    if (gState.isFirstClick) return

    //breaking cell to array to specify location
    var cell = elCell.classList[0].split('-');

    //if already shown
    if (gField[cell[1]][cell[2]].isShown) return;

    //creating marked element
    var marked = document.createElement('img');
    marked.src = 'img/rsz_marked.png';

    //mark cell if not already marked
    var content = elCell.innerHTML;
    if (content === '') {
        elCell.appendChild(marked);
        //update model accordingly
        gField[cell[1]][cell[2]].isMarked = true;
        gState.markedCount++;
        document.querySelector('.marked').innerHTML = gState.markedCount;
    }
    //second click removes mark
    else {
        elCell.innerHTML = '';
        //update model accordingly
        gField[cell[1]][cell[2]].isMarked = false;
        gState.markedCount--;
        document.querySelector('.marked').innerHTML = gState.markedCount;
    }

    //check if game is over
    checkGameWon();

    //prevent menu to open
    return false;
}

//on first click actions
function onFirstClick(location, gField) {

    //take start time
    gStartTime = new Date();
    gTimerInterval = setInterval(timer, 1000);

    //build board according to first cell clicked
    gField = fillField(location, gField);
    renderField();

    gState.isFirstClick = false;

}








