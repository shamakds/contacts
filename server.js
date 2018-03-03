var express = require("express");
var path = require("path");
var app = express();
var deploy = false;
var port = process.env.PORT || deploy ? 80 : 5060;

app.use('/', express.static(__dirname));
app.use('/build', express.static(__dirname + "/build"));

app.all('/*', function(req, res) {
    res.sendFile(path.resolve('./index.html'));
});

app.listen(port, function() {
    console.info("server running on %d port", port);
});

