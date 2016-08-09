var debug = require('debug'),
    app = require('./app'),
    http = require('http').Server(app);

app.set('port', process.env.PORT || 80);

var server = http.listen(app.get('port'), '0.0.0.0', function () {
    console.log('Express server listening on port ' + server.address().port);
});
