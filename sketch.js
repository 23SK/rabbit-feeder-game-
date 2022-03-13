const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine;
var world;
var ground, rope, fruit, fruitLink, rabbit;
var backgroundImg, rabbitImg, fruitImg, ropeCutImg;
var cutButton;
var blink, eat, sad;
var airSound,eatingSound,cuttingSound,ropeCutSound,sadSound,backgroundSound
var muteButton,airBlower;

function preload() {
  backgroundImg = loadImage("background.png");
  rabbitImg = loadImage("Rabbit-01.png");
  fruitImg = loadImage("melon.png")
  ropeCutImg = loadImage("cut_button.png");

  blink = loadAnimation("blink_1.png", "blink_2.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  blink.playing = true;
  blink.looping = true;
  eat.playing = true;
  eat.looping = false;
  sad.playing = true;
  sad.looping = false;
  blink.frameDelay = 15;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  airSound = loadSound("air.wav");
  eatingSound = loadSound("eating_sound.mp3");
  ropeCutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  backgroundSound = loadSound("sound1.mp3");
}

function setup() {
  createCanvas(500, 700);
  frameRate(80);
  engine = Engine.create();
  world = engine.world;

  ground = new Ground(200, 680, 600, 20);
  rope = new Rope(7, { x: 250, y: 15 });
  var fruitOptions = {
    density: 0.001,
  }
  fruit = Bodies.circle(250, 150, 25, fruitOptions);
  Composite.add(rope.body, fruit);

  fruitLink = new Link(rope, fruit);

  cutButton = createImg("cut_button.png");
  cutButton.position(225, 10)
  cutButton.size(50, 50)
  cutButton.mouseClicked(ropeCut);

  muteButton = createImg("mute.png");
  muteButton.position(450,50)
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);

  airBlower = createImg("balloon.png");
  airBlower.position(100,250);
  airBlower.size(100,100);
  airBlower.mouseClicked(blow);

  rabbit = createSprite(450, 620, 15, 15);
  rabbit.addImage(rabbitImg);
  rabbit.scale = 0.2
  rabbit.addAnimation("blinking", blink);
  rabbit.addAnimation("eating", eat);
  rabbit.addAnimation("crying", sad);
  rabbit.changeAnimation("blinking", blink);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

 backgroundSound.play();
}

function draw() {
  background(backgroundImg);
  /*if(!backgroundSound.isPlaying()){
    backgroundSound.play();
    backgroundSound.setVolume(0.2);
  }*/

  Engine.update(engine);
  
  ground.show();
  rope.show();

  if (fruit != null) {
    imageMode(CENTER)
    image(fruitImg, fruit.position.x, fruit.position.y, 75, 75);
  }

  if (collide(fruit, rabbit)) {
    rabbit.changeAnimation("eating");
    eatingSound.play();
  }

  if (collide(fruit, ground.body)) {
    rabbit.changeAnimation("crying");
    sadSound.play();
  }

  drawSprites();
}

function ropeCut() {
  rope.break();
  fruitLink.detach();
  fruitLink = null;
  ropeCutSound.play();
}

function collide(body, sprite) {
  if (fruit != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(world, fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}

function mute(){
if(backgroundSound.isPlaying()){
  backgroundSound.stop();
}
else{
  backgroundSound.play();
}
}

function blow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
}