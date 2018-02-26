////////////////////////////////////////////////////////////////////////
/////////////////////Created by Sergey Davydov//////////////////////////
////////////////////////////////////////////////////////////////////////
$(document).ready(function (e)
{
	//Находим все элементы из HTML, которые будут использоваться
	var topMenuContainer = $("#topMenuContainer");
	var scoreBlock = $("#score");
	var startScreen = $("#startScreen");
	var finalScreen = $("#finalScreen");
	var finalScore = $("#finalScore");
	var canvas = document.getElementById("sheet");
	var canvasContext = canvas.getContext("2d");
	var cardSprite = document.getElementById("cardSpriteImg");	
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


	//При движении мышкой по канвасу вызываем MouseMove
	$("#sheet").on('mousemove', function (event) {
	 	mouseMove(event);
	});
	//При нажатии мышки на канвас вызываем MouseClick
	$("#sheet").on('click', function (event) {
	 	mouseClick(event);
	});
	/*
	При клике на любую из кнопок с классом "restart"
	("Начать игру","Начать новую игру","Ещё раз") 
	вызываем startGame
	*/
	$("body").on("click",".restart", function(){
		startGame();
	});
	//Инициализация переменных
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
	//Класс нашей карты
	class Card{
		/*
		||====================================
		|| Памятка
		||-----------------------------------
		|| Первая цифра отвечает за масть,
		|| остальные 2 за карту
		||-----------------------------------
		|| D-Diamond-1**
		|| C-Club-2**
		|| H-Heart-3**
		|| S-Spade-4**
		||-----------------------------------
		|| 2-2
		|| 3-3
		|| ..
		|| ..
		|| 11-Jack
		|| 12-Queen
		|| 13-King
		|| 14-Ace
		||====================================
		|| Example: cardName = 214 - Club Ace
		||			cardName = 304 - Heart 4
		||====================================
		*/
		constructor(cardName)
		{
			//Открыта ли карта
			this.isOpen = true;
			//Карта вышла из игры
			this.isCameOut = false;
			//Имя карты, состоящее из 3-х чисел - ***, например 312
			this.cardName=cardName;
			this.imgX=0;
			this.imgY=0;

			/*
			Жуткая привязка координат на изображении
			к картам(картинка кривая, поэтому нормальную
			формулу вывести не удалось) (╮°-°)╮┳━━┳ ( ╯°□°)╯ ┻━━┻
			*/
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
	//Обработчик движения мыши
	function mouseMove(event)
	{
		//Если игра началась
		if(isGameStart)
		{
			var isCard = false;
			//Запоминаем координаты мыши
			var mouseX = event.offsetX;
			var mouseY = event.offsetY;

			for(var i = 0; i < 18; i++)
			{
				//Если не нашли карту
				if(!isCard)
				{	
					//Если координаты миши находятся внутри карты
					if(mouseX>=cardsForGame[i].x && mouseY>=cardsForGame[i].y && mouseX<=cardsForGame[i].x+cardWidth && mouseY<=cardsForGame[i].y+cardHeigth && !cardsForGame[i].isOpen)
					{
						//Запоминаем, что нашли карту
						isCard=true;
						//Меняем курсор мыши на указатель
						$("#sheet").css("cursor","pointer")
					}
					else{   
						///Меняем курсор мыши на обычный
						$("#sheet").css("cursor","default")
					}
				}
			}
		}
	}
	//Обработка клика мыши
	function mouseClick(event)
	{
		//Если игра началась
		if(isGameStart){
			//Запоминаем координаты мыши
			var mouseX = event.offsetX;
			var mouseY = event.offsetY;
			
			for(var i = 0; i < 18; i++)
			{
				//Если мышка нажали на карту
				if(mouseX>=cardsForGame[i].x && mouseY>=cardsForGame[i].y && mouseX<=cardsForGame[i].x+cardWidth && mouseY<=cardsForGame[i].y+cardHeigth && !cardsForGame[i].isOpen)
				{
					//Делаем эту карту открытой.
					cardsForGame[i].isOpen=true;
					//Пееррисовываем
					reDraw();
					//Если уже была открыта карта
					if(isFirstCardOpen)
					{
						//Записываем эту карту, как вторую открытую
						secondOpenCardNumber = i;
						isFirstCardOpen = false;
						//Вызываем функцию подсчёта очков
						scoreControl(event);
					}
					else
					{
						//Записываем карту как первую открытую
						firstOpenCardNumber = i;
						//Запоминаем, что уже есть одна открытая карта
						isFirstCardOpen=true;
					}
				}
			}
		}
	}
	//Управление счётом
	function scoreControl(mouseEvent)
	{
		var message = "";
		//Высчитываем сколько сейчас нужно прибавить/отнять очков
		var curScore = (cardsInGame/2)*42;
		//Если открыты одинаковые карты
		if(cardsForGame[firstOpenCardNumber].cardName==cardsForGame[secondOpenCardNumber].cardName)
		{
			//Выводим карты из игры
			cardsForGame[firstOpenCardNumber].isCameOut=true;
			cardsForGame[secondOpenCardNumber].isCameOut=true;
			cardsInGame-=2
			//Увеличиваем счёт
			score += curScore;
			scoreBlock.text("Очки: "+score);
			$(".currentScore").remove();
			$("body").append("<div class='currentScore' style='left:"+(mouseEvent.clientX-20)+"; top:"+(mouseEvent.clientY-20)+";'> +"+curScore+"</div>")
			//Перерисовываем игровое поле
			setTimeout(reDraw,1000);
		}
		else
		{
			//Закрываем карты обратно
			cardsForGame[firstOpenCardNumber].isOpen=false;
			cardsForGame[secondOpenCardNumber].isOpen=false;
			//Небольшая проверка, если счёт совсем плохой
			if(Math.abs(score)>=999999999999)
			{
				message = " Ой, какой счёт, может  начать сначала?";
				if(Math.abs(score)>=9999999999999)
				{
					message = " Дальше я уже не могу рисовать тебе красивые числа, прости:(";
					score=-9999999999999;
				}
			}
			else
			{
				//Уменьшаем счёт
				score -= curScore;
			}

			scoreBlock.text("Очки: "+ score + message);
			$(".currentScore").remove();
			$("body").append("<div class='currentScore' style='left:"+(mouseEvent.clientX-20)+"; top:"+(mouseEvent.clientY-20)+"; color:red;'> -"+curScore+"</div>")
			//Перерисовываем игровое поле
			setTimeout(reDraw,1000);
		}
		//Если больше нет карт в игре
		if(cardsInGame==0)
		{
			endGame();
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
		//Прячем верхнее меню0
		topMenuContainer.css("display","none");
		finalScore.text("Ваш итоговый счёт "+score);
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		isGameStart = false;
		//Показать финальный экран
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
				//Если карта вышла из игры
				if(cardsForGame[i].isCameOut)
				{
						//Координаты чёрной области
						drawX=2237;
						drawY=750;
				}
				else{
					//Если карта открыта
					if(cardsForGame[i].isOpen)
					{
						//Рисуем карту по координатам, которые записывали
						drawX = cardsForGame[i].imgX;
						drawY = cardsForGame[i].imgY;	
					}
					else
					{
						//Координаты закрытой карты
						drawX = 2237;
						drawY = 520;
					}
				}
				//Рисуем
				canvasContext.drawImage(cardSprite, drawX, drawY, cardCropWidth, cardCropHeight, x, y, cardWidth, cardHeigth);
			}
		}
	}

	//Собираем колоду для игры
	function generateDesk()
	{
		var allCardsForRandom = new Array(52)
		//4 масти (100 - Dimond)
		var suit = 100;
		//Начинаем с 2 и до 14-Ace
		var cardNumberTemp = 2;
		for(var i = 0; i < 52; i++)
		{
				//Собираем обычнну. колоду какрт 52шт.
				//Для этого в массив записывается масть карты с маской *00 + номер самой карты, например 100+14 = 114 = Dimond Ace
				allCardsForRandom[i]=suit+cardNumberTemp;

				//Если 14 карт масти есть
				if(cardNumberTemp==14)
				{
					//Берём следующую масть
					suit+=100;
					//И начинаем с двойки
					cardNumberTemp=2;
				}
				else
				{
					//Если нет, то просто берём следующую карту
					cardNumberTemp++;
				}
		}
		//Тосуем колоду
		allCardsForRandom = shuffle(allCardsForRandom);
		//Берем первые 9 карт из колоды и дважды записываем в стопку с картами для игры
		for(var i = 0; i<9; i++)
		{
			cardsForGame[i] = new Card(allCardsForRandom[i]);
			cardsForGame[i+9] = new Card(allCardsForRandom[i]);
		}
		//Перемешиваем карты для игры
		cardsForGame = shuffle(cardsForGame);
	}

	//Алгоритм перемешивания 
	function shuffle(array) {
	  //Объявляем переменные
	  var m = array.length, t, i;
	  //Пока карты ещё есть
	  while (m) {
	  	//Берём случайную карту и вычитаем карту из перемешивания
	    i = Math.floor(Math.random() * m--);
	    //Берём вторую карту
	    t = array[m];
	    //Первая карта на место второй
	    array[m] = array[i];
	    //Вторая на место первой
	    array[i] = t;
	  }
	  //Возвращаем колоду которая получилась
	  return array;
	}

	//Прячем всё с начального экрана
	function hideStartScreen()
	{
		finalScreen.css("display","none");
		startScreen.css("display", "none");
		topMenuContainer.css("display","flex");
	}

	//Рисуем стол и запоминаем координаты карт на столе
	function drawDesk()
	{
		if(isGameStart)
		{
			scoreBlock.text("Очки: "+score);
			//Координаты рубашки карт на картинке
			var xClosed = 2237;
			var yClosed = 520;
			//На сколько пикселей сдвинуть слудующую карту
			var xStep = 150;
			var yStep = 200;
			//Кол-во рядов и столбцов карт на столе	
			var numberOfRows = 3;
			var numberOfColumns = 6;
			var cardNumber = 0;
			//Отрисовка стола и генера
			for(var j=0;j<numberOfRows;j++)
			{
				for(var i=0; i<numberOfColumns; i++)
				{
					//Записываем координаты в объект, чтоб потом по ним находить карты на столе
					cardsForGame[cardNumber].x=x;
					cardsForGame[cardNumber].y=y;
					//Рисуем карту
					canvasContext.drawImage(cardSprite, cardsForGame[cardNumber].imgX, cardsForGame[cardNumber].imgY, cardCropWidth, cardCropHeight, x, y, cardWidth, cardHeigth);
					//Берём следующую карту
					x+=xStep;
					//Сдвигаем слудующую карту
					cardNumber++;
				}
				//Когда нарисовали ряд карт сдвигаем карты вниз и начинаем с самого начала
				y+=yStep;
				x=xStartPosition;
			}
		}
	}
});
