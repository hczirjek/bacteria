window.onload = function () {
  var drawOptions = {};
  var config = {
    view: {
      width: 1024.0,
      height: 768.0
    }
  };

  var init = {
    nrBacteria: 32,
	nrNutrition: 3000
  }
  var probabilities = [];

  /*var bacteria = {
    x: 0,
    y: 0,
    //where to go
    d: [], //direction (4 directions)
    energy: 128,
    probabilities: [],
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
	sum : 0,
	speed: 0
  }*/

  var ctx;
  var canvas = document.getElementById('viewport');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = config.view.width;
  ctx.canvas.height = config.view.height;
  //ctx.fillStyle = 'rgb(90,40,40)';
  ctx.fillStyle = 'coral';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var nutrition = [];
  var bacterium = [];
  var bacteriumInit = [];
  var directions =[{x:0,y:-1},
					{x:1,y:0},
					{x:0,y:1},
					{x:-1,y:0}
					];
  //draw initial bacteria
  for (var i = 0; i < init.nrBacteria; i++) {
    var xRand = Math.floor(Math.random() * canvas.width);
    var yRand = Math.floor(Math.random() * canvas.height);
    //var b = null;
    //probabilities = chooseNumbers();

    var b = {
      x: xRand,
      y: yRand,
      p: [], // probabilities where to go
      //energy: 128,
      energy: Math.floor(Math.random() * 255 + 1 ),
	  p1: Math.random(),
	  p2: Math.random(),
	  p3: Math.random(),
	  p4: Math.random(),
      nr: i
    };

    b.p.push(b.p1);
    b.p.push(b.p2);
    b.p.push(b.p3);
    b.p.push(b.p4);
	b.sum = b.p1 + b.p2 + b.p3 + b.p4;
    bacterium.push(b);
	
	//console.log("sum:",bact.sum);

    drawBacteria(ctx, i, b.x, b.y);
  }

  bacteriumInit = new Array();
  for(var x=0;x<bacterium.length;x++){
    bacteriumInit[x] = bacterium[x];
    bacteriumInit[x].initialEnergy = bacterium[x].energy;
  }
  //console.log(bacteriumInit);

  for (var a = 0; a < init.nrNutrition; a++) {
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
      interval = setInterval(redrawBacteria, 50);
    } else {
      clearInterval(interval);
      interval = null;
    }

  });

  function drawBacteria(ctx, ind, x, y) {
    ctx.beginPath();
    //var color =
      //ctx.strokeStyle = "black";
      ctx.strokeStyle = 'rgb(' + (255 - bacterium[ind].energy) + ', ' +
      (255 - bacterium[ind].energy) + ',' + (255 - bacterium[ind].energy) + ')';
    //ctx.font = "5px Arial";
    //ctx.fillText("bact" + ind,x-7.5,y-2);
    ctx.rect(x, y, 3, 3);
    ctx.stroke();
  }

  function redrawBacteria() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
	//ctx.fillStyle = 'coral';
	//ctx.fillRect(0, 0, canvas.width, canvas.height);
	
    ctx.beginPath();
    ctx.globalAlpha = 1;
	
	
	var consumedEnergy = 0.5;
	

    for (var i = 0; i < bacterium.length; i++) {
		var bact=bacterium[i];
      //var max = Math.max(...bact.d);

      //var dirProbability = Math.floor(Math.random() * 1000 + 1);
	  var dirProbability = Math.random() * bact.sum;
	  //console.log("dirProb:",dirProbability);
      var nr = 0, directionId = [];

      //bact.d.sort();
      //var j = 0;
	  
	  var v = 0;
	  for(var j=0;j<=3;j++)
	  {
		  v+=bact.p[j];
		  if(dirProbability<=v)
		  {
			  directionId[i] = j;
			  //console.log("dirId:", directionId[i]);
			  break;
		  }
	  }
	  
	   //if ((bact.y < (canvas.height - 3)) && bact.y > 0) {
		  var dir =directions[directionId[i]];
		  if( ( (bact.x + dir.x < canvas.width) && (bact.x + dir.x > 0) ) && ( (bact.y + dir.y < canvas.height) && (bact.y + dir.y > 0) ) ){
          bact.x += dir.x;
          bact.y += dir.y;
          //bact.energy--;
		  bact.energy -= consumedEnergy;
        } else {
			bact.energy -= consumedEnergy;
		}

      drawBacteria(ctx, i, bact.x, bact.y);
	  
	  for(var z=0;z<nutrition.length;z++){
			nutrition[z] = checkForCollision(bact,nutrition[z]);
		}

      if (bact.energy === 0) {
        //clear bacteria
          bacterium.splice(i, 1);
          //console.log("removed, array:", bacterium);
      }

      if(bacterium.length === 1 && bacterium[0].energy===1){
        console.log("last bacteria's attributes: ", bacteriumInit[bacterium[0].nr]);
		ctx.beginPath();
		//ctx.globalAlpha = 1;
		ctx.fillStyle = "red";
		ctx.font = "15px Arial";
		ctx.fillText("WINNER",bacterium[0].x - 8,bacterium[0].y + 5);
        x1.click();
      }

    }

    for (a = 0; a < init.nrNutrition; a++) {
		if(nutrition[a].val != 0){
			drawNutrition(ctx, nutrition[a].x, nutrition[a].y);
		}
    }

  }

  function drawNutrition(ctx, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.rect(x, y, 1, 1);
    ctx.stroke();
  }

  function roll() {
    return Math.floor(Math.random() * 500 + 1);
  }

  function chooseNumbers() {
    var a = 0, b = 0, c = 0, d = 0;

    //while (a + b + c + d !== 1000) {
      a = roll();
      b = roll();
      c = roll();
      d = 1000 - (a+b+c);
    //}
    return [a, b, c, d];
  }
  
	function checkForCollision(bact,nutr){
		
			if(bact.x == nutr.x && bact.y == nutr.y){
				bact.energy += nutr.val;
				//console.log("bact" + bact.nr + "eats " + nutrition.val + "kcal");
				nutr.val = 0;
			}
		return nutr;
	}


}