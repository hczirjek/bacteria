// Code goes here

window.onload = function () {
  var drawOptions = {};
  var config = {
    view: {
      width: 1024.0,
      height: 768.0
    }
  };

  var init = {
    nrBacteria: 32
  }
  var probabilities = [];

  var bacteria = {
    x: 0,
    y: 0,
    //where to go
    d: [], //direction (4 directions)
    energy: 128,
    probabilities: [],
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0
  }

  var ctx;
  var canvas = document.getElementById('viewport');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = config.view.width;
  ctx.canvas.height = config.view.height;

  var nutrition = [];
  var bacterium = [];
  //draw initial bacteria
  for (var i = 0; i < init.nrBacteria; i++) {
    var xRand = Math.floor(Math.random() * canvas.width);
    var yRand = Math.floor(Math.random() * canvas.height);
    //var b = null;
    probabilities = chooseNumbers();

    var b = {
      x: xRand,
      y: yRand,
      d: [], //where to go
      energy: 128,
      p1: probabilities[0],
      p2: probabilities[1],
      p3: probabilities[2],
      p4: probabilities[3]
    };

    b.d.push(b.p1);
    b.d.push(b.p2);
    b.d.push(b.p3);
    b.d.push(b.p4);
    bacterium.push(b);

    drawBacteria(ctx, i, b.x, b.y);
  }

  for (var a = 0; a < 50; a++) {
    var nutritionX = Math.floor(Math.random() * canvas.width);
    var nutritionY = Math.floor(Math.random() * canvas.height);

    var n = {
      x: nutritionX,
      y: nutritionY,
      val: Math.random() * 5
    }
    nutrition.push(n);

    drawNutrition(ctx, n.x, n.y);
  }

  var x1 = document.getElementById("step-button");
  x1.addEventListener('click', function () {

    redrawBacteria();

  });

  var autoplay = false;
  var interval;
  var autoButton = document.getElementById("auto-button");
  autoButton.addEventListener('click', function () {

    autoplay = !autoplay;

    if (autoplay === true) {
      interval = setInterval(redrawBacteria, 100);
    } else {
      clearInterval(interval);
      interval = null;
    }

  });

  function drawBacteria(ctx, ind, x, y) {
    var color = 
    //ctx.strokeStyle = "black";
    ctx.strokeStyle = 'rgb(' + bacterium[ind].energy + ', ' +
    bacterium[ind].energy + ',' + bacterium[ind].energy + ')';
    //ctx.font = "5px Arial";
    //ctx.fillText("bact" + ind,x-7.5,y-2);
    ctx.rect(x, y, 3, 3);
    ctx.stroke();
  }

  function redrawBacteria() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.globalAlpha = 1;

    for (var i = 0; i < bacterium.length; i++) {

      //var max = Math.max(...bacterium[i].d);

      var dirProbability = Math.floor(Math.random() * 10 + 1);
      var counter = 0, directionId = [];

      bacterium[i].d.sort();
      var j = 0;

      if (bacterium[i].d[0] < dirProbability) {
        while (counter < dirProbability) {
          counter += bacterium[i].d[j];
          j++;
        }
        directionId[i] = j;
      } else {
        directionId[i] = 1;
      }

      if (directionId[i] === 1) {
        //up
        bacterium[i].x += 0;
        bacterium[i].y -= 1;
      }
      if (directionId[i] === 2) {
        //right
        bacterium[i].x += 1;
        bacterium[i].y += 0;
      }
      if (directionId[i] === 3) {
        //down
        bacterium[i].x += 0;
        bacterium[i].y += 1;
      }
      if (directionId[i] === 4) {
        //left
        bacterium[i].x -= 1;
        bacterium[i].y += 0;
      }

      drawBacteria(ctx, i, bacterium[i].x, bacterium[i].y);
    }

    for (a = 0; a < 50; a++) {
      drawNutrition(ctx, nutrition[a].x, nutrition[a].y);
    }

  }

  function drawNutrition(ctx, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.rect(x, y, 3, 3);
    ctx.stroke();
  }

  function roll() {
    return Math.floor(Math.random() * 8 + 1);
  }

  function chooseNumbers() {
    var a = 0, b = 0, c = 0, d = 0;

    while (a + b + c + d !== 10) {
      a = roll();
      b = roll();
      c = roll();
      d = roll();
    }
    return [a, b, c, d];
  }


}


