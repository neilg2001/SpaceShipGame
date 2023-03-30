// ===================== Fall 2022 EECS 493 Assignment 3 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==================================================
// ============ Page Scoped Globals Here ============
// ==================================================

// Div Handlers
let game_window;
let game_screen;
let onScreenAsteroid;
let shield_screen;

var tut = true; 
var danger = 20; 
var level = 1; 

// Difficulty Helpers
var easy = false;
var normal = true; 
var hard = false;  
var astProjectileSpeed; 
var spawnRate; 
var spawnId; 
var gameInterval;
var score_interval; 
var shield_interval;
var portal_interval;  
var sheild_on = false; 
var hit_animation = false; 
var shield_shown = false; 
var portal_shown = false; 

var count = 0; 

// Game Object Helpers
let currentAsteroid = 1;
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 10;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds

var ROCKET_MOVEMENT = 50;
var rocket; 
var maxPosX; 
var maxPosY;

var left_int; 
var right_int; 
var up_int; 
var down_int; 

var die_sound = new Audio("/src/audio/die.mp3");
var item_sound = new Audio("/src/audio/collect.mp3");


// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;

var hit = false; 
var score; 
var KEYS = {
  left: 37, 
  right: 39, 
  up: 38,
  down: 40,
  spacebar: 32,
  shift: 16
}

// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
  // ====== Startup ====== 
  game_window = $('.game-window');
  game_screen = $("#actual_game");
  game = $("#game");
  onScreenAsteroid = $('.curAstroid');
  setting_screen = $("#settings");
  tutorial_screen = $("#tutorial");
  ready_screen = $("#get_ready");
  rocket = $("#rocket_id");
  shield_screen = $("#shield");
  portal_screen = $("#portal");

  game_over_screen = $("#game_over");

  $("#butt2").toggleClass("highlight");

  // TODO: ADD MORE
  shield_screen.hide();
  portal_screen.hide(); 
  game.hide();
  game_screen.hide();
  setting_screen.hide();
  tutorial_screen.hide();
  ready_screen.hide(); 
  game_over_screen.hide();
  // $(window).keydown(keyPressRouter); 
  maxPosX = 1280 - rocket.width(); 
  maxPosY = 720 - rocket.height();  


});

// TODO: ADD YOUR FUNCTIONS HERE
//--------------------------------------------
//  Functions for the game menus and startup
//--------------------------------------------

function tutorial_click(){
  $('#tutorial').show(); 
  $('#main_menu').hide();
  clearInterval(spawnId); 
  tut = false;  
}

function check_tut(){
  if(tut){
    tutorial_click();
  }
  else{
    ready_click(); 
  }
}

function ready_click(){
  clearInterval(spawnId);
  clearInterval(score_interval);
  clearInterval(shield_interval);
  clearInterval(portal_interval);
  sheild_on = false; 
  PERSON_SPEED = 10; 
  level = 1; 
  removeAsteroids();
  game.hide();
  game_screen.hide();  
  ready_screen.show(); 
  setTimeout(() => {
    actual_game(); 
  }, 3000);

  $('#main_menu').hide(); 
  $('#tutorial').hide(); 
  game.show();
  ready_screen.show();
  setup(); 
}

function setting_click(){
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;
  
  slider.oninput = function() {
    output.innerHTML = this.value;
    die_sound.volume = this.value / 100; 
    item_sound.volume = this.value / 100; 
    // soundManager.setVolume('mySound',slider.value);  
  }
  setting_toggles(); 
  $('#settings').show();
  game.hide();  
}

function setting_close(){
  $('#settings').hide(); 
}

function game_over(){
  document.getElementById("final_score").innerHTML = score; 
  $('#game_over').show(); 
  game.hide(); 
}

function actual_game(){
  ready_screen.hide();
  $('#actual_game').show(); 
  start(); 
}

function start_over(){
  if(count == 134){
    $('#game_over').hide(); 
    $('#main_menu').show();
  }
}


function shield(){
  let x = getRandomNumber(0 + shield_screen.width(), 1280 - shield_screen.width());
  let y = getRandomNumber(0 + shield_screen.height(), 720 - shield_screen.height());

  shield_screen.css("left", 1280 - x); 
  shield_screen.css("top", 720 - y); 

  if(sheild_on == false){
    shield_screen.show();
    shield_shown = true; 
  }
  setTimeout(() => {
    shield_screen.hide(); 
    shield_shown = false; 
    }, 5000);
}

function portal(){
  let x = getRandomNumber(0 + portal_screen.width(), 1280 - portal_screen.width());
  let y = getRandomNumber(0 + portal_screen.height(), 720 - portal_screen.height());

  portal_screen.css("left", 1280 - x); 
  portal_screen.css("top", 720 - y); 

  portal_screen.show();
  portal_shown = true;  

  setTimeout(() => {
    portal_screen.hide(); 
    portal_shown = false; 
    }, 5000);
}

