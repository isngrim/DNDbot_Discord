var dnd = require('./dnd.js');
var game = new dnd.Game(1);
console.log(game);
game.addPlayer(1, {"username": "mynameis7"}, "The Amazing");
game.addPlayer(2, {"username": "Sulfr"}, "The Great");
game.addPlayer(3, {"username": "TEST2"}, "TEST2");
game.addPlayer(4, {"username": "TEST3"}, "TEST3");

//console.log(game);
for(var playerid in game.players){
	if(game.players.hasOwnProperty(playerid)) {
		var player = game.players[playerid];
		game.setPlayerStats(playerid, '{"int":10, "str":10, "mag":10, "res":10}')
		console.log(player);
	}
}
game.start();
console.log(game);
for(var i = 0; i < 5; i++) {
	game.finishTurn();
	console.log(game.order);
}
console.log(game.getStatus());