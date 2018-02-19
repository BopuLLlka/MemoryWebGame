///////////////Created by Sergey Davydov////////////////////
//Находим все элементы из HTML, которые будут использоваться
//var startImage = $("#startImage");
//var startGameText = $("#startGameText");
var scoreBlock = $("#score");
var startScreen = $("#startScreen");
var finalScreen = $("#finalScreen");
var finalScore = $("#finalScore");
var scoreContainer = $("#score");
var canvas;
var canvasContext;
var cardSprite;
var isGameStart = false;

//Карты, которые будут на столе
var cardsForGame = new Array(18);
//Ширина и высота карты
var cardWidth = 120;
var cardHeigth = 180;
//Ширина и высота вырезаемой области
var cardCropWidth = 153;
var cardCropHeight = 216;

//Счёт
var score;
//Начальная позиция с которой начинается отрисовка первой карты
var xStartPosition;
var yStartPosition;
//Координаты левого верхнего угла карты
var x = xStartPosition;
var y = yStartPosition;
//Есть ли уже открытая карта
var isFirstCardOpen;
//Имя первой открытой карты
var firstOpenCardNumber;
//Имя воторй открытой карты
var secondOpenCardNumber;
//карты в игре
var cardsInGame;


function initializing()
{
	score = 0;
	xStartPosition = 200;
	yStartPosition = 50;
	//Координаты левого верхнего угла карты
	x = xStartPosition;
	y = yStartPosition;
		//Есть ли уже открытая карта
	isFirstCardOpen = false;
	//Имя первой открытой карты
	firstOpenCardNumber = 0;
	//Имя воторй открытой карты
	secondOpenCardNumber = 0;
	//Карт осталось в игре
	cardsInGame=18;
}

