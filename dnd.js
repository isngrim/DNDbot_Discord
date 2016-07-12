var fs = require("fs");

var gameStates = {"INITIALIZING":"initializing", "PLAYING":"playing", "WAITING":"waiting", "ENDED":"ended"};
var gameEntityType = {"PLAYER":"player", "ENEMY":"enemy"}
if(Object.freeze) {
	Object.freeze(gameStates);
	Object.freeze(gameEntityType);
}
function Player(user, title, stats) {
	this.user = user;
	this.stats = stats;
	this.title = title;
}
Player.prototype.setStats = function(stats) {
	this.stats = stats;
}

function Game(ChannelID, name) {
	this.id = ChannelID;
	this.name = name;
	this.state = gameStates.INITIALIZING;
	this.currentTurn = null;
	this.players = {}
	this.enemies = {}
	this.order = []
}
Game.prototype.addPlayer = function(userid, user, title, stats) {
	if(this.state == gameStates.INITIALIZING)
		this.players[userid] = new Player(user, title, stats);
}
Game.prototype.setPlayerStats = function(playerId, statsStr){
	this.players[playerId].setStats(JSON.parse(statsStr));
}
Game.prototype.start = function() {
	this.state = gameStates.PLAYING;
	for(var player in this.players) {
		this.order.push( {entity: player, roll:Math.ceil(Math.random() * 20) , type: gameEntityType.PLAYER });
	}
	for(var enemy in this.enemies) {
		this.order.push( {entity: enemy, roll:Math.ceil(Math.random() * 20) , type: gameEntityType.ENEMY});
	}
	this.order.sort(function(a, b) {
		return a.roll - b.roll;
	})
}
Game.prototype.pause = function() {
	this.state = gameStates.WAITING;
}
Game.prototype.resume = function() {
	this.state = gameStates.PLAYING;
}
Game.prototype.finishTurn = function() {
	this.currentTurn = this.order[0];
	this.order.push(this.order.shift());
}
Game.prototype.getStatus = function() {
	return JSON.stringify(this);
}
if(module) {
	module.exports = {
		Player: Player,
		Game: Game
	}
}