var fs = require("fs");

var gameStates = {"INITIALIZING":"initializing", "PLAYING":"playing", "WAITING":"waiting", "ENDED":"ended"};
var gameEntityType = {"PLAYER":"player", "ENEMY":"enemy"}
if(Object.freeze) {
	Object.freeze(gameStates);
	Object.freeze(gameEntityType);
}
function Player(user, id, title, stats) {
	this.user = user ? user: null;
	this.stats = stats ? stats: null;
	this.title = title ? title: null;
	this.userId = id ? id: null;
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
Game.prototype.end = function() {
	this.state = gameStates.ENDED;
}
Game.prototype.finishTurn = function() {
	this.currentTurn = this.order[0];
	this.order.push(this.order.shift());
}
Game.prototype.getStatus = function() {
	return JSON.stringify(this);
}
function createGames(gamesData) {
	var output = {}
	for(var id in gamesData) {
		var game = gamesData[id];
		output[id] = new Game(id, game.name);
		output[id].state = game.state;
		output[id].players = {};
		for(var playerId in game.players) {
			var player = game.players[playerId];
			console.log(player);
			output[id].players[playerId] = new Player(player.user, player.userId, player.title, player.stats);
		}
		output[id].order = game.order;
	}
	return output;
}

if(module) {
	module.exports = {
		Player: Player,
		Game: Game,
		createGames: createGames,
	}
}
