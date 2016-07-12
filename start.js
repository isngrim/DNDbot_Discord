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

var bot = require('./bot.js');
var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
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
  var options = {
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
  });
});
main.post('/bot_game_data.json',  function(req, res, next) {
  fs.writeFile('./game_data/games.json', JSON.stringify(req.body));
  bot.games = req.body;
  for(var game in req.body) {
    console.log(game);
  }
  res.sendStatus(200);
});
main.use('/static', express.static('static'));
main.use('/static/lib', express.static('bower_components'));
main.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Application worker ${process.pid} started...');
})