var xLength = 4;
var yLength = 4;
var width = 100;
var heigth = 100;
var photoLength = 50;
var spaceLength = 20;
var gameCells = {};
var totalLength = xLength * yLength;

var count = 0;
var lasterCell = null;
var cellStatus = false;
var step = 0;
var starNumber = 3;

initArray();
function initArray() {
	var index = 0;
	var randomArray = shuffleArray();
	for (var i = 0; i < xLength; i ++) {
		gameCells[i] = {};
		for (var j = 0; j < yLength; j ++) {
			gameCells[i][j] = initCell(randomArray[index++] % (totalLength / 2));
		}
	}
	console.info(gameCells);
	drawCells();
}

function initCell (num) {
	var cell = {
		number: num,
		status: 0 // four status
	}
	return cell;
}

function drawCells() {
	var mainContainer = document.getElementById('main');
	var mainCells = document.getElementsByClassName('mainCell');
	var length = mainCells.length;
	for(var i = 0; i < length; i++) {
		mainContainer.removeChild(mainCells[0]);
	}

	for (var i = 0; i < xLength; i ++) {
		for (var j = 0; j < yLength; j ++) {
			//main cell
			var mainCell = createCell(i, j);
			mainCell.id = 'mainCell_' + i + '_' + j;
			mainCell.className = 'mainCell';
			mainCell.style.top = getPosition(i) + 'px';
			mainCell.style.left = getPosition(j) + 'px';
			mainCell.addEventListener( 'click', function(){
        		clickAction(this);
      		}, false);

			//border cell
			var cell = createCell(i, j);
			cell.id = 'borderCell_' + i + '_' + j;
			cell.className = 'borderCell';
			mainCell.appendChild(cell);

			//photo cell
			var photoCell = createCell(i, j);
			photoCell.id = 'photoCell_' + i + '_' + j;
			photoCell.className = 'photoCell';
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

    var playAgain = document.getElementById('playAgain');
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

function refreshAction(border) {
	count = 0;
	lasterCell = null;
	cellStatus = false;
	step = 0;
	starNumber = 3;
	var stepNum = document.getElementById('move');
	stepNum.innerHTML = step;
	var move = document.getElementById('move');
    move.innerHTML = step;
	var success = document.getElementById('successContainer');
	success.style.display = 'none';
	var main = document.getElementById('main');
	main.style.display = 'block';
	var body = document.getElementById('headContainer');
	body.style.display = 'block';
	
	var stars = document.getElementsByClassName('fa-star-o');
	var starsLength = stars.length;
	for(var i = 0; i < starsLength; i++) {
		stars[0].className = 'fa fa-star';
	}
	initArray();
}

function clickAction(border) {

	var borderX = getIndex(border.id, true);
	var borderY = getIndex(border.id, false);
	var gameCell = gameCells[borderX][borderY];
    if (gameCell.status === 3) return;

	if (!lasterCell) {
		gameCell.status = 1;
		//gameCell.status = 1;
		cellStatus = true;
		firstOpenAnimation(border);
		lasterCell = border;
		step ++;
		freshMoves(step);
	} else {
		var lasterX = getIndex(lasterCell.id, true);
		var lasterY = getIndex(lasterCell.id, false);
		var lasterGameCell = gameCells[lasterX][lasterY];

		if (lasterGameCell.status === 2 || lasterGameCell.status === 3) {
			gameCell.status = 1;
			//lasterGameCell.status = 1;
			//cellStatus = true;
			firstOpenAnimation(border);
			step ++;
			freshMoves(step);
		} else {
			if (border === lasterCell) return;
			if (lasterGameCell.number === gameCell.number) {
				count++;
				gameCell.status = 3;
				lasterGameCell.status = 3;
				//cellStatus = false;
				rightAnimation(border, lasterCell);
			} else { 	
				//gameCells[lasterX][lasterY].status = 2;
				gameCell.status = 2;
				//cellStatus = false;
				wrongAnimation(border, lasterCell);	
			}
			step ++;
			freshMoves(step);
	    }
	    lasterCell = border;

	}	
}

function freshMoves(step) {
	var move = document.getElementById('move');
    move.innerHTML = step;
    if (step === 17) {
 		var star = document.getElementById('star_'+ 3);
 		star.className = 'fa fa-star-o';
 		starNumber--;
    } else if (step === 33) {
		var star = document.getElementById('star_'+ 2);
 		star.className = 'fa fa-star-o';
 		starNumber--;
    } else if (step === 65){
    	var star = document.getElementById('star_'+ 1);
 		star.className = 'fa fa-star-o';
 		starNumber--;
    }
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
	addClass(border, ' flipped');
	
    addClass(border, ' right-animation');
	addClass(lasterCell, ' right-animation');
	setTimeout(function() {
		if (count === 8) {
			//alert('success');
			successful();
		}
	},  100);	
}

function successful() {
	var stepNum = document.getElementById('step');
	stepNum.innerHTML = step;
	var starNum = document.getElementById('starNum');
	starNum.innerHTML = starNumber;
	var success = document.getElementById('successContainer');
	success.style.display = 'block';
	var main = document.getElementById('main');
	main.style.display = 'none';
	var body = document.getElementById('headContainer');
	body.style.display = 'none';
	setTimeout(function(){
		var spinner = document.getElementById('spinner');
		removeClass(spinner, 'fa-pulse');
	}, 300);
}

function wrongAnimation(border, lasterCell) {
	
	lasterCell.children[0].style.opacity = 0;
    border.children[0].style.opacity = 0;
    lasterCell.children[1].style.background = '#eb4d3f';
    border.children[1].style.background = '#eb4d3f';
    addClass(border, ' flipped');
    addClass(border, ' wrong-aniamtion');
    addClass(lasterCell, ' wrong-aniamtion');	

	setTimeout(function() {
		lasterCell.children[0].style.opacity = 1;
	    border.children[0].style.opacity = 1;
		removeClass(lasterCell, 'wrong-aniamtion');
		removeClass(border, 'wrong-aniamtion');
		removeClass(lasterCell, 'flipped');
		removeClass(border, ' flipped');
	}, 500);
}

//shuffle
function shuffleArray() {
	var randomArray = {};
	for (var i = 0; i < totalLength; i ++) {
		randomArray[i] = i;
	}
	//var randomArray = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16};
	for (var i = totalLength - 1; i >= 0; i --) {
		var randomIndex = Math.floor(Math.random() * (i + 1));
		var temp = randomArray[randomIndex];
		randomArray[randomIndex] = randomArray[i];
		randomArray[i] = temp;
	}
	return randomArray;
}

function getPosition(index) {
	return index * width + (index + 1) * spaceLength;
}


//////
function hasClass(obj, className) {
	return obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(obj, className) {
	if (!hasClass(obj, className)) {
		return obj.className += ' ' +className;
	}
}
function removeClass(obj, className) {
	if (hasClass(obj, className)) {
		var regClassName = new RegExp('(\\s|^)' + className + '(\\s|$)');
		obj.className = obj.className.replace(regClassName, ' ');
		return obj.className;
	}
}
function toggleClass(obj, className) {
	if (hasClass(obj, className)) {
		removeClass(obj, className);
	} else {
		addClass(obj, className);
	}
}

function getIndex(str, isFirst) {
	var strArray = str.split('_');
	return isFirst ? strArray[1] : strArray[2];
}

function getNumber(str) {
	var strArray = str.split('_');
	return gameCells[strArray[1]][strArray[2]];
}