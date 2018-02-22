<html>
<head>
	<title>Memory</title>
	 <link rel="stylesheet" href="Styles/MainStyle.css">
	 <script type="text/javascript" src="Scripts/jquery-3.3.1.min.js"></script>
	 <script type="text/javascript" src="Scripts/MainScript.js"></script>
</head>
<body>
	<canvas id="sheet" width="1280" height="720"></canvas>
	<div id="startScreen">
		<div id = "startImage"> </div>
		<div id = "startGameText">memory game</div>
		<div class="restart" id = "startButton">
			<p id=startButtonText>Начать игру</p>
		</div>
	</div>
	<div id="topMenuContainer"><div id="restartBtn" class="restart">Начать новую</div><div id="score"></div></div>
	<div class="blockNone"> 
		<img id="cardSpriteImg" src="Images/Cards.png"></img> 
	</div>
	<div id="finalScreen">
		<div id = "finalImage"> </div>
		<p class="gameText"> Поздравляем!</p>
		<p id = "finalScore"></p>
		<div class="restart" id = "startButton">
			<p id=startButtonText>Ещё раз</p>
		</div>
	</div>
</body>
</html>
