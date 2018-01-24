var xLength = 4,
    yLength = 4,
    width = 100,
    heigth = 100,
    photoLength = 50,
    spaceLength = 20,
    gameCells = {},
    totalLength = xLength * yLength,

	count = 0,
    lasterCell = null,
    cellStatus = false,
    step = 0,
    starNumber = 3;

initArray();

/**
* @description init array
* @returns
*/
function initArray() {
	var index = 0,
	    randomArray = shuffleArray();
	for (var i = 0; i < xLength; i ++) {
		gameCells[i] = {};
		for (var j = 0 ; j < yLength; j ++) {
			gameCells[i][j] = initCell(randomArray[index++] % (totalLength / 2));
		}
	}
	drawCells();
}

/**
* @description cell object
* @param {number} num
* @returns {object} cell object
*/
function initCell (num) {
	var cell = {
		number: num,
		status: 0 // four status, 0: close, 1: first open, 2:second open, 3:success
	}
	return cell;
}

/**
* @description use shuffle to get random array
* @returns {object} random array
*/
function shuffleArray() {
	var randomArray = {}, randomIndex, temp;
	for (var i = 0; i < totalLength; i ++) {
		randomArray[i] = i;
	}
	//var randomArray = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16};
	for (var i = totalLength - 1; i >= 0; i --) {
		randomIndex = Math.floor(Math.random() * (i + 1));
		temp = randomArray[randomIndex];
		randomArray[randomIndex] = randomArray[i];
		randomArray[i] = temp;
	}
	return randomArray;
}

/**
* @description draw the table cells and render photos
*/
function drawCells() {
	var mainContainer = document.getElementById('main-container'),
	    mainCells = document.getElementsByClassName('main-cell'),
	    length = mainCells.length;
	for(var i = 0; i < length; i++) {
		mainContainer.removeChild(mainCells[0]);
	}

	for (var i = 0; i < xLength; i ++) {
		for (var j = 0; j < yLength; j ++) {
			//main cell
			var mainCell = createCell(i, j);
			mainCell.id = 'main-cell-' + i + '-' + j;
			mainCell.className = 'main-cell';
			mainCell.style.top = getPosition(i) + 'px';
			mainCell.style.left = getPosition(j) + 'px';
			mainCell.addEventListener( 'click', function(){
        		clickAction(this);
      		}, false);

			//border cell
			var cell = createCell(i, j);
			cell.id = 'border-cell-' + i + '-' + j;
			cell.className = 'border-cell';
			mainCell.appendChild(cell);

			//photo cell
			var photoCell = createCell(i, j);
			photoCell.id = 'photo-cell-' + i + '-' + j;
			photoCell.className = 'photo-cell';
			var imageCell = createImage(gameCells[i][j]);
			photoCell.appendChild(imageCell);
			mainCell.appendChild(photoCell);

			mainContainer.appendChild(mainCell);
		}
	}
	var refresh = document.getElementById('refresh');
	refresh.addEventListener('click', function(){
        refreshAction(this);
    }, false);

    var playAgain = document.getElementById('play-again');
	playAgain.addEventListener('click', function(){
        refreshAction(this);
    }, false);
}

function createCell() {
	var borderCell = document.createElement('div');
	borderCell.style.width = width + 'px';
	borderCell.style.height = heigth + 'px';
	return borderCell;
}

function createImage(mapCell) {
	var imageCell = document.createElement('img');
	imageCell.className = 'photo';
	imageCell.src = 'image/' + mapCell.number + '.png';
	imageCell.alt = mapCell.number;
	imageCell.style.width = photoLength + 'px';
	imageCell.style.height = photoLength + 'px';
	return imageCell;
}

/**
* @description deal with the click action,show the photo
* @param {object} the border object
* @returns
*/
function clickAction(border) {

	var borderX = getIndex(border.id, true),
		borderY = getIndex(border.id, false),
		gameCell = gameCells[borderX][borderY];
    if (gameCell.status === 3) return;

	if (!lasterCell) {
		gameCell.status = 1;
		cellStatus = true;
		firstOpenAnimation(border);
		lasterCell = border;
		step ++;
		freshMoves(step);
	} else {
		var lasterX = getIndex(lasterCell.id, true),
			lasterY = getIndex(lasterCell.id, false),
			lasterGameCell = gameCells[lasterX][lasterY];

		if (lasterGameCell.status === 2 || lasterGameCell.status === 3) {
			gameCell.status = 1;
			firstOpenAnimation(border);
			step ++;
			freshMoves(step);
		} else {
			if (border === lasterCell) return;
			if (lasterGameCell.number === gameCell.number) {
				count++;
				gameCell.status = 3;
				lasterGameCell.status = 3;
				rightAnimation(border, lasterCell);
			} else { 	
				gameCell.status = 2;
				wrongAnimation(border, lasterCell);	
			}
			step ++;
			freshMoves(step);
	    }
	    lasterCell = border;

	}	
}

