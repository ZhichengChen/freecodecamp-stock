var dom = document.getElementById("main");
var myChart = echarts.init(dom);
var app = {};
option = null;
var container = document.getElementsByClassName('container')[0];
var results = dom.getAttribute('data').split(',');

option = {

    tooltip: {
        trigger: 'none',
        axisPointer: {
            type: 'cross'
        }
    },
    legend: {
        data:results
    },
    grid: {
        top: 70,
        bottom: 50
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false
            },
            axisPointer: {
                label: {
                    formatter: function (params) {
                        return params.value
                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                    }
                }
            },
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
    ]
};
var m=0;
var i = 2;
var resultsSize = results.length;
AsyncGetData();
function AsyncGetData(){
    
    getData(results[m], function(){
        if (++m<2) {
            AsyncGetData();
        } else {
            if (results.length>2) {
                asynAdd();
                function asynAdd() {
                    if (i<(resultsSize-1)) {
                        addElement(results[i]);
                        if (++i<(resultsSize-1)) {
                            asynAdd();   
                        }
                    }
                }
            } 
        }
    });    
}

function random(min, max){
    return (Math.random()*(max-min+1)+min).toFixed(1);
}
function add() {
    var year = document.getElementById('year').value;
    var lagend = year;
    for (var i=0;i<option.series.length;i++) {
        if (option.series[i].name == lagend) {
            return swal(lagend + '已存在');
        }
    }
    ajax('/add/'+lagend, function(){
        
    });
}

function getData(lagend, cb) {
    ajax('/get/'+lagend, function(data){
        data = JSON.parse(data);
        if (!data.result.timeChart) {
            swal(lagend + '不存在');
            return cb(false);
        }
        data = data.result.timeChart.p;
        var seriesData = [];
        if (!option.xAxis[0].data.length) {
            var xAxisData = [];
            for (var k=0;k<data.length;k++) {
                if (/:00|:15|:30|:45/.test(data[k].time)) {
                    xAxisData.push(data[k].date  + ' ' + data[k].time);    
                }
            }
            option.xAxis[0].data = xAxisData; 
        }
        for (var k=0;k<data.length;k++) {
            if (/:00|:15|:30|:45/.test(data[k].time)) {
                for (var l=0;l<option.xAxis[0].data.length;l++) {
                    if ((data[k].date +' '+ data[k].time) == option.xAxis[0].data[l]) {
                       seriesData[l] = data[k].price;
                    }
                }
            }
        }
        option.legend.data.push(lagend);
        option.series.push(
         {
            name:lagend,
            type:'line',
            smooth: true,
            data: seriesData
        });
        myChart.setOption(option, true);
        cb(true);
    });
}
function addElement(lagend) {
    option.legend.data.push(lagend);
    getData(lagend, function(result){
        if (!result) {
            return ;
        }
        var button = document.createElement('button');
        button.setAttribute('class', 'delete');
        
        button.innerHTML = '删除' +　lagend;
        button.addEventListener('click', function(){
            for (var j=0;j<option.series.length;j++) {
                if (option.series[j].name == lagend) {
                    option.series.splice(j, 1);
                    option.legend.data.splice(j, 1);
                    myChart.setOption(option, true);
                    ajax('/delete/'+lagend, function(){ 
                    });
                    break;
                }
            }
            
        }, true);
        container.appendChild(button); 
    });
    
}

function ajax(url, cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cb(this.responseText);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

var ws = new WebSocket('wss://freecodecamp-zhichengchen.c9users.io/');

ws.onopen = function(evt) {
};

ws.onmessage = function(evt) {
  var result =  evt.data.split(':');
  if (result[0]=='add') {
      serverAdd(result[1]);
  } else if (result[0]=='delete') {
      serverDelete(result[1]);
  }
  //ws.close();
};

ws.onclose = function(evt) {
  console.log('Connection closed.');
};

function serverAdd(lagend) {
    for (var j=0;j<option.series.length;j++) {
        if (option.series[j].name == lagend) {
            return ;
        }
    }
    addElement(lagend);
    myChart.setOption(option, true);
}

function serverDelete(lagend) {
    for (var j=0;j<option.series.length;j++) {
        if (option.series[j].name == lagend) {
            option.series.splice(j, 1);
            option.legend.data.splice(j, 1);
            myChart.setOption(option, true);
            break;
        }
    }
    var buttons = document.getElementsByClassName('delete');
    for (var i=0;i<buttons.length;i++) {
        if (buttons[i].innerHTML == '删除'+lagend) {
            return buttons[i].remove();
        }
    }
}
$( function() {
    var availableTags = [
      "AMZN",
      "NTES",
      "AAPL",
      "MSFT",
      "BABA",
      "BRK.A",
      "BRK.B",
      "JNJ",
      "XOM",
      "JPM",
      "BAC",
      "WFC",
      "WMT",
      "V",
      "PG",
      "CVX",
      "PTR",
      "INTC",
      "PFE",
      "ORCL",
      "UNH",
      "T",
      "KO",
      "C",
      "HD",
      "汽车之家"
    ];
    $( "#year" ).autocomplete({
      source: availableTags
    });
  } );