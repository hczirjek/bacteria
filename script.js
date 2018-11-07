window.onload = function () {
  //var drawOptions = {};
  var config = {
    view: {
      width: 1024.0,
      height: 768.0
    }
  };

  var init = {
    nrBacteria: 32,
	  nrNutrition: 5000
  }
  //var probabilities = [];

  var ctx;
  var canvas = document.getElementById('viewport');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = config.view.width;
  ctx.canvas.height = config.view.height;
  //ctx.fillStyle = 'rgb(90,40,40)';
  // canvas background color
  ctx.fillStyle = 'rgb(234,208,168)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var consumedEnergy = 0.2;
  var initialEnergy = 128;
  var nutrition = [];
  var bacterium = [];
  var bacteriumInit = [];
  var directions = [	{x:0,y:-1}, //up
                      {x:1,y:0}, //right
                      {x:0,y:1}, //down
                      {x:-1,y:0} ]; //left
					
  //draw initial bacteria
  for (var i = 0; i < init.nrBacteria; i++) {
    var xRand = Math.floor(Math.random() * canvas.width);
    var yRand = Math.floor(Math.random() * canvas.height);

    var b = {
      x: xRand,
      y: yRand,
      p: [], // probabilities in which direction to go
      energy: initialEnergy,
      //energy: Math.floor(Math.random() * 255 + 1 ),
      p1: Math.random(), //probability to go up
      p2: Math.random(), //probability to go right
      p3: Math.random(),
      p4: Math.random(),
      nr: i, // identificator of each bacteria
      age: 0,
      collectedFood: 0
    };

    b.p.push(b.p1);
    b.p.push(b.p2);
    b.p.push(b.p3);
    b.p.push(b.p4);
	  b.sum = b.p1 + b.p2 + b.p3 + b.p4;
    bacterium.push(b);

    drawBacteria(ctx, i, b.x, b.y);
  }

  bacteriumInit = new Array(); // I use bacteriumInit to see the initialEnergy when all bacteria is dead
  for(var x=0;x<bacterium.length;x++){
    bacteriumInit[x] = bacterium[x];
    bacteriumInit[x].initialEnergy = bacterium[x].energy;
  }

    // draw nutrition (green color)
  for (var a = 0; a < init.nrNutrition; a++) {
    var nutritionX = Math.floor(Math.random() * canvas.width);
    var nutritionY = Math.floor(Math.random() * canvas.height);

    var n = {
      x: nutritionX,
      y: nutritionY,
      //val: Math.random() * 5
	val: 40
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
      interval = setInterval(redrawBacteria, 0);
    } else {
      clearInterval(interval);
      interval = null;
    }

  });

  function drawBacteria(ctx, ind, x, y) {
    ctx.beginPath();
    //ctx.strokeStyle = "black";

    //red square on bacteria to see it's position
    ctx.strokeStyle = 'rgb(' + (255 - bacterium[ind].energy) + ', ' +
      (255 - bacterium[ind].energy) + ',' + (255 - bacterium[ind].energy) + ')'; //'rgb(' + (255 - bacterium[ind].energy) + ', 0, 0)';

    //ctx.font = "5px Arial";
    //ctx.fillText("bact" + ind,x-7.5,y-2);
	
    ctx.fillStyle = 'rgb(' + (255 - bacterium[ind].energy) + ', ' +
      (255 - bacterium[ind].energy) + ',' + (255 - bacterium[ind].energy) + ')';
    ctx.rect(x,y,3,3);
    ctx.fillRect(x, y, 3, 3);
      ctx.stroke();
    /*ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.rect(x-2, y-2, 4, 4);
    ctx.stroke();*/
  }

  var time = 0;
  
  function redrawBacteria() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //background color
    ctx.fillStyle = 'rgb(234,208,168)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.globalAlpha = 1;
	
    time++; // = age
    
    for (var i = 0; i < bacterium.length; i++) {
	  var bact=bacterium[i];
	  
	  if (bact.energy <= 0) {
      //clear bacteria
		  bact.age = time;
		  console.log("bact with nr " + bact.nr + " dies at age " + bact.age); 
          bacterium.splice(i, 1);

      //last(winner) bacteria
		   if(bacterium.length === 1){
				console.log("last bacteria's attributes: ", bacteriumInit[bacterium[0].nr]);
				ctx.beginPath();
				ctx.fillStyle = "yellow";
				ctx.font = "15px Arial";
				ctx.fillText("WINNER",bacterium[0].x - 8,bacterium[0].y + 5);
				autoButton.click();
      }
		    continue;
      }

    
	  var dirProbability = Math.random() * bact.sum;
    //var nr = 0, 
    var directionId = [];
    
    //recalculate direction of all bacteria in each epoch with discussed method
	  var v = 0;
	  for(var j=0;j<=3;j++)
	  {
		  v += bact.p[j];
		  if(dirProbability<=v)
		  {
			  directionId[i] = j;
			  break;
		  }
	  }
	  
      var dir = directions[directionId[i]];
      
      //check if bacteria is at the edge of the canvas
		  if( ( (bact.x + dir.x < canvas.width) && (bact.x + dir.x > 0) ) && ( (bact.y + dir.y < canvas.height) && (bact.y + dir.y > 0) ) ){
			  bact.x += dir.x;
			  bact.y += dir.y;
			  bact.energy -= consumedEnergy;
      } else {
			  bact.energy -= consumedEnergy;
		}
    
    //check if bacteria reached maximum energy level
    //if yes => divide
		var newBact = divide( bact );
		/*if(newBact != null){
		  //console.log("new bact:", newBact);
		}*/

      drawBacteria(ctx, i, bact.x, bact.y);
    
    //check if bacteria touched any nutrition
	  for(var z=0;z<nutrition.length;z++){
			nutrition[z] = checkForCollision(bact,nutrition[z]); 
		  }

    }

    //redraw nutrition
    //if nutrition is eated => nutrition color = red
    for (a = 0; a < init.nrNutrition; a++) {
		//if(nutrition[a].val != 0){
			drawNutrition(ctx, nutrition[a].x, nutrition[a].y, nutrition[a].val);
		//}
    }
  }

  function drawNutrition(ctx, x, y, v) {
    ctx.beginPath();
    ctx.strokeStyle= v!=0?"green":"red";
    ctx.rect(x, y, 1, 1);
    ctx.stroke();
  }

  /*function roll() {
    return Math.floor(Math.random() * 500 + 1);
  }*/

  /*function chooseNumbers() {
    var a = 0, b = 0, c = 0, d = 0;

    //while (a + b + c + d !== 1000) {
      a = roll();
      b = roll();
      c = roll();
      d = 1000 - (a+b+c);
    //}
    return [a, b, c, d];
  }*/
  
	function checkForCollision(bact,nutr){
		// I use the full size of each bacteria
			if(Math.abs(bact.x - nutr.x)<=3 && Math.abs(bact.y - nutr.y)<=3){ 
        bact.energy += nutr.val;
        bact.collectedFood++;
				//console.log("bact" + bact.nr + "gets " + nutrition.val + "energy");
				nutr.val = 0;
			}
		return nutr;
	}
	
	function divide(bact){
		//if max energy => divide/create new bacteria
		if(bact.energy >= 255) {	
			console.log("bacteria with nr " + bact.nr + " divided");
			var b = {
			  x: bact.x,
			  y: bact.y,
			  p: [], // probabilities in which direction to go
			  //energy: 128,
			  energy: bact.energy / 2,
			  p1: Math.random(),
			  p2: Math.random(),
			  p3: Math.random(),
			  p4: Math.random(),
			  nr: bacterium.length,
			  age: 0,
			  collectedFood: 0
			};

			b.p.push(b.p1);
			b.p.push(b.p2);
			b.p.push(b.p3);
			b.p.push(b.p4);
			b.sum = b.p1 + b.p2 + b.p3 + b.p4;
			bacterium.push(b);
			
			//parent bact energy reset
			bacterium[bact.nr].energy /= 2;
			
			//console.log("New bact: " + bacterium[bacterium.length] );
			return b;
		}
	}


}
