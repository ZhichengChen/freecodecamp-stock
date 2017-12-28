
/*
 * GET home page.
 */
var request = require('request');
var data = ['汽车之家', 'GOOG'];

exports.index = function(req, res) {
  res.render('index', { title: 'Express' , data:data});
};

exports.add = function(req, res) {
    var str = req.params.data;
    data.push(str);
    res.send(200);
};

exports.delete = function(req, res) {
    var str = req.params.data;
    for (var i=0;i<data.length;i++) {
        if (data[i] == str) {
            data.splice(i,1);
            return res.send(200);
        }
    }
}

exports.get = function(req, res) {
    var str = req.params.data;
    request('https://op.juhe.cn/onebox/stock/query?key=7130de9a88f84428597c3a19a7db85a1&stock='+encodeURIComponent(str), function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        res.json(info);
      } else {
        res.json(error)
      }
    });
};