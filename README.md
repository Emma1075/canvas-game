# canvas-game

## 第一个游戏 别踩白块儿

利用 canvas 绘制图形。

设置三个按钮： 暂停，继续，重新开始

利用 `isStarted`,`isContinue` 来控制状态。初始值均为 false。

1. 游戏未开始时，点击暂停与继续按钮，均无反应
2. 游戏开始后，isStarted = true; 此时只能点击暂停与重新开始可以触发相应事件。点击继续无效。
3. 游戏暂停后，isStarted = false; isContinue = true; 此时仅点击继续可触发事件，点击另两个按钮（继续与重新开始）无反应。

关键代码如下

```js

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
	console.log('speed', speed);
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
		getCore();
	}, 16)

	// 继续游戏后，isStarted 为 true
	// 游戏重新开始，此时再点击继续按钮就无效了
	isStarted = true;
	isContinue = false;
}
```

## 兼容移动端
1. 设置 viewport

```html
<meta name="viewport" content="width=device-width,user-scaleable=no,initial-scale=1">
```

2. 获取画布宽高
```js
oContext.width = document.documentElement.clientWidth;
oContext.style.width = document.documentElement.clientWidth + 'px';
oContext.height = document.documentElement.clientHeight;
oContext.style.height = document.documentElement.clientHeight + 'px';

```

3.更改 click 事件为 touchstart 事件；

4. 事件获取位置
```js
let x = e.targetTouches[0].offsetX;
let y = e.targetTouches[0].offsetY;
```





