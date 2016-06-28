var Discord = require('discord.io')

var bot = new Discord.Client({
    token: "MTk3MTg4MzI0MTQwNTE1MzI5.ClN9cA.QWf5EAxRWzWrDNDT7wHXD20Vbas",
    autorun: true
});

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

function roll(mssg) {
    try {
        var data = mssg.split(":");
        var num = Number(data[1]);
        return Math.ceil(Math.random() * num);
    catch {
        return -1;
    }

}

bot.on('message', function(user, userID, channelID, message, event) {
    console.log(typeof(message));
    console.log(message);
    if (message.includes("!roll") ){
        bot.sendMessage({
            to: channelID,
            message: roll(message).toString()
        })
    }
});