/**
* @description refresh the moves and the style of stars
* @param {int} the number of moves
* @returns
*/
function freshMoves(step) {
	var star, move = document.getElementById('move');
    move.innerHTML = step;
    if (step === 24) {
 		star = document.getElementById('star-'+ 3);
 		star.className = 'fa fa-star-o';
 		starNumber--;
    } else if (step === 32) {
		star = document.getElementById('star-'+ 2);
 		star.className = 'fa fa-star-o';
 		starNumber--;
    } else if (step === 40){
    	star = document.getElementById('star-'+ 1);
 		star.className = 'fa fa-star-o';
 		starNumber--;
    }
}

/**
* @description refresh action to reset some data and restart the game
* @param {object} border object
* @returns
*/
function refreshAction(border) {
	step = 0;
	count = 0;
	starNumber = 3;
	lasterCell = null;
	cellStatus = false;
	
	var move = document.getElementById('move');
    move.innerHTML = step;
	var success = document.getElementById('success-container');
	success.style.display = 'none';
	var main = document.getElementById('main-container');
	main.style.display = 'block';
	var body = document.getElementById('head-container');
	body.style.display = 'block';
	
	var stars = document.getElementsByClassName('fa-star-o'),
		starsLength = stars.length;
	for(var i = 0; i < starsLength; i++) {
		stars[0].className = 'fa fa-star';
	}
	initArray();
}

/**
* @description when the sucess,show the success container
* @param
* @returns
*/
function successful() {
	var stepNum = document.getElementById('step');
	stepNum.innerHTML = step;
	var starNum = document.getElementById('star-num');
	starNum.innerHTML = starNumber;
	var success = document.getElementById('success-container');
	success.style.display = 'block';
	var main = document.getElementById('main-container');
	main.style.display = 'none';
	var body = document.getElementById('head-container');
	body.style.display = 'none';
}

function firstOpenAnimation(border) {
	border.children[1].style.background = '#14c2e1';
	addClass(border, 'flipped');
}

function rightAnimation(border, lasterCell) {
	
	lasterCell.children[1].style.background = '#18d8bb';
	border.children[1].style.background = '#18d8bb';
	lasterCell.children[0].style.opacity = 0;
	border.children[0].style.opacity = 0;
	addClass(border, 'flipped');
	
    addClass(border, 'right-animation');
	addClass(lasterCell, 'right-animation');
	setTimeout(function() {
		if (count === 8) {
			successful();
		}
	},  100);	
}

function wrongAnimation(border, lasterCell) {
	
	lasterCell.children[0].style.opacity = 0;
    border.children[0].style.opacity = 0;
    lasterCell.children[1].style.background = '#eb4d3f';
    border.children[1].style.background = '#eb4d3f';
    addClass(border, 'flipped');
    addClass(border, 'wrong-aniamtion');
    addClass(lasterCell, ' wrong-aniamtion');	

	setTimeout(function() {
		lasterCell.children[0].style.opacity = 1;
	    border.children[0].style.opacity = 1;
		removeClass(lasterCell, 'wrong-aniamtion');
		removeClass(border, 'wrong-aniamtion');
		removeClass(lasterCell, 'flipped');
		removeClass(border, 'flipped');
	}, 500);
}

/**
* @description get the cell position
* @param {number} index
* @returns {number} the position data
*/
function getPosition(index) {
	return index * width + (index + 1) * spaceLength;
}

/**
* @description check the class name existed
* @param {objec} DOM object
* @param {string} the string of calss name
* @returns {bool} true or false
*/
function hasClass(obj, className) {
	return obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

/**
* @description add a class name for DOM object
* @param {objec} border object
* @param {string} the string of calss name
* @returns {string} the new class name
*/
function addClass(obj, className) {
	if (!hasClass(obj, className)) {
		return obj.className += ' ' +className;
	}
}

/**
* @description remove a class name for DOM object
* @param {objec} border object
* @param {string} the string of calss name
* @returns {string} the new class name
*/
function removeClass(obj, className) {
	if (hasClass(obj, className)) {
		var regClassName = new RegExp('(\\s|^)' + className + '(\\s|$)');
		obj.className = obj.className.replace(regClassName, ' ');
		return obj.className;
	}
}

/**
* @description get the index by the class name
* @param {string} the class name
* @param {bool} if isFirst is true take the first number,else second number
* @returns {number} the index
*/
function getIndex(str, isFirst) {
	var strArray = str.split('-');
	return isFirst ? strArray[2] : strArray[3];
}