class Card{
	//////////////////////////////////////
	///Памятка
	///----------------------------------
	///D-Diamond-1**
	///C-Club-2**
	///H-Heart-3**
	///S-Spade-4**
	///
	///11-Jack
	///12-Queen
	///13-King
	///14-Ace
	//////////////////////////////////////
	///Example: cardName = 214 - Club Ace
	///			cardName = 304 - Heart 4
	//////////////////////////////////////
	constructor(cardName)
	{
		this.isOpen = true;
		this.isCameOut = false;
		this.cardName=cardName;
		this.imgX=0;
		this.imgY=0;

		var stepY=0;
		if(Math.floor(cardName/100)==1)
		{
			stepY = 0;
		}
		else
		if(Math.floor(cardName/100)==2)
		{
			stepY = 230;
		}
		else
		if(Math.floor(cardName/100)==3)
		{
			stepY = 462;
		}
		else
		if(Math.floor(cardName/100)==4)
		{
			stepY = 694;
		}

		///ХАРДКОДИМ ВСЁ ИБО МНЕ ЛЕНЬ ДУМАТЬ
		if(cardName%100<10)
		{
			if(cardName%100 == 2)
				this.imgX = 98;
			if(cardName%100 == 3)
				this.imgX = 98+164;
			if(cardName%100 ==4)
				this.imgX = 98+164+165;
			if(cardName%100 == 5)
				this.imgX = 98+164+165+164;
			if(cardName%100 == 6)
				this.imgX = 98+164+165+164+165;
			if(cardName%100 == 7)
				this.imgX = 98+164+165+164+165+165;
			if(cardName%100 == 8)
				this.imgX = 98+164+165+164+165+165+164;
			if(cardName%100 == 9)
				this.imgX = 98+164+165+164+165+165+164+165;

			this.imgY = 58 + stepY;
		}
		else
		if(cardName%100>=10 && cardName%100<=12)
		{
			//console.log(Math.floor(cardName/100)+"|"+cardName%100);
			if(cardName%100 == 10)
				this.imgX = 98+164+165+164+165+165+164+165+164;
			if(cardName%100 == 11)
				this.imgX =	98+164+165+164+165+165+164+165+164+165;
			if(cardName%100 == 12)
				this.imgX = 98+164+165+164+165+165+164+165+164+165+164;

			this.imgY = 59 + stepY;
		}
		else
		{	
			if(cardName%100 == 13)
				this.imgX = 98+164+165+164+165+165+164+165+164+165+164+165;
			if(cardName%100 == 14)
				this.imgX = 98+164+165+164+165+165+164+165+164+165+164+165+164;

			this.imgY = 61 + stepY;
		}
		this.x=0;
		this.y=0;
	}

}
//После загрузки страницы подгружается канвас и картинка со всеми картами
window.onload = function()
{
		canvas = document.getElementById("sheet");
		canvasContext = canvas.getContext("2d");
		cardSprite = document.getElementById("cardSpriteImg");	
}
//Старт игры(нажали кнопку "Начать игру")
function mouseMove()
{
	if(isGameStart)
	{
		var isCard = false;
		var mouseX = event.offsetX;
		var mouseY = event.offsetY;
		
		for(var i = 0; i < 18; i++)
		{
			if(!isCard)
			{
				if(mouseX>=cardsForGame[i].x && mouseY>=cardsForGame[i].y && mouseX<=cardsForGame[i].x+cardWidth && mouseY<=cardsForGame[i].y+cardHeigth && !cardsForGame[i].isOpen)
				{
					isCard=true;

					$("#sheet").css("cursor","pointer")
				}
				else{   
					///Потом поудалять тут всё!!!!
					$("#sheet").css("cursor","default")
					var cardEndX = cardsForGame[i].x+cardWidth;
					var cardEndY = cardsForGame[i].y+cardHeigth;
					//console.log(mouseX+"-"+mouseY+"||"+cardEndX+"-"+cardEndY);
				}
			}
		}
	}
}
//Обработка клика мыши
function mouseClick()
{
	var mouseX = event.offsetX;
	var mouseY = event.offsetY;
	
	for(var i = 0; i < 18; i++)
	{
		if(mouseX>=cardsForGame[i].x && mouseY>=cardsForGame[i].y && mouseX<=cardsForGame[i].x+cardWidth && mouseY<=cardsForGame[i].y+cardHeigth && !cardsForGame[i].isOpen)
		{
			//console.log("МЫША "+mouseX+"|"+mouseY);
			cardsForGame[i].isOpen=true;

			if(isFirstCardOpen)
			{
				secondOpenCardNumber = i;
				isFirstCardOpen = false;
				reDraw();
				scoreControl();
			}
			else
			{
				firstOpenCardNumber = i;
				isFirstCardOpen=true;
				reDraw();
				
			}
		}
	}
}
//Управление счётом
function scoreControl()
{
	if(cardsForGame[firstOpenCardNumber].cardName==cardsForGame[secondOpenCardNumber].cardName)
	{
		score+=100;
		console.log(score);
		scoreBlock.text("Очки: "+score);
		cardsForGame[firstOpenCardNumber].isCameOut;
		cardsForGame[secondOpenCardNumber].isCameOut;
		cardsInGame-=2
		setTimeout(reDraw,1000);
	}
	else
	{
		
		score-=100;
		console.log(score);
		scoreBlock.text("Очки: "+score);
		cardsForGame[firstOpenCardNumber].isOpen=false;
		cardsForGame[secondOpenCardNumber].isOpen=false;
		setTimeout(reDraw,1000);
	}
	if(cardsInGame==0)
	{
		endGame();
		//startGame();
	}
	
}

