const express = require("express");
const path = require("path");
const app = express();
const PORT = 5060;

app.use('/', express.static(__dirname));
app.use('/build', express.static(__dirname + "/build"));

app.all('/*', function(req, res) {
    res.sendFile(path.resolve('./index.html'));
});

app.listen(PORT, function() {
    console.info("server running on %d port", PORT);
});

