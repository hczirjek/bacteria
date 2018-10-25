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
	nrNutrition: 5000
  }
  var probabilities = [];

  var ctx;
  var canvas = document.getElementById('viewport');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = config.view.width;
  ctx.canvas.height = config.view.height;
  //ctx.fillStyle = 'rgb(90,40,40)';
  ctx.fillStyle = 'rgb(234,208,168)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var consumedEnergy = 0.05;
  var divisionEnergy = 100;
  var nutrition = [];
  var bacterium = [];
  var bacteriumInit = [];
  var directions =[	{x:0,y:-1},
					{x:1,y:0},
					{x:0,y:1},
					{x:-1,y:0} ];
					
  //draw initial bacteria
  for (var i = 0; i < init.nrBacteria; i++) {
    var xRand = Math.floor(Math.random() * canvas.width);
    var yRand = Math.floor(Math.random() * canvas.height);

    var b = {
      x: i==0? canvas.width/2 : xRand,
      y: i==0? canvas.height/2 : yRand,
      p: [], // probabilities in which direction to go
      energy: divisionEnergy - 10,
      //energy: Math.floor(Math.random() * 255 + 1 ),
	  p1: i==0? 0.8 : Math.random(),
	  p2: i==0? 0.8 : Math.random(),
	  p3: i==0? 0.8 : Math.random(),
	  p4: i==0? 0 : Math.random(),
      nr: i,
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

  bacteriumInit = new Array();
  for(var x=0;x<bacterium.length;x++){
    bacteriumInit[x] = bacterium[x];
    bacteriumInit[x].initialEnergy = bacterium[x].energy;
  }

  for (var a = 0; a < init.nrNutrition; a++) {
    var nutritionX = Math.floor(Math.random() * canvas.width);
    var nutritionY = Math.floor(Math.random() * canvas.height);

    var n = {
      x: nutritionX,
      y: nutritionY,
      //val: Math.random() * 5
	  val: 1
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
    ctx.strokeStyle = 'rgb(' + (255 - bacterium[ind].energy) + ',0, 0)';
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
	ctx.fillStyle = 'rgb(234,208,168)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
    ctx.beginPath();
    ctx.globalAlpha = 1;
	
	 time++;
    for (var i = 0; i < bacterium.length; i++) {
	  
	  var bact=bacterium[i];
	  
	 
	  
	  
	  //console.log("length:",bacterium.length);
	  
	  if (bact.energy <= 0) {
        //clear bacteria
		  bact.age = time;
		  console.log("bact with nr " + bact.nr + " dies at age " + bact.age); 
          bacterium.splice(i, 1);
		   if(bacterium.length === 1){
				console.log("last bacteria's attributes: ", bacteriumInit[bacterium[0].nr]);
				ctx.beginPath();
				ctx.fillStyle = "yellow";
				ctx.font = "15px Arial";
				ctx.fillText("WINNER",bacterium[0].x - 8,bacterium[0].y + 5);
				autoButton.click();
      }
		  continue;
          //console.log("removed, array:", bacterium);
      }

	  var dirProbability = Math.random() * bact.sum;
      var nr = 0, directionId = [];
	  
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
		  if( ( (bact.x + dir.x < canvas.width) && (bact.x + dir.x > 0) ) && ( (bact.y + dir.y < canvas.height) && (bact.y + dir.y > 0) ) ){
			  bact.x += dir.x;
			  bact.y += dir.y;
			  bact.energy -= consumedEnergy;
        } else {
			  bact.energy -= consumedEnergy;
		}
		
		var newBact = divide( bact );
		if(newBact != null){
		  //console.log("new bact:", newBact);
		}

      drawBacteria(ctx, i, bact.x, bact.y);
	  
	  for(var z=0;z<nutrition.length;z++){
			nutrition[z] = checkForCollision(bact,nutrition[z]);
		}

     
	  
	  
    }

    for (a = 0; a < init.nrNutrition; a++) {
		//if(nutrition[a].val != 0){
			drawNutrition(ctx, nutrition[a].x, nutrition[a].y, nutrition[a].val);
		//}
    }
  }

  function drawNutrition(ctx, x, y, v) {
    ctx.beginPath();

    ctx.strokeStyle =v!=0?"green":"red";
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
		
			if(Math.abs(bact.x - nutr.x)<=2 && Math.abs(bact.y - nutr.y)<=2){
				bact.energy += nutr.val;
				//console.log("bact" + bact.nr + "eats " + nutrition.val + "kcal");
				nutr.val = 0;
			}
		return nutr;
	}
	
	function divide(bact){
		
		if(bact.energy >= divisionEnergy) {
			
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