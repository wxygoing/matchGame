/*jshint esversion: 6 */
(function() {
	const xLength = 4,
	    yLength = 4,
	    width = 100,
	    heigth = 100,
	    photoLength = 50,
	    spaceLength = 20,
	    totalLength = xLength * yLength;

	let	count = 0,
		step = 0,
	    starNumber = 3,
	    lasterCell = null,
	    cellStatus = false,
	    gameCells = {};

   	/**
	* @description timer
	* @param
	* @returns {object} timer methods
	*/
	let timer = (function () {
			let totalTime = 0,
			 	gameTimer,
				timeContainer = document.getElementById('timer-container');

			let startTimer = function() {
				timeContainer.innerHTML = (totalTime / 1000).toFixed(3);
				totalTime = totalTime + 123;
				gameTimer = setTimeout(startTimer, 123);
			};

			let stopTimer = function() {
				clearTimeout(gameTimer);
			};

			let getTime = function() {
				return (totalTime / 1000).toFixed(3);
			};

			let setTime = function(time) {
				totalTime = time;
			};

			return {
				startTimer: startTimer,
				stopTimer: stopTimer,
				getTime: getTime,
				setTime: setTime
			};
	}());

	//start the game
	initGame();

	/**
	* @description init game
	* @returns
	*/
	function initGame() {
		initArray();
		addEventsAction();
	}

	/**
	* @description init array
	* @returns
	*/
	function initArray() {
		let index = 0;
		const randomArray = shuffleArray();
		for (let i = 0; i < xLength; i ++) {
			gameCells[i] = {};
			for (let j = 0 ; j < yLength; j ++) {
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
		return {
			number: num,
			status: 0 // four status, 0: close, 1: first open, 2:second open, 3:success
		};
	}

	/**
	* @description use shuffle to get random array
	* @returns {object} random array
	*/
	function shuffleArray() {
		let randomArray = {}, randomIndex, temp;
		for (let i = 0; i < totalLength; i ++) {
			randomArray[i] = i;
		}
		//var randomArray = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16};
		for (let i = totalLength - 1; i >= 0; i --) {
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
		let mainContainer = document.getElementById('main-container'),
		    mainCells = document.getElementsByClassName('main-cell'),
		    timeContainer = document.getElementById('timer-container'),
		    length = mainCells.length;

		for(let i = 0; i < length; i++) {
			mainContainer.removeChild(mainCells[0]);
		}

		for (let i = 0; i < xLength; i ++) {
			for (let j = 0; j < yLength; j ++) {
				//main cell
				let mainCell = createCell(i, j);
				mainCell.id = 'main-cell-' + i + '-' + j;
				mainCell.className = 'main-cell';
				mainCell.style.top = getPosition(i) + 'px';
				mainCell.style.left = getPosition(j) + 'px';

				//border cell
				let cell = createCell(i, j);
				cell.id = 'border-cell-' + i + '-' + j;
				cell.className = 'border-cell';
				mainCell.appendChild(cell);

				//photo cell
				let photoCell = createCell(i, j);
				photoCell.id = 'photo-cell-' + i + '-' + j;
				photoCell.className = 'photo-cell';
				let imageCell = createImage(gameCells[i][j]);
				photoCell.appendChild(imageCell);
				mainCell.appendChild(photoCell);

				mainContainer.appendChild(mainCell);
			}
		}

	    // start timer
	    timer.startTimer();
	}

	function createCell() {
		let borderCell = document.createElement('div');
		borderCell.style.width = width + 'px';
		borderCell.style.height = heigth + 'px';
		borderCell.style.top = '0px';
		borderCell.style.left = '0px';
		return borderCell;
	}

	function createImage(mapCell) {
		let imageCell = document.createElement('img');
		imageCell.className = 'photo';
		imageCell.src = 'image/' + mapCell.number + '.png';
		imageCell.alt = mapCell.number;
		imageCell.style.width = photoLength + 'px';
		imageCell.style.height = photoLength + 'px';
		return imageCell;
	}

	function addEventsAction() {
		let mainContainer = document.getElementById('main-container');
		mainContainer.addEventListener('click', function(event) {
			for (let i in event.path) {
				let borderCell = event.path[i];
				if (hasClass(borderCell, 'main-cell') && !borderCell.disabled) {
					clickAction(borderCell);
					break;
				}
			}
  		}, false);

		let refresh = document.getElementById('refresh');
		refresh.addEventListener('click', function(){
	        refreshAction(this);
	    }, false);

	    let playAgain = document.getElementById('play-again');
		playAgain.addEventListener('click', function(){
	        refreshAction(this);
	    }, false);
	}

	/**
	* @description deal with the click action,show the photo
	* @param {object} the border object
	* @returns
	*/
	function clickAction(border) {

		let borderX = getIndex(border.id, true),
			borderY = getIndex(border.id, false),
			gameCell = gameCells[borderX][borderY];
	    if (gameCell.status === 3) return;
		if (!lasterCell) {			// if the cell is the first one of this type cells
			gameCell.status = 1;
			cellStatus = true;
			firstOpenAnimation(border);
			lasterCell = border;
			step ++;
			freshMoves(step);
		} else {				 // //if the cell is the second one of this type cells
			if (border === lasterCell) return;

			let lasterX = getIndex(lasterCell.id, true),
				lasterY = getIndex(lasterCell.id, false),
				lasterGameCell = gameCells[lasterX][lasterY];	//get the laster cell

			disableButtonByObj(border, true);
			disableButtonByObj(lasterCell, true);
			if (lasterGameCell.number === gameCell.number) {	//match
				count++;
				gameCell.status = 3;
				lasterGameCell.status = 3;
				rightAnimation(border, lasterCell);
				step ++;
			} else {			//not match
				gameCell.status = 2;
				wrongAnimation(border, lasterCell);
				step ++;
			}

			freshMoves(step);
			let lasterlasterCell = lasterCell;
	    	lasterCell = null;

		    setTimeout(function() {
				disableButtonByObj(border, false);
				disableButtonByObj(lasterlasterCell, false);
			},  500);
		}
	}

	/**
	* @description refresh the moves and the style of stars
	* @param {int} the number of moves
	* @returns
	*/
	function freshMoves(step) {
		let star, move = document.getElementById('move');
	    move.innerHTML = step;
	    if (step === 24) {
	 		star = document.getElementById('star-'+ 3);
	 		star.className = 'fa fa-star-o';
	 		starNumber--;
	    } else if (step === 32) {
			star = document.getElementById('star-'+ 2);
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

		timer.stopTimer();
		timer.setTime(0);
		let timeNum = document.getElementById('time');
		timeNum.innerHTML = '';
		let move = document.getElementById('move');
	    move.innerHTML = step;
		let success = document.getElementById('success-container');
		success.style.display = 'none';
		let main = document.getElementById('main-container');
		main.style.display = '';
		let body = document.getElementById('head-container');
		body.style.display = 'block';

		let stars = document.getElementsByClassName('fa-star-o'),
			starsLength = stars.length;
		for(let i = 0; i < starsLength; i++) {
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
		 // stop timer
	    timer.stopTimer();
		let timeNum = document.getElementById('time');
		timeNum.innerHTML = timer.getTime();
		let stepNum = document.getElementById('step');
		stepNum.innerHTML = step;
		let starNum = document.getElementById('star-num');
		starNum.innerHTML = starNumber;
		let success = document.getElementById('success-container');
		success.style.display = 'block';
		let main = document.getElementById('main-container');
		main.style.display = 'none';
		let body = document.getElementById('head-container');
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

		if (count === 8) {
			setTimeout(function() {
				successful();
			},  100);
		}
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
		return obj.className ? obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)')) : false;
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
			let regClassName = new RegExp('(\\s|^)' + className + '(\\s|$)');
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
		const strArray = str.split('-');
		return isFirst ? strArray[2] : strArray[3];
	}

	/**
	* @description disabled or enabled button
	* @param {obj} the class name
	* @param {bool} true: disabled, false: enabled
	* @returns {number} the index
	*/
	function disableButtonByObj(obj, disabled) {
		obj.disabled = disabled;
	}

}());
