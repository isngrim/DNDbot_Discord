var fs = require("fs");

var gameStates = {"INITIALIZING":"initializing", "PLAYING":"playing", "WAITING":"waiting", "ENDED":"ended"};
var gameEntityType = {"PLAYER":"player", "ENEMY":"enemy"}
if(Object.freeze) {
	Object.freeze(gameStates);
	Object.freeze(gameEntityType);
}
function Player(user, id, title, stats, race, isDungeonMaster) {
	this.user = user ? user: null;
	this.stats = stats ? stats: {"strength": 0, "dexterity": 0, "constitution": 0, "intelligence": 0, "wisdom": 0, "charisma": 0};
	this.title = title ? title: null;
	this.userId = id ? id: null;
	this.race = race ? race: null;
	this.isDungeonMaster = isDungeonMaster == undefined ? false : isDungeonMaster;
}
Player.prototype.setStats = function(stats) {
	this.stats.strength = stats.strength ? stats.strength : 0;
	this.stats.dexterity = stats.dexterity ? stats.dexterity : 0;
	this.stats.constitution = stats.constitution ? stats.constitution : 0;
	this.stats.intelligence = stats.intelligence ? stats.intelligence : 0;
	this.stats.wisdom = stats.wisdom ? stats.wisdom : 0;
	this.stats.charisma = stats.charisma ? stats.charisma : 0;
}

function Game(ChannelID, name) {
	this.id = ChannelID;
	this.name = name;
	this.state = gameStates.INITIALIZING;
	this.currentTurn = null;
	this.players = {}
	this.enemies = {}
	this.order = []
	this.dungeonMaster = null;
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
		if(this.players[player].isDungeonMaster) {
			this.dungeonMaster = this.players[player];
		}
		else {
			this.order.push( {entity: player, roll:Math.ceil(Math.random() * 20) , type: gameEntityType.PLAYER });
		}
	}
	this.enemies[this.dungeonMaster.userid] = this.dungeonMaster
	for(var enemy in this.enemies) {
		this.order.push( {entity: enemy, roll:Math.ceil(Math.random() * 20) , type: gameEntityType.ENEMY});
	}
	this.order.sort(function(a, b) {
		return a.roll - b.roll;
	})
	this.finishTurn();
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
Game.prototype.updateDungeonMaster = function () {
	for(var player in this.players) {
		if(player.isDungeonMaster) {
			this.dungeonMaster = player;
			break;
		}
	}
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
			output[id].players[playerId] = new Player(player.user, player.userId, player.title, player.stats, player.race, player.isDungeonMaster);
			if(player.isDungeonMaster) {
				console.log(player);
				console.log(output[id].players[playerId]);
			}
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
