'use strict';


function renderField() {

    var elField = document.querySelector('.field');
    var html = '';

    for (var i = 0; i < gLevel.size; i++) {
        html += '<tr> \n';
        for (var j = 0; j < gLevel.size; j++) {
            var cellClass = 'cell-' + i + '-' + j;

            html += `\t <td class="${cellClass}" oncontextmenu="cellMarked(this);return false"
            onmousedown="cellClicked(this, event)"></td>\n`;
        }
        html += '</tr> \n';
    }
    elField.innerHTML = html;
}

function displayBestTime() {
    var str;
    var html = 'Best Time:';
    document.querySelector('h2').innerText = html;

    switch (gLevel.name) {
        case 'begginer':
            str = localStorage.getItem("bestTimeB");
            break;

        case 'moderate':
            str = localStorage.getItem("bestTimeM");
            break;

        case 'hard':
            str = localStorage.getItem("bestTimeH");
            break;

        case 'expert':
            str = localStorage.getItem("bestTimeE");
            break;

    }

    if (str === null) {
        return;
    } else {
        document.querySelector('h2').innerText = html + '\n' + str;

    }
}

function displayLost() {
    //show all bombs
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {

            if (gField[i][j].isMarked) continue;
            if (gField[i][j].type === MINE) {
                var idx = '.cell-' + i + '-' + j;
                var elCell = document.querySelector(idx);
                var MINE_IMG = document.createElement('img');
                MINE_IMG.src = 'img/rsz_bomb.png';
                elCell.appendChild(MINE_IMG);
            }
        }
    }
    //update & display
    document.querySelector('.smiley').innerHTML = '🤕';
    clearInterval(gTimerInterval);
    gState.isGameOn = false;

}

function showDiffMenu() {

    if (gIsMenuShown) {
        document.querySelector('.difficulty').style.display = 'none';
    } else {
        document.querySelector('.difficulty').style.display = 'block';
    }
    gIsMenuShown = !gIsMenuShown;
}

