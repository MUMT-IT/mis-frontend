var ctxWRS = document.getElementById('wrs-chart').getContext('2d');
var ctxSatisfaction = document.getElementById('satisfaction-chart').getContext('2d');
var ctxMtLicense = document.getElementById('mt-license-chart').getContext('2d');
var ctxRtLicense = document.getElementById('rt-license-chart').getContext('2d');
var ctxWRSDev1 = document.getElementById('wrs-dev-chart-1').getContext('2d');
var ctxWRSDev2 = document.getElementById('wrs-dev-chart-2').getContext('2d');

var evals = $.getJSON("http://localhost/api/education/evaluation/edpex/wrs/");
var satis = $.getJSON("http://localhost/api/education/evaluation/edpex/satisfaction/")
var license = $.getJSON("http://localhost/api/education/evaluation/edpex/license/")
var wrsDevelopment = $.getJSON("http://localhost/api/education/wrs/results/development/")

$.when(evals).done(function(data) {
    var scoreData = {};
    var slugs = [];
    var descs = [];

    $.each(data, function(idx, d) {
        slugs.push(d.slug);
        descs.push(d.desc)
        var dat = [];
        $.each(d.scores, function(i, s) {
            dat.push(s.score);
        })
        scoreData[d.slug] = dat;
    });

    var years = [];
    for(var i=0; i<data[0].scores.length; i++) {
        years.push(data[0].scores[i].year);
    }

    var plotData = [];
    var backgroundColor = [
        "#FF6384",
        "#36A2EB",
        "#00CE56",
        "#555E56",
        "#FFCE56"
    ]
    $.each(slugs, function(ix, s) {
        plotData.push({
            data: scoreData[s],
            label: descs[ix],
            backgroundColor: backgroundColor[ix],
        })
    })
    plotBarChart(ctxWRS, plotData, years);
});

var plotBarChart = function(ctx, data, years) {
    var plotData = {
        labels: years,
        datasets: data,
    };
    var chart = new Chart(ctx, {
        type: 'bar',
        data: plotData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 16
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 16
                    }
                }]
            },
            legend: {
                labels: {
                    fontSize: 14
                }
            }
        }
    });
}

$.when(satis).done(function(data) {
    var scores = [];
    var years = [];
    $.each(data, function(ix, d) {
        scores.push(d.score);
        years.push(d.year);
    })
    var lineChart = new Chart(ctxSatisfaction, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    data: scores,
                    borderColor: [
                        "#000995",
                    ]
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 16
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 16
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    })
})

$.when(license).done(function(data) {
    var years = [];
    var mumt = [];
    var mtkku = [];
    var mtcmu = [];
    var murt = [];
    var rtcmu = [];
    $.each(data.data.mt, function(idx, d) {
        if(d.institute==="MUMT") {
            years.push(d.year);
            mumt.push(d.percent);
        } else if (d.institute==="MT-KKU") {
            mtkku.push(d.percent);
        } else if (d.institute==="MT-CMU") {
            mtcmu.push(d.percent);
        } else {
            // pass
        }
    })
    $.each(data.data.rt, function(idx, d) {
        if(d.institute==="MURT") {
            murt.push(d.percent);
        } else if (d.institute==="RT-CMU") {
            rtcmu.push(d.percent);
        } else {
            // pass
        }
    })
    var mtLicenseChart = new Chart(ctxMtLicense, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    data: mumt,
                    label: "MUMT",
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "#0317AF",
                    borderColor: "#0317AF"
                },
                {
                    data: mtcmu,
                    label: "MT-CMU",
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "#9803AF",
                    borderColor: "#9803AF"
                },
                {
                    data: mtkku,
                    label: "MT-KKU",
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "#AF7303",
                    borderColor: "#AF7303"
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 14
                    },
                    scaleLabel: {
                        labelString: "ร้อยละผู้สอบผ่าน",
                        fontSize: 16,
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 14
                    }
                }]
            },
            legend: {
                labels: {
                    fontSize: 14
                }
            }
        }
    })
    var rtLicenseChart = new Chart(ctxRtLicense, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    data: murt,
                    label: "MURT",
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "#0317AF",
                    borderColor: "#0317AF"
                },
                {
                    data: rtcmu,
                    label: "RT-CMU",
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "#9803AF",
                    borderColor: "#9803AF"
                },
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 14
                    },
                    scaleLabel: {
                        labelString: "ร้อยละผู้สอบผ่าน",
                        fontSize: 16,
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 14
                    }
                }]
            },
            legend: {
                labels: {
                    fontSize: 14
                }
            }
        }
    })
})

$.when(wrsDevelopment).done(function(data) {
    data_ = {};
    var year;
    $.each(data.data, function(idx, dat) {
        year = dat.year;
        postd = [];
        pred = [];
        $.each(dat.results, function(ix, d) {
            if (d.question==="knowledge") {
                if(d.post===true) {
                    postd[0] = d.value;
                } else {
                    pred[0] = d.value;
                }
            } else if (d.question==="creativity") {
                if (d.post===true) {
                    postd[1] = d.value;
                } else {
                    pred[1] = d.value;
                }
            } else if (d.question==="analysis") {
                if (d.post===true) {
                    postd[2] = d.value;
                } else {
                    pred[2] = d.value;
                }
            } else if (d.question==="leadership") {
                if (d.post===true) {
                    postd[3] = d.value;
                } else {
                    pred[3] = d.value;
                }
            } else if (d.question==="socialresp") {
                if (d.post===true) {
                    postd[4] = d.value;
                } else {
                    pred[4] = d.value;
                }
            } else if (d.question==="prof_skill") {
                if (d.post===true) {
                    postd[5] = d.value;
                } else {
                    pred[5] = d.value;
                }
            }
        })
        data_[year] = {
            'post': postd,
            'pre': pred,
            'year': year
        }
    })
    console.log(data_)
    plotRadarChart(ctxWRSDev1, data_[2557]);
    plotRadarChart(ctxWRSDev2, data_[2558]);
})

var plotRadarChart = function(ctx, data) {
    var radarChart1 = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["ความรู้", "ความคิดสร้างสรรค์", "การคิดวิเคราะห์", "ภาวะผู้นำ", "สังคม", "ทักษะทางวิชาชีพ"],
            datasets: [
                {
                    label: 'post',
                    data: data.post,
                    borderColor: "rgba(193,3,3,0.8)",
                    backgroundColor: "rgba(226,61,61,0.3)",
                },
                {
                    label: 'pre',
                    data: data.pre,
                    borderColor: "rgba(96,95,95,0.8)",
                    backgroundColor: "rgba(160,159,159,0.3)",
                }
            ]
        },
        options: {
            scale: [{
                ticks: {
                    fontSize: 16
                }
            }],
        }
    })
}
