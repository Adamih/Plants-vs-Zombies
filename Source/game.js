
function start(){ // configuration variables mostly

	plants = [[],[],[],[],[],[]];
	zombies = [[],[],[],[],[],[]];
	seeds = [[],[],[],[],[],[]];
	
	mapCfg = {
		BorderLine: 200,
		laneHeight: totalHeight/2,
		laneAmmount: 5,
		SpawnRate: 100,
		zombiesCrossed: 0,
		timeCounter: 0,
		time: 0
	}
	
	zombieCfg = {
		startX: totalWidth + 80,
		xSpeed: 5
	}
	
	plantCfg = {
		startX: 50,
		fireRate: 30,
		spread: 5
	}
	
	seedCfg = {
		startX: 50,
		xSpeed: 6,
		size: 10,
		color: "lightgreen"
	}
	
	spawnPlant();
	
}

// ----------------- define lane arrays ----------------------------


// ----------------- plants draw and logic -------------------------

function arrExist(arr){
	return ( typeof arr != 'undefined' && arr instanceof Array );
}

function drawPlant(x, y, lane){
	save();
	translate(x, y);
	circle(0, 17, 12, "white"); // bottom
	circle(15, 12, 12, "white"); // bottom right
	circle(17, -5, 12, "white"); // right
	circle(7, -17, 12, "white"); // top right
	circle(-7, -17, 12, "white"); // top left
	circle(-17, -5, 12, "white"); // left
	circle(-15, 12, 12, "white"); // bottom left
	
	circle(0, 0, 18, "yellow"); // plant body
	
	rectangle(-8, -9, 4, 4, "black"); // eyes
	rectangle(4, -9, 4, 4, "black");
	
	rectangle(-12, 2, 4, 4, "black"); // smile
	rectangle(8, 2, 4, 4, "black");
	rectangle(4, 6, 4, 4, "black");
	rectangle(0, 6, 4, 4, "black");
	rectangle(-4, 6, 4, 4, "black");
	rectangle(-8, 6, 4, 4, "black");
	
	text(-1, 50, 12, lane, "red");
	
	restore();
	
}

function Plant(startY, lane){
	this.x = plantCfg.startX;
	this.y = startY;
	this.alive = true;
	this.lane = lane;
	this.i = 0;
	this.shoot = function(){
		this.i++;
		if (this.i / plantCfg.fireRate >= 1){
			this.i = 0;
			spawnSeed(this.y, this.lane);
		}
	}
	
	this.update = function(){
		this.shoot();
		drawPlant(this.x, this.y, this.lane);
		
		
	}
}

function spawnPlant(){
	startLane = random(1,mapCfg.laneAmmount); // Choosing a random lane
	startYMax = (totalHeight/mapCfg.laneAmmount) * startLane;
	startYMin = (totalHeight/mapCfg.laneAmmount) * (startLane - 1);
	startY = random(startYMin+50, startYMax-50); // Y coordinated are generated

	plants[startLane-1].push(new Plant(startY, startLane));
}
// -----------------------------------------------------------------


// ----------------- seedProjectile draw and logic -----------------

function drawSeed(x, y, lane){
	save();
	translate(x, y);
	picture(-25, -25, "leafers-seed.png");
	text(-4, 3, 8, lane, "red");
	restore();
}

function Seed(startY, lane){
	this.x = seedCfg.startX;
	this.y = startY;
	this.xSpeed = seedCfg.xSpeed;
	this.alive = true;
	this.lane = lane;
	this.spread = random(-plantCfg.spread, plantCfg.spread);
	
	this.update = function(){
		this.x += this.xSpeed;
		this.y += this.spread / 30;
		
		drawSeed(this.x, this.y, this.lane);
	}
	
}
function spawnSeed(startY, startLane){
		seeds[startLane-1].push(new Seed(startY, startLane));
}



// -----------------------------------------------------------------


// ----------------- zombie draw and logic -------------------------
function drawZombie(x, y, lane){
	save();
	translate(x, y);
	rectangle(3, 30, 23, 65, "lightgreen");
	rectangle(3, 15, 23, 65, "gray");
	circle(15, 0, 20, "lightgreen");
	circle(0, 0, 3, "red");
	rectangle(-35, 20, 30, 14, "lightgreen");
	rectangle(-20, 20, 30, 14, "gray");
	
	text(10, 50, 12, lane, "red");
	restore();
}

function Zombie(startY, xSpeed, lane){
	this.x 		= zombieCfg.startX;
	this.y 		= startY;
	this.xSpeed	= xSpeed;
	this.alive 	= true;
	this.crossed = false;
	this.lane 	= lane;
	
	this.update = function(){
		this.x -= this.xSpeed;
		
		drawZombie(this.x, this.y, this.lane);
		
		if (this.x < mapCfg.BorderLine && !this.crossed){
			this.crossed = true;
			mapCfg.zombiesCrossed++;
		}
		
		if (this.x < 0){
			this.alive = false;
		}
		
	}
}

function spawnZombie(){
	startLane = random(1, mapCfg.laneAmmount); // Choosing a random lane
	startYMax = (totalHeight/mapCfg.laneAmmount) * startLane;
	startYMin = (totalHeight/mapCfg.laneAmmount) * (startLane - 1);
	startY = random(startYMin + 50, startYMax - 100); // Y coordinated are generated
	
	zombies[startLane-1].push(new Zombie(startY, zombieCfg.xSpeed, startLane));

	
}

// -------------------------------------------------------------------

// ---------------------- game draw and logic ------------------------

function drawMap(){
	fill("green");

	line(mapCfg.BorderLine, 0, mapCfg.BorderLine, totalHeight, 2, "white");
	
	for (i = 1; i <= mapCfg.laneAmmount; i++){
		line(0, totalHeight/mapCfg.laneAmmount*i, totalWidth, totalHeight/mapCfg.laneAmmount*i, 2, "white");
		text(totalWidth-200, (totalHeight/mapCfg.laneAmmount*i)-100, 24, "lane "+i, "white");
	
	}
}


function gameLogic(){
	
	if (random(1, 100) == 100){
		spawnZombie();
	}
	
	// i = lane | j = zombie object | k = plant object
	
	// zombie update
	for (i = 0; i < zombies.length; i++)
		for (j = 0; j < zombies[i].length; j++){
			
			for (k = 0; k < plants[i].length; k++){
				if (distance(zombies[i][j], plants[i][k]) < 100){
					plants[i][k].alive = false;
				}
			} 
			
			if (zombies[i][j].alive){
					zombies[i][j].update();
			}
		}
	
	// plant update
	for (i = 0; i < plants.length; i++)
		for (j = 0; j < plants[i].length; j++){
			if (plants[i][j].alive){
				plants[i][j].update();
			}
		}
	
	
	for (i = 0; i < seeds.length; i++)
		for (j = 0; j < seeds[i].length; j++)
			if (zombies[i].length > 0)
				for (k = 0; k < zombies[i].length; k++){
					if (distance(seeds[i][j], zombies[i][k]))
						zombies[i][k].alive = false;
				}
				
				
			if (seeds[i][j].alive){
				seeds[i][j].update();
			}

	// time counter	
	mapCfg.timeCounter++; 
	if (mapCfg.timeCounter >= 30){
		mapCfg.timeCounter = 0;
		mapCfg.time++;
	}
	
	text(100, 50, 24, "Time: " + mapCfg.time, "red");
	text(350, 50, 24, "Zombies crossed: " + mapCfg.zombiesCrossed, "red");

	
}

// --------------------------------------------------------------------

function update(){
	drawMap();
	gameLogic();
};