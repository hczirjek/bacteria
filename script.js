window.onload = function () {
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

  var informationArr = [];
  //declare all variables globally
  var consumedEnergy = 0.05;
  var initialEnergy = 128;
  var nutrition = [];
  var bacterium = [];
  var bacteriumInit = [];
  var directions = [	{x:0,y:-1}, //up
                      {x:1,y:0}, //right
                      {x:0,y:1}, //down
                      {x:-1,y:0} ]; //left
  var autoplay = false;
  var interval;
  var time = 0; // = age
  var nrOfEpoch = 0;

  var bactInfo = this.document.getElementById("textbox");

  var ctx;
  var canvas = document.getElementById('viewport');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = config.view.width;
  ctx.canvas.height = config.view.height;
  //ctx.fillStyle = 'rgb(90,40,40)';
  // canvas background color
  ctx.fillStyle = 'rgb(234,208,168)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
					
  //draw initial bacteria
  for (var i = 0; i < init.nrBacteria; i++) {
    var xRand = Math.floor(Math.random() * canvas.width);
    var yRand = Math.floor(Math.random() * canvas.height);

    //bacteria
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
      collectedFood: 0,
      childrenID: [],
      currentDir: "",
      mostLikelyDir: ""
    };

    b.p.push(b.p1);
    b.p.push(b.p2);
    b.p.push(b.p3);
    b.p.push(b.p4);
    b.sum = b.p1 + b.p2 + b.p3 + b.p4;
    var max = Math.max(b.p1,b.p2,b.p3,b.p4);
    if(max == b.p1){
      b.mostLikelyDir = "up";
    } else if(max == b.p2){
      b.mostLikelyDir = "right";
    } else if(max == b.p3){
      b.mostLikelyDir = "left";
    } else if(max == b.p4){
      b.mostLikelyDir = "down";
    }

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

    //nutrition
    var n = {
      x: nutritionX,
      y: nutritionY,
      //val: Math.random() * 5
	    val: 40
    }
    nutrition.push(n);

    drawNutrition(ctx, n.x, n.y, n.val);
  }

  // X1 button
  var x1 = document.getElementById("step-button");
  x1.addEventListener('click', function () {

    redrawBacteria();

  });

  //AutoPlay button
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
	try {
    //red square on bacteria to see it's position
    //ctx.strokeStyle = 'rgb(' + (255 - bacterium[ind].energy) + ', 0, 0)';
    ctx.strokeStyle = 'rgb(' + (255 - bacterium[ind].energy) + ', ' +
    (255 - bacterium[ind].energy) + ',' + (255 - bacterium[ind].energy) + ')';

    //ctx.font = "5px Arial";
    //ctx.fillText("bact" + ind,x-7.5,y-2);
	
    ctx.fillStyle = 'rgb(' + (255 - bacterium[ind].energy) + ', ' +
      (255 - bacterium[ind].energy) + ',' + (255 - bacterium[ind].energy) + ')';
    ctx.rect(x,y,3,3);
    ctx.fillRect(x, y, 3, 3);
	
  informationArr[ind] = "Bacteria: Nr " + bacterium[ind].nr +
  "\n TendencyProp: " + bacterium[ind].p + 
  "\n Current Direction: " + bacterium[ind].currentDir + 
  "\n Most Likely Direction: " + bacterium[ind].mostLikelyDir + 
   "\n Energy: " + (Math.round((bacterium[ind].energy) * 100) / 100) +
    "\n Age: " + bacterium[ind].age +
     "\n Collected food: " + bacterium[ind].collectedFood +
      "\n Children(ID): " + bacterium[ind].childrenID + '\n';
	//document.getElementById("bactInfo").innerHTML += "Bacteria: Nr " + bacterium[ind].nr + ", Energy: " + bacterium[ind].energy + ", Age: " + bacterium[ind].age + ", Collected food: " + bacterium[ind].collectedFood + "<br />";
	
	}
	catch(err) {
		console.log("Warning: ", err.message);
	}
      ctx.stroke();
  }
  
  function redrawBacteria() {

    nrOfEpoch++;
	
	//document.getElementById("bactInfo").innerHTML = "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //background color
    ctx.fillStyle = 'rgb(234,208,168)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.globalAlpha = 1;
	
    //time++; // = age
    
    for (var i = 0; i < bacterium.length; i++) {
		var bact=bacterium[i];
		bact.age++;
		
		  if (bact.energy <= 0) {
		  //clear bacteria
			  console.log("bact with nr " + bact.nr + " dies at age " + bact.age); 
			  bacterium.splice(i, 1);
		  }

		  //last(winner) bacteria
		if(bacterium.length === 1){
			//console.log("last bacteria's attributes: ", bacteriumInit[bacterium[0].nr]);
			console.log("last bacteria's attributes: ", bacterium[0]);
					ctx.beginPath();
					ctx.fillStyle = "yellow";
					ctx.font = "15px Arial";
					ctx.fillText("WINNER",bacterium[0].x - 8,bacterium[0].y + 5);
			autoButton.click();
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
      if(directionId[i] == 0){
      bacterium[i].currentDir = "up";
      } else if(directionId[i] == 1){
        bacterium[i].currentDir = "right";
        } else if(directionId[i] == 2){
          bacterium[i].currentDir = "down";
          } else if(directionId[i] == 3){
            bacterium[i].currentDir = "left";
            }
		  
		  //check if bacteria is at the edge of the canvas
			if( ( (bact.x + dir.x < canvas.width) && (bact.x + dir.x > 0) ) && ( (bact.y + dir.y < canvas.height) && (bact.y + dir.y > 0) ) ){
				  bact.x += dir.x;
				  bact.y += dir.y;
				  bact.energy -= consumedEnergy;
			} else {
				  bact.energy -= consumedEnergy;
			}
		
		drawBacteria(ctx, i, bact.x, bact.y);
		
		//check if bacteria reached maximum energy level
		//if yes => divide
		var newBact = divide( bact );
			/*if(newBact != null){
			  //console.log("new bact:", newBact);
			}*/
		
		//check if bacteria touched any nutrition
		 for(var z=0;z<nutrition.length;z++){
			nutrition[z] = checkForCollision(bact,nutrition[z]); 
		 }

    } //END OF FOR

	  bactInfo.innerHTML = informationArr.join("\n");
	
    //redraw nutrition
    //if nutrition is eated => nutrition color = red
    if(nrOfEpoch>=250){
    for (a = 0; a < nutrition.length; a++) {
        nutrition.forEach(nutr => {
          if(nutr.val == 0){
            nutrition.splice(nutrition.indexOf(nutr), 1);
          }
        });
      
        nrOfEpoch = 0; //reset nr of epoch
        drawNutrition(ctx, nutrition[a].x, nutrition[a].y, nutrition[a].val, nrOfEpoch);
      }

      //add new nutrition
    for (var a2 = 0; a2 < 50; a2++) {
      var nutritionX = Math.floor(Math.random() * canvas.width);
      var nutritionY = Math.floor(Math.random() * canvas.height);

    //nutrition
    var n = {
      x: nutritionX,
      y: nutritionY,
      //val: Math.random() * 5
	    val: 40
    }
    nutrition.push(n);
    drawNutrition(ctx, nutrition[a].x, nutrition[a].y, nutrition[a].val, nrOfEpoch);
    }

    } else {
      for (a = 0; a < nutrition.length; a++) {
			  drawNutrition(ctx, nutrition[a].x, nutrition[a].y, nutrition[a].val, nrOfEpoch);
		  }
    }
	
  }

  function drawNutrition(ctx, x, y, v, nrOfEpoch) {
    ctx.beginPath();
    ctx.strokeStyle= v!=0?"green":"red";

    ctx.rect(x, y, 1, 1);
    ctx.stroke();
  }
  
	function checkForCollision(bact,nutr){
		if(Math.abs(bact.x - nutr.x)<=1 && Math.abs(bact.y - nutr.y)<=1){ 
      if(nutr.val != 0){
			bact.energy += nutr.val;
			nutr.val = 0;
			bact.collectedFood++;
					//console.log("bact" + bact.nr + "gets " + nutrition.val + "energy");
      }
    }
		
		return nutr;
	}
	
	function divide(bact){
		//if max energy => divide/create new bacteria
	if(bact.energy >= 255) {	
      console.log("bacteria with nr " + bact.nr + " divided");
      
      //new bacteria
			var b = {
			  x: bact.x,
			  y: bact.y,
			  p: [], // probabilities in which direction to go
			  energy: bact.energy / 2,
			  p1: Math.random(),
			  p2: Math.random(),
			  p3: Math.random(),
			  p4: Math.random(),
			  nr: bacterium.length,
			  age: 0,
        collectedFood: 0,
        childrenID: [],
        currentDir: "",
        mostLikelyDir: ""
			};

			b.p.push(b.p1);
			b.p.push(b.p2);
			b.p.push(b.p3);
			b.p.push(b.p4);
      b.sum = b.p1 + b.p2 + b.p3 + b.p4;
      var max = Math.max(b.p1,b.p2,b.p3,b.p4);
      if(max == b.p1){
        b.mostLikelyDir = "up";
      } else if(max == b.p2){
        b.mostLikelyDir = "right";
      } else if(max == b.p3){
        b.mostLikelyDir = "left";
      } else if(max == b.p4){
        b.mostLikelyDir = "down";
      }

			bacterium.push(b);
      
      //parent bact energy reset
      bact.energy = bact.energy / 2;
      bact.childrenID.push(b.nr);

			//console.log("New bact: " + bacterium[bacterium.length] );
			return b;
	}
}

//Save Bacteria information to File
(function () {
  var textFile = null,
    makeTextFile = function (text) {
      var data = new Blob([text], {type: 'text/plain'});
  
      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
  
      textFile = window.URL.createObjectURL(data);
  
      return textFile;
    };
  
  
    var create = document.getElementById('create'),
      textbox = document.getElementById('textbox');
  
    create.addEventListener('click', function () {
      var link = document.getElementById('downloadlink');
      link.href = makeTextFile(textbox.value);
      link.style.display = 'block';
    }, false);
  })();

}
