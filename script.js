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
  var bacteriumInit = [];
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
      //energy: 128,
      energy: Math.floor(Math.random() * 255 + 1 ),
      p1: probabilities[0],
      p2: probabilities[1],
      p3: probabilities[2],
      p4: probabilities[3],
      nr: i
    };

    b.d.push(b.p1);
    b.d.push(b.p2);
    b.d.push(b.p3);
    b.d.push(b.p4);
    bacterium.push(b);

    drawBacteria(ctx, i, b.x, b.y);
  }

  bacteriumInit = new Array();
  for(var x=0;x<bacterium.length;x++){
    bacteriumInit[x] = bacterium[x];
    bacteriumInit[x].initialEnergy = bacterium[x].energy;
  }
  //console.log(bacteriumInit);

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
      ctx.strokeStyle = 'rgb(' + (255 - bacterium[ind].energy) + ', ' +
      (255 - bacterium[ind].energy) + ',' + (255 - bacterium[ind].energy) + ')';
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

      var dirProbability = Math.floor(Math.random() * 900 + 1);
      var nr = 0, directionId = [];

      bacterium[i].d.sort();
      var j = 0;

      //console.log("dirProb: ", dirProbability);

      if (bacterium[i].d[0] < dirProbability) {
        while (nr < dirProbability) {
          nr += bacterium[i].d[j];
          j++;
        }
        directionId[i] = j;
      } else {
        directionId[i] = 1;
      }

      if (directionId[i] === 1) {
        //up
        //console.log("up");
        if (bacterium[i].y < (canvas.height - 3) && bacterium[i].y > 0) {
          bacterium[i].x += 0;
          bacterium[i].y -= 1;
          bacterium[i].energy--;
        } else {
          //console.log("limit exceeded at bacteria:"+i);
          //down
          bacterium[i].x += 0;
          bacterium[i].y += 1;
          bacterium[i].energy--;
        }
      }
      if (directionId[i] === 2) {
        //right
        //console.log("right");
        if (bacterium[i].x < (canvas.width - 3) && bacterium[i].x > 0) {
          bacterium[i].x += 1;
          bacterium[i].y += 0;
          bacterium[i].energy--;
        } else {
          //console.log("limit exceeded at bacteria:"+i);
          //left
          bacterium[i].x -= 1;
          bacterium[i].y += 0;
          bacterium[i].energy--;
        }

      }
      if (directionId[i] === 3) {
        //down
        //console.log("down");
        if (bacterium[i].y < (canvas.height - 3) && bacterium[i].y > 0) {
          bacterium[i].x += 0;
          bacterium[i].y += 1;
          bacterium[i].energy--;
        } else {
          //console.log("limit exceeded at bacteria:"+i);
          //up
          bacterium[i].x += 0;
          bacterium[i].y -= 1;
          bacterium[i].energy--;
        }
      }
      if (directionId[i] === 4) {
        //left
        //console.log("left");
        if (bacterium[i].x < (canvas.width - 3) && bacterium[i].x > 0) {
          bacterium[i].x -= 1;
          bacterium[i].y += 0;
          bacterium[i].energy--;
        } else {
          //console.log("limit exceeded at bacteria:"+i);
          //right
          bacterium[i].x += 1;
          bacterium[i].y += 0;
          bacterium[i].energy--;
        }
      }

      drawBacteria(ctx, i, bacterium[i].x, bacterium[i].y);

      if (bacterium[i].energy === 0) {
        //clear bacteria
          bacterium.splice(i, 1);
          //console.log("removed, array:", bacterium);
      }

      if(bacterium.length === 1 && bacterium[0].energy===1){
        console.log("last bacteria's attributes: ", bacteriumInit[bacterium[0].nr]);
        x1.click();
      }

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
    return Math.floor(Math.random() * 500 + 1);
  }

  function chooseNumbers() {
    var a = 0, b = 0, c = 0, d = 0;

    while (a + b + c + d !== 1000) {
      a = roll();
      b = roll();
      c = roll();
      d = roll();
    }
    return [a, b, c, d];
  }


}