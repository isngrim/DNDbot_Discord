/*var   cluster = require('cluster'),
      stopSignals = [
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
      ],
      production = process.env.NODE_ENV == 'production';

var stopping = false;

cluster.on('disconnect', function(worker) {
  if (production) {
    if (!stopping) {
      cluster.fork();
    }
  } else {
    process.exit(1);
  }
});

if (cluster.isMaster) {
  const workerCount = process.env.NODE_CLUSTER_WORKERS || 4;
  console.log(`Starting ${workerCount} workers...`);
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }
  if (production) {
    stopSignals.forEach(function (signal) {
      process.on(signal, function () {
        console.log(`Got ${signal}, stopping workers...`);
        stopping = true;
        cluster.disconnect(function () {
          console.log('All workers stopped, exiting.');
          process.exit(0);
        });
      });
    });
  }
} else {
  require('./app.js');
  require('./bot.js');
}*/

var bot_module = require('./bot.js');
var bot = bot_module.bot
var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
var _ = require("lodash");

var env = process.env;
var main = express();

main.use(bodyParser.json());

main.get("/", function(req, res, next) {
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  res.sendFile("./static/index.html", options, function(err) {
    if(err) {
      console.log(err);
    }
  });
})
main.get('/bot_game_data.json',  function(req, res, next) {
  res.send(JSON.stringify(bot.games));
  /*var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  res.sendFile("./game_data/games.json", options, function(err) {
    if(err) {
      console.log(err);
    }
  });*/
});
main.post('/bot_game_data.json',  function(req, res, next) {
  console.log(req.body);
  bot.games = req.body;
  bot_module.save(bot);
  bot_module.load(bot);
  //fs.writeFile('./game_data/games.json', JSON.stringify(req.body));

  res.sendStatus(200);
});
main.post('/updates.json', function(req, res, next) {
  if(JSON.stringify(req.body) == JSON.stringify(bot.games)){
    res.send({"updates": false})
  }
  else {
    res.send({"updates": true})
  }
})
main.use('/static', express.static('static'));
main.use('/static/lib', express.static('bower_components'));
main.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Application worker ${process.pid} started...');
})