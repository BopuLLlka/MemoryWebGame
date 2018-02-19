<html>
<head>
	<title>Memory</title>
	 <link rel="stylesheet" href="Styles/MainStyle.css">
	  <script type="text/javascript" src="Scripts/jquery-3.3.1.min.js"></script>
	 
</head>
<body >

<canvas onmousemove="mouseMove()" onmousedown="mouseClick()" id="sheet" width="1280" height="720"></canvas>
<div id="startScreen">
	<div id = "startImage"> </div>
	<div id = "startGameText">memory game</div>
	<div  onclick="startGame()" id = "startButton">
		<p id=startButtonText>Начать игру</p>
	</div>
</div>
<div id="score"></div>
<div class="blockNone"> 
	<img id="cardSpriteImg" src="Images/Cards.png"></img> 
</div>
<div id="finalScreen">
	<div id = "finalImage"> </div>
	<p class="gameText"> Поздравляем!</p>
	<p id = "finalScore"></p>
	<div onclick="startGame()" id = "startButton">
		<p id=startButtonText>Ещё раз</p>
	</div>
</div>
</body>
<script type="text/javascript" src="Scripts/MainScript.js" width="2488px" height="1200px"></script>
</html>