//Начало игры
function startGame()
{
	initializing();
	generateDesk();
	hideStartScreen();
	isGameStart = true;
	drawDesk();
	setTimeout(turnOverTheCards,5000);
	
}
//Конец игры
function endGame()
{
	scoreBlock.css("display","none");
	finalScore.text("Ваш итоговый счёт "+score);
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	isGameStart = false;
	showFinalScreen();
}
//Показать финайльный экран
function showFinalScreen(){
	finalScreen.css("display","block");
}
//Перевернуть карты
function turnOverTheCards(){
	for(var i = 0; i<18; i++)
	{
		cardsForGame[i].isOpen=false;
	}
	reDraw();
}
//Перерисовка
function reDraw(){
	if(isGameStart)
	{
		var drawX;
		var drawY;
		
		for(var i = 0; i<18; i++)
		{
			x=cardsForGame[i].x;
			y=cardsForGame[i].y;

			if(cardsForGame[i].isOpen)
			{
				drawX = cardsForGame[i].imgX;
				drawY = cardsForGame[i].imgY;	
			}
			else
			{
				drawX = 2237;
				drawY = 520;
			}
			
			canvasContext.drawImage(cardSprite, drawX, drawY, cardCropWidth, cardCropHeight, x, y, cardWidth, cardHeigth);
		}
	}
}

//Собираем колоду для игры
function generateDesk()
{
	var allCardsForRandom = new Array(52)
	//4 масти 100 - Dimond
	var suit = 100;
	//Начинаем с 2 и до 14-Ace
	var cardNumberTemp = 2;
	for(var i = 0; i < 52; i++)
	{
			allCardsForRandom[i]=suit+cardNumberTemp;

			if(cardNumberTemp==14)
			{
				suit+=100;
				cardNumberTemp=2;
			}
			else
			{
				cardNumberTemp++;
			}
			console.log("Номер карты: "+i+"| Присвоен номер: "+allCardsForRandom[i]);
	}
	//Тосуем колоду
	allCardsForRandom = shuffle(allCardsForRandom);
	//Берем первые 9 карт из колоды и запихиваем в стопку с картами для игры, после этого перемешиваем их
	for(var i = 0; i<9; i++)
	{
		cardsForGame[i] = new Card(allCardsForRandom[i]);
		cardsForGame[i+9] = new Card(allCardsForRandom[i]);
	}
	cardsForGame = shuffle(cardsForGame);


	
	for(var i=0;i<18;i++)
	{
		//console.log("Card:"+cardsForGame[i].cardName+"|"+cardsForGame[i].imgX);
	}
}

//Алгоритм перемешивания 
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

//Прячем всё с начального экрана
function hideStartScreen()
{
	//startImage.css("display", "none");
	//startGameText.css("display", "none");
	//startButton.css("display", "none");
	finalScreen.css("display","none");
	startScreen.css("display", "none");
	scoreBlock.css("display","block");
}

//Рисуем стол
function drawDesk()
{
	if(isGameStart)
	{
		scoreBlock.text("Очки: "+score);
		//Координаты рубашки карт на картинке
		var xClosed = 2237;
		var yClosed = 520;
		//var curCardCoordX = 98+164+165+164+165+165+164+165+164+165+164+165+164;
		//var curCardCoordY = 60;
		//xClosed=curCardCoordX;
		//yClosed=curCardCoordY;
		
		//На сколько пикселей сдвинуть слудующую карту
		var xStep = 150;
		var yStep = 200;
		//Кол-во рядов и столбцов карт на столе	
		var numberOfRows = 3;
		var numberOfColumns = 6;
		var cardNumber = 0;
		
		//Отрисовка стола
		for(var j=0;j<numberOfRows;j++)
		{
			for(var i=0; i<numberOfColumns; i++)
			{
				cardsForGame[cardNumber].x=x;
				cardsForGame[cardNumber].y=y;
				//console.log("Имя карты: "+cardsForGame[cardNumber].cardName+" Координаты отрисовки: "+cardsForGame[cardNumber].imgX+"|"+cardsForGame[cardNumber].imgY);
				if(cardsForGame[cardNumber].isOpen)
					canvasContext.drawImage(cardSprite, cardsForGame[cardNumber].imgX, cardsForGame[cardNumber].imgY, cardCropWidth, cardCropHeight, x, y, cardWidth, cardHeigth);
				else
					canvasContext.drawImage(cardSprite, xClosed, yClosed, cardCropWidth, cardCropHeight, x, y, cardWidth, cardHeigth);
				x+=xStep;
				cardNumber++;
			}
			x=xStartPosition;
			y+=yStep;
		}
	}
}