function start(){
  spawnId = setInterval(spawn, spawnRate);
  score_interval = setInterval(updateScore, 500);
  shield_interval = setInterval(shield, 15000); 
  portal_interval = setInterval(portal, 20000); 
  
} 

function updateScore(){
  if(hit_animation == false){
    document.getElementById("score_num").innerHTML = parseInt(document.getElementById("score_num").innerHTML) + 40;
    score = document.getElementById("score_num").innerHTML
  }
}

function removeAsteroids(){
  for(let i = 0; i < currentAsteroid; i++){
    $('#a-' + i).remove(); 
    }
}

//--------------------------------------------
// Functions for moving the rocketship
//--------------------------------------------
function move_left(){
  var newPos = parseInt(rocket.css("left")) - PERSON_SPEED; 
  if (newPos < 0) {
    newPos = 0; 
  }
  rocket.css("left", newPos); 
}

function move_up(){
  var newPos = parseInt(rocket.css("top")) - PERSON_SPEED; 
      if (newPos < 0) {
        newPos = 0; 
      }
      rocket.css("top", newPos); 
}

function move_down(){
  var newPos = parseInt(rocket.css("top")) + PERSON_SPEED;
      if (newPos > 720 - rocket.height()) {
        newPos = 720 - rocket.height(); 
      }
      rocket.css("top", newPos); 
}

function move_right(){
  var newPos = parseInt(rocket.css("left")) + PERSON_SPEED; 
  if (newPos > 1280 - rocket.width()) {
      newPos = 1280 - rocket.width()
    }
  rocket.css("left", newPos); 
}


// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') {
    if(left_int == null){
      left_int = setInterval(move_left, 20);       
    }
    if(sheild_on){
      $("#rocket_img").attr("src", "/src/player/player_shielded_left.gif");
    }
    else{
      $("#rocket_img").attr("src", "/src/player/player_left.gif");
    }
  }
  if (e.key == 'ArrowRight'){
    if(right_int == null){
      right_int = setInterval(move_right, 20); 
    }
    if(sheild_on){
      $("#rocket_img").attr("src", "/src/player/player_shielded_right.gif");
    }
    else{
      $("#rocket_img").attr("src", "/src/player/player_right.gif");
    }  
  }
  if (e.key == 'ArrowUp'){
    if(up_int == null){
      up_int = setInterval(move_up, 20); 
    }
    if(sheild_on){
      $("#rocket_img").attr("src", "/src/player/player_shielded_up.gif");
    }
    else{
      $("#rocket_img").attr("src", "/src/player/player_up.gif");
    }
  }
  if (e.key == 'ArrowDown'){
    if(down_int == null){
      down_int = setInterval(move_down, 20); 
    }
    if(sheild_on){
      $("#rocket_img").attr("src", "/src/player/player_shielded_down.gif");
    }
    else{
      $("#rocket_img").attr("src", "/src/player/player_down.gif");
    }  
  }

  if(isColliding(shield_screen, rocket)){
    if(shield_shown){
      item_sound.play(); 
      shield_screen.hide(); 
      sheild_on = true; 
    }
  }

  if(isColliding(portal_screen, rocket)){
    if(portal_shown){
      item_sound.play(); 
      portal_screen.hide(); 
      astProjectileSpeed = astProjectileSpeed * 1.2;     
      danger = danger + 2;  
      level = level + 1; 
      document.getElementById("danger_num").innerHTML = danger; 
      document.getElementById("level_num").innerHTML = level; 
    }
  }
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') {
    clearInterval(left_int);
    left_int = null;
  }
  if (e.key == 'ArrowRight'){
    clearInterval(right_int);
    right_int = null; 
  }
  if (e.key == 'ArrowUp'){
    clearInterval(up_int);
    up_int = null; 
  }
  if (e.key == 'ArrowDown'){
    clearInterval(down_int);
    down_int = null; 
  }
  if(sheild_on){
    $("#rocket_img").attr("src", "/src/player/player_shielded.gif");
  }
  else{
    $("#rocket_img").attr("src", "/src/player/player.gif");
  }
}

function setting_toggles(){
  $("#butt1").click(function(){
    if(!butt1.classList.contains("highlight")){
      $("#butt1").toggleClass("highlight");
    }
    if(butt2.classList.contains("highlight")){
      $("#butt2").toggleClass("highlight");
    }
    if(butt3.classList.contains("highlight")){
      $("#butt3").toggleClass("highlight");
    }
    easy = true; 
    normal = false; 
    hard = false; 
  });
  
  $("#butt2").click(function(){
    if(!butt2.classList.contains("highlight")){
      $("#butt2").toggleClass("highlight");
    }    
    if(butt1.classList.contains("highlight")){
      $("#butt1").toggleClass("highlight");
    }
    if(butt3.classList.contains("highlight")){
      $("#butt3").toggleClass("highlight");
    }
    normal = true;
    easy = false; 
    hard = false; 
  });
  
  $("#butt3").click(function(){
    if(!butt3.classList.contains("highlight")){
      $("#butt3").toggleClass("highlight");
    }
    if(butt1.classList.contains("highlight")){
      $("#butt1").toggleClass("highlight");
    }
    if(butt2.classList.contains("highlight")){
      $("#butt2").toggleClass("highlight");
    }
    hard = true; 
    easy = false; 
    normal = false;
  });
}

