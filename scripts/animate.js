//Game entry
myth.game = function(type) {
  var STARS_NUMBER = 20,
      FULL_TIME = 10;

  var variables = myth.base.vars,
      c = variables.ctx(),
      cvs = variables.canvas(),
      screenWidth = variables.width(),
      screenHeight = variables.height(),
      bg = variables.background(),
      itv = variables.interval(),
      classes = myth.base.classes,
      starsObject = new classes.Stars(STARS_NUMBER),
      pathObject = new classes.Path(),
      gameInterval = null,
      isTimeout = false,
      isPause = false,
      score = 0,
      passTime = 0;

  /**
  * GameObjectsDraw
  */

  /** timeDraw */
  function timeDraw(){
    c.save();
    c.fillStyle = 'white';
    c.font = '30px Arial';
    if (passTime >= FULL_TIME) {
      passTime = FULL_TIME;
      isTimeout = true;
    }
    c.fillText('时间:' + Math.ceil(FULL_TIME - passTime).toString(), screenWidth -120, 30);
    c.restore();
  }

  /** scoreDraw */
  function scoreDraw(){
    c.save();
    c.fillStyle = 'yellow';
    c.font = '30px Arial';
    c.fillText('积分:' + score.toString(), 10, 30); 
    c.restore();
  }

  /** backgroundDraw */
  function backgroundDraw() {
    c.save();
    c.clearRect(0, 0, screenWidth, screenHeight);
    c.drawImage(bg, 0, 0);
    c.restore();
  }

  /**
  * Handlers
  */
  function mousemoveHandler(e){
    var o = starsObject.isHit(new classes.Position(e.offsetX || e.pageX, e.offsetY || e.pageY));
    if (o) {
      pathObject.add(o.pos);
      //判断是不是特别的星座星星
      if (o.type !== 0)
        score += 2;
      else
        score++;
    }
  }

  /** gameControl */
  function startGame() {
    isPause = false;
    gameInterval = setInterval(gameloop, itv);
    cvs.addEventListener('mousemove', mousemoveHandler, false);
    myth.base.event.changeHandler({
        event: function(p) { return 'Pause'; }
      }, {
        start: startGame,
        stop: stopGame,
        gametype: type
    });

  }

  function stopGame() {
    isPause = true;
    clearInterval(gameInterval);
    cvs.removeEventListener('mousemove', mousemoveHandler, false);
  }

  /**
  * gameloop 
  */
  function gameloop() {
    backgroundDraw();
    pathObject.draw();
    starsObject.draw();
    timeDraw();
    scoreDraw();
    passTime += itv / 1000;
    if (starsObject.remainNumber() === 0) {
      starsObject = new classes.Stars(STARS_NUMBER);
      pathObject = new classes.Path();
    }
    if (isTimeout) {
      stopGame();
      myth.menu.show('Gameover', {score: score, gametype: type});
    }
  }

  startGame();
};
