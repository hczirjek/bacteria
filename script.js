// Code goes here

window.onload = function() {
  var drawOptions = {};
var config = {
  view: {
	width: 400.0,
	height: 400.0
  }
};

var init = {
  nrBacteria : 32
}

var bacteria = {
  x : 0,
  y : 0,
  //d : [0,1,2,3], // int nr, ex:1000, generate random
  //where to go
  d: [],
  energy: 128,
  p1 : 0,
  p2: 0,
  p3: 0,
  p4: 0
}


var colors = {
  yellow: [0xF0, 0xFF, 0x00],
  brown: [0x99, 0x4A, 0x2A]
}

//var d0Values = [0,1,2,3];

  var ctx;
  var canvas = document.getElementById('viewport');
  //console.log("test");
  ctx = canvas.getContext('2d');
  ctx.canvas.width=config.view.width;
  //console.log("asd",config.view.width);
  ctx.canvas.height=config.view.height;
 
  var bacterium = [];
  //draw initial bacteria
  for(var i=0;i<init.nrBacteria;i++){
	var xRand = Math.floor(Math.random() * canvas.width);
	var yRand = Math.floor(Math.random() * canvas.height);
	var nutritionX = Math.floor(Math.random() * canvas.width);
	var nutritionY = Math.floor(Math.random() * canvas.height);
	//var b = null;
	var b = {
      	x : xRand,
      	y : yRand,
      	//d : d0Values[Math.floor(Math.random() * d0Values.length)], // int nr, ex:1000, generate random
      	//where to go
      	d: [],
      	energy: 128,
      	p1 : Math.random(),
      	p2: Math.random(),
      	p3: Math.random(),
      	p4: Math.random(),
     	 
    	};

      	b.d.push(b.p1);
      	b.d.push(b.p2);
      	b.d.push(b.p3);
      	b.d.push(b.p4);
	//console.log("d,",b.d);
	bacterium.push(b);

	drawBacteria(ctx,i,b.x,b.y);
	drawNutrition(ctx,nutritionX,nutritionY);

}

var x1 = document.getElementById("step-button");
x1.addEventListener('click', function(){

  redrawBacteria();

});

var autoplay = false;
var interval;
var autoButton = document.getElementById("auto-button");
autoButton.addEventListener('click', function(){
  
autoplay = !autoplay;
  
  if(autoplay===true){
    interval = setInterval(redrawBacteria, 100);
  } else {
    clearInterval(interval);
    interval = null;
  }

});

function drawBacteria(ctx,ind,x,y)
{
  ctx.strokeStyle="black";
  //ctx.font = "5px Arial";
  //ctx.fillText("bact" + ind,x-7.5,y-2);
  ctx.rect(x,y,1,1);
  ctx.stroke();
}

function redrawBacteria(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.beginPath();
  ctx.globalAlpha = 1;

  for(var i=0; i<bacterium.length; i++){

  var max = Math.max( ...bacterium[i].d);
 
  if(bacterium[i].p0 === max){
  //left
  bacterium[i].x -= 1;
  bacterium[i].y += 0;
  }
  if(bacterium[i].p1 === max){
  //up
  bacterium[i].x += 0;
  bacterium[i].y -= 1;
  }
  if(bacterium[i].p2 === max){
  //right
  bacterium[i].x += 1;
  bacterium[i].y += 0;
  }
  if(bacterium[i].p4 === max){
  //down
  bacterium[i].x += 0;
  bacterium[i].y += 1;
  }

  drawBacteria(ctx,i,bacterium[i].x,bacterium[i].y);
  }
  
}

function drawNutrition(ctx, x, y){
  ctx.beginPath();
  ctx.strokeStyle="green";
  ctx.rect(x,y,1,1);
  ctx.stroke();
}
 
 
}


