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
        var mult = 1;
        if(data[2]) {
            mult = Number(data[2]);
        }

        var output = [];
        if(mult > 100) mult = 100;
        for(var i = 0; i < mult; i++ ){
            output.push(Math.ceil(Math.random() * num).toString());
        }
        return output;
    }
    catch (err) {
        return [NaN];
    }

}

bot.on('message', function(user, userID, channelID, message, event) {
    console.log(typeof(message));
    console.log(message);
    if (message.startsWith("!roll") ){
        try {
            var rolls = roll(message);
            for(var i = 0; i < rolls.length; i++) {
                var aggregate = "";
                for(var j = 0; j < 10; j++) {
                    if(10*i + j >= rolls.length)
                        break;
                    aggregate += rolls[i*10 + j] + "\n";
                }
                bot.sendMessage({
                    to: channelID,
                    message: aggregate;
                });
            }
        }
        catch(err) {
            bot.sendMessage({
                to: channelID,
                message: "Error, could not roll"
            })
        }
    }
});
