/* MoMath Math Square Behavior
 *
 *        Title: Test
 *  Description: WIP
 *       Author: R
 *      Created: ?
 *      Updated: ?
 *       Status: no works
 */

import P5Behavior from 'p5beh';
import THREEContext from 'threectx';
import * as THREE from 'three';
import * as Display from 'display';

const pb = new P5Behavior();
var context;
var row;
var col;
var offBulb;
var onBulb;
var grid = new Array(9);
var shortestPairing = new Object();
var lines = new Array();
var delayMillis = 1000
var userList = [];

console.log(grid);

for (let i = 0; i < 9; i++){
	grid[i] = new Array(9);
}


for (row = 0; row < 9; row++){
	for (col = 0; col < 9; col++){
		var fill = Math.round(Math.random());
		if (fill == 1) {
			grid[row][col] = true;
		}
		else {
			grid[row][col] = false;
		}
	}
}

console.log(grid);

pb.preload = function (p) {
  /* this == pb.p5 == p */
  // ...  
  // offBulb = this.loadImage('images/off.png')
  // onBulb = this.loadimage('images/on.png')
}

pb.setup = function (p) {
  /* this == pb.p5 == p */
  /* P5Behavior already calls createCanvas for us */
  // setup here...\
  
  offBulb = this.loadImage('images/off.png');
  onBulb = this.loadImage('images/on.png');
}

pb.draw = function (floor, p) {
  /* this == pb.p5 == p */
  // draw here...\

  this.clear();
  
  
  for (row = 0; row < 9; row++){
	  for (col = 0; col < 9; col++){
		  if (grid[row][col]){
			  this.image(onBulb, row*64, col*64, 64, 64);
		  }
		  else if (!grid[row][col]){
			  this.image(offBulb, row*64, col*64, 64, 64);
		  }
      }		  
  }
  
 for(var l in lines) context.scene.remove(lines[l]);
  lines = [];

  var points = new Array();
  for(var user of floor.users){
    var newPosition = new THREE.Vector3(user.x, user.y);
    points.push(newPosition);
  }
  
  for(let user of floor.users){
	var stepRow = coords2arrInds(user.x, user.y)[0];
	var stepCol = coords2arrInds(user.x, user.y)[1];
	if (userList.indexOf(user.id) >= 0){
		let info = findUser(userList,user);
		if ((stepRow != info[1]) || (stepCol != info[2])){
			switchAllLights(grid, stepRow, stepCol);
		}
	}
	else{
		switchAllLights(grid, stepRow, stepCol);
		userList = userList.concat([user.id,coords2arrInds(user.x, user.y)[0],coords2arrInds(user.x, user.y)[1]]);
	}
  }
}

function coords2arrInds(x, y){
	let row = Math.floor((x/576)*9);
	let col = Math.floor((y/576)*9);
	return [row, col];
}

function findUser(arr, user){
	for (let i = 0; i < arr.length; i++){
		if (arr[i] == user.id){
			return [arr[i], arr[i+1], arr[i+2]];
		}
	}
	return;
}
	
function switchAllLights(grid, row, col){
	var steppedOn = false;
	if isOnBoard(row, col){
		switchLight(grid, row, col);
		steppedOn = true;
	}
	if isOnBoard(row-1, col){
		switchLight(grid, row-1, col);
	}
	if isOnBoard(row+1, col){
		switchLight(grid, row+1, col);
	}
	if isOnBoard(row, col-1){
		switchLight(grid, row, col-1);
	}
	if isOnBoard(row, col+1){
		switchLight(grid, row, col+1);
	}
}

function switchLight(grid, row, col){
	grid[row][col] = !grid[row][col];
}

function isOnBoard(x,y){
	return (x >= 0 && x < 9) && (y >= 0 && y < 9);
}

function init(container) {
  context = new THREEContext(container);
  
  behavior.userUpdate = context.userUpdate.bind(context);
}


export const behavior = {
  title: "Test Game",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  numGhosts: 0,
  render: pb.render.bind(pb),
};
export default behavior;