function setup(){
  if(easy){
    astProjectileSpeed = 1;
    danger = 10; 
    spawnRate = 1000; 
  }
  
  if(normal){
    astProjectileSpeed = 3;     
    danger = 20;     
    spawnRate = 800; 
  }
  
  if(hard){
    astProjectileSpeed = 5;       
    danger = 30;   
    spawnRate = 600; 
  }

  document.getElementById("score_num").innerHTML = 0;
  document.getElementById("danger_num").innerHTML = danger; 
  document.getElementById("level_num").innerHTML = level; 


}

// Starter Code for randomly generating and moving an asteroid on screen
// Feel free to use and add additional methods to this class
class Asteroid {
  // constructs an Asteroid object
  constructor() {
      /*------------------------Public Member Variables------------------------*/
      // create a new Asteroid div and append it to DOM so it can be modified later
      let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAstroid' > <img src = 'src/asteroid.png'/></div>";
      onScreenAsteroid.append(objectString);
      // select id of this Asteroid
      this.id = $('#a-' + currentAsteroid);
      currentAsteroid++; // ensure each Asteroid has its own id
      // current x, y position of this Asteroid
      this.cur_x = 0; // number of pixels from right
      this.cur_y = 0; // number of pixels from top

      /*------------------------Private Member Variables------------------------*/
      // member variables for how to move the Asteroid
      this.x_dest = 0;
      this.y_dest = 0;
      // member variables indicating when the Asteroid has reached the boarder
      this.hide_axis = 'x';
      this.hide_after = 0;
      this.sign_of_switch = 'neg';
      // spawn an Asteroid at a random location on a random side of the board
      this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
      if(this.hide_axis == 'x'){
          if(this.sign_of_switch == 'pos'){
              if(this.cur_x > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_x < this.hide_after){
                  return true;
              }          
          }
      }
      else {
          if(this.sign_of_switch == 'pos'){
              if(this.cur_y > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_y < this.hide_after){
                  return true;
              }          
          }
      }
      return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
      // ensures all asteroids travel at current level's speed
      this.cur_y += this.y_dest * astProjectileSpeed;
      this.cur_x += this.x_dest * astProjectileSpeed;
      // update asteroid's css position
      this.id.css('top', this.cur_y);
      this.id.css('right', this.cur_x);

      if(isColliding(this.id, rocket)){
        if(sheild_on){
          this.id.remove();
          sheild_on = false; 
          $("#rocket_img").attr("src", "/src/player/player.gif");
        }
        else{
          die_sound.play(); 
          count = 0; 
          clearInterval(score_interval);
          clearInterval(shield_interval); 
          clearInterval(portal_interval);
          hit_animation = true; 
          astProjectileSpeed = 0; 
          PERSON_SPEED = 0; 
          $("#rocket_img").attr("src", "/src/player/player_touched.gif");
          setTimeout(() => {
            count = count + 1; 
            $("#rocket_img").attr("src", "/src/player/player.gif");
            hit_animation = false; 
            game_over();
          }, 2000);
        }
      }
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
      // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
      let x = getRandomNumber(0, 1280);
      let y = getRandomNumber(0, 720);
      let floor = 784;
      let ceiling = -64;
      let left = 1344;
      let right = -64;
      let major_axis = Math.floor(getRandomNumber(0, 2));
      let minor_aix =  Math.floor(getRandomNumber(0, 2));
      let num_ticks;

      if(major_axis == 0 && minor_aix == 0){
          this.cur_y = floor;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 0 && minor_aix == 1){
          this.cur_y = ceiling;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = 784;
          this.sign_of_switch = 'pos';
      }
      if(major_axis == 1 && minor_aix == 0) {
          this.cur_y = y;
          this.cur_x = left;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 1 && minor_aix == 1){
          this.cur_y = y;
          this.cur_x = right;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = 1344;
          this.sign_of_switch = 'pos';
      }
      // show this Asteroid's initial position on screen
      this.id.css("top", this.cur_y);
      this.id.css("right", this.cur_x);
      // normalize the speed s.t. all Asteroids travel at the same speed
      let speed = Math.sqrt((this.x_dest)*(this.x_dest) + (this.y_dest)*(this.y_dest));
      this.x_dest = this.x_dest / speed;
      this.y_dest = this.y_dest / speed;
  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    // update asteroid position on screen
    asteroid.updatePosition();

    // determine whether asteroid has reached its end position, i.e., outside the game border
    if (asteroid.hasReachedEnd()) {
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  if (o1.length == 0 || o2.length == 0) {
    return;
  }
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
