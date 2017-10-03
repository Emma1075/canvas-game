let core = document.getElementById('core'),
	reStartBtn = document.getElementById('reStart'),
	stopBtn = document.getElementById('stop'),
	continueBtn = document.getElementById('continue'),
	maskOver = document.querySelector('.mask.over'),
	maskStopped = document.querySelector('.mask.stopped');

let myCanvas = document.getElementById('cv'),
	oContext = myCanvas.getContext('2d');

window.onresize = function() {
	let w = document.documentElement.clientWidth - 30;
	let h = document.documentElement.clientHeight - 68;

	myCanvas.width = w;
	myCanvas.height = h;
	setWH(myCanvas, w, h);

	// oContext.style.marginLeft = -w / 2 + 'px';

	setWH(maskStopped, w, h);
	setWH(maskOver, w, h);

}

window.onresize();

let {
	width,
	height
} = myCanvas;

/*
 * data : 放置初始数组
 * c: col - 列
 * r: row - 行
 * block_w: 小块的宽 
 * block_h: 小块的高 
 * t: 初始偏移高度
 * timer: 定时器
 * speed: 初始下降速度
 */

let data = [];

let c = 4,
	r = 4,
	block_w = width / c,
	block_h = height / r,
	t = -block_h;

let timer;
let speed = 1;

let isContinue = false,
	isStarted = false;

initGame()

function initGame() {
	getData();
	draw();
	isStarted = true;
	timer = setInterval(function() {
		t += speed;

		if (t >= 0) {
			let lastRow = data.pop();
			data.unshift(createLine());

			// 重置 t 值
			t = -block_h;

			// 最下方消失的一行中，有未被点的黑块,则退出游戏
			if (lastRow.includes(1)) {
				stopGame();
			}
		}

		// 重新绘制
		draw();
	}, 16)
}

// 给 canvas 添加点击事件
myCanvas.addEventListener('touchstart', function(ev) {
	let x = ev.targetTouches[0].clientX;
	let y = ev.targetTouches[0].clientY - t;

	let r = Math.floor(y / block_h);
	let c = Math.floor(x / block_w);

	speed += 0.2;
	speed = Number(speed.toFixed(2));
	// 判断是否点中白块
	if (data[r][c] === 0) {
		stopGame();
	} else {
		data[r][c] = 0;
		draw();
	}

}, false);

// 给按钮添加点击事件
reStartBtn.onclick = function() {
	// 游戏暂停的时候不能点击重新开始 => 即：isContinue 为 true 时退出函数
	if (isContinue) return;
	startGame();
}

// 暂停
stopBtn.onclick = function() {
	// 游戏没有开始时不能点击暂停
	if (!isStarted) return;

	maskStopped.style.display = 'block';
	clearTimeout(timer);

	// 暂停后将 isStarted 改为 false
	// 游戏开始后可以被暂停，所以改 isContinue 为 true
	isStarted = false;
	isContinue = true;
}

// 继续
continueBtn.onclick = function() {
	// 只有 isContinue 为 true 时可以被暂停，被暂停后才能点击继续
	// 游戏未被暂停时，点击继续无效
	if (!isContinue) return;

	maskStopped.style.display = 'none';
	timer = setInterval(function() {
		t += speed;

		if (t >= 0) {
			let lastRow = data.pop();
			data.unshift(createLine());

			// 重置 t 值
			t = -block_h;

			// 最下方消失的一行中，有未被点的黑块
			if (lastRow.includes(1)) {
				stopGame();
			}
		}

		// 重新绘制
		draw();
	}, 16)

	// 继续游戏后，isStarted 为 true
	// 游戏重新开始，此时再点击继续按钮就无效了
	isStarted = true;
	isContinue = false;
}

/* createLine()
 * 0：代表白块； 
 * 1：代表黑块。
 * 得到一个长度为 c 的数组，数组中仅一个黑块（1）
 */
function createLine() {
	let arr = new Array(c).fill(0);

	// 取 0-c 之间的随机数
	let i = Math.floor(Math.random() * c);
	arr[i] = 1;
	return arr;
}

function getData() {
	// 先对清空 data 数组
	data = [];

	for (let i = 0; i <= r; i++) {
		data.push(createLine());
	}

	return data;
}

function draw() {
	// 每次绘制前先清空
	oContext.clearRect(0, 0, width, height);

	for (let r = 0; r < data.length; r++) {
		for (let c = 0; c < data[r].length; c++) {
			if (data[r][c] === 0) {
				oContext.fillStyle = '#fff';
			} else {
				oContext.fillStyle = '#000';
			}
			oContext.fillRect(block_w * c, t + block_h * r, block_w, block_h)

			oContext.strokeStyle = '#ccc';
			oContext.strokeRect(block_w * c, t + block_h * r, block_w, block_h)
		}
	}
}

function getCore() {
	let num = Math.floor((speed - 1.2) * 5 * speed * speed);
	return num;
}

function stopGame() {
	maskOver.style.display = 'block';
	let num = getCore() > 0 ? getCore() : 0;
	maskOver.innerHTML = `游戏结束! 得分: ${num}`
	clearTimeout(timer);

	// 游戏结束后，要重置初始值 t, speed, isStarted 与 isContinue;
	t = -block_h;
	speed = 1;
	isStarted = false;
	isContinue = false;
}

function startGame() {
	// 开始游戏前，要先清除定时器
	clearTimeout(timer);

	// 再还原初始值
	t = -block_h;
	speed = 1;
	maskOver.style.display = 'none';
	initGame();
}

function setWH(ele, w, h) {
	ele.style.width = w + 'px';
	ele.style.height = h + 'px';
}