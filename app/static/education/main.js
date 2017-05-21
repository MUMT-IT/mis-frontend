var ctxWRS = document.getElementById('wrs-chart').getContext('2d');

var evals = $.getJSON("http://localhost/api/education/evaluation/edpex/wrs/");

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
    console.log(plotData);
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
