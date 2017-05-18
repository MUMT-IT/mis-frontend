'use strict';

var ctxArticleByField1 = document.getElementById('article-by-field-1').getContext('2d');
var ctxArticleByField2 = document.getElementById('article-by-field-2').getContext('2d');
var ctxArticleByField3 = document.getElementById('article-by-field-3').getContext('2d');
var ctxArticleByField4 = document.getElementById('article-by-field-4').getContext('2d');
var ctxArticleByField5 = document.getElementById('article-by-field-5').getContext('2d');

var ctxArticleCount = document.getElementById('article-numbers').getContext('2d');
var ctxCumArticleCount = document.getElementById('cum-article-numbers').getContext('2d');

var articleByField = $.getJSON("http://localhost/api/research/abstracts/subject_areas/");
var articleCounts = $.getJSON("http://localhost/api/research/abstracts/benchmark/numbers/")

var articleByFieldCounts = {};
var fields = ["PHAR", "CHEM", "CENG", "COMP"];

$.when(articleByField).done(function(data) {
    $.each(data, function(idx, y) {
        var dat = [];
        $.each(y.counts, function(ix, c) {
            dat.push(c);
        });
        articleByFieldCounts[y.year] = dat;
    });
    plotBarChart(articleByFieldCounts["2013"], ctxArticleByField1, fields);
    plotBarChart(articleByFieldCounts["2014"], ctxArticleByField2, fields);
    plotBarChart(articleByFieldCounts["2015"], ctxArticleByField3, fields);
    plotBarChart(articleByFieldCounts["2016"], ctxArticleByField4, fields);
    plotBarChart(articleByFieldCounts["2017"], ctxArticleByField5, fields);
})

$.when(articleCounts).done(function(data) {
    var years = [];
    var counts = [];
    var cumCounts = [];
    $.each(data[0].counts, function(idx, d) {
        years.push(d.year)
    })
    $.each(data, function(idx, d) {
        var dat = [];
        var cumDat = [];
        var cnt = 0;
        $.each(d.counts, function(ix, c) {
           cnt += c.articles;
           cumDat.push(cnt);
           dat.push(c.articles);
        })
        counts.push(dat);
        cumCounts.push(cumDat);
    })
    plotLineChart(data, counts, years, ctxArticleCount);
    plotLineChart(data, cumCounts, years, ctxCumArticleCount);
})

var plotLineChart = function(data, counts, years, ctx) {
    var articleChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: data[0].institute,
                    data: counts[0],
                    borderColor: "rgba(19, 87, 196, 0.8)",
                    backgroundColor: "rgba(19, 87, 196, 0.8)",
                    pointRadius: 5,
                    fill: false
                },
                {
                    label: data[1].institute,
                    data: counts[1],
                    borderColor: "rgba(158, 78, 4, 0.8)",
                    backgroundColor: "rgba(158, 78, 4, 0.8)",
                    pointRadius: 5,
                    fill: false
                },
                {
                    label: data[2].institute,
                    data: counts[2],
                    borderColor: "rgba(147, 4, 158, 0.8)",
                    backgroundColor: "rgba(147, 4, 158, 0.8)",
                    pointRadius: 5,
                    fill: false
                }
            ]
        }
    })
}

var plotBarChart = function(countData, ctx, fields) {
    var mumt = [0,0,0,0];
    var kkuams = [0,0,0,0];
    var cmuams = [0,0,0,0];
    $.each(countData, function(ix, c) {
        $.each(fields, function(idx, field) {
            if(c.affil==="MUMT" && c.area==field) {
                mumt[idx] += c.articles;
            } else if (c.affil==="CMUAMS" && c.area==field) {
                cmuams[idx] += c.articles;
            } else if (c.affil==="KKUAMS" && c.area==field) {
                kkuams[idx] += c.articles;
            } else {
                // pass
            }
        })
    })

    var radarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fields,
            datasets: [
                {
                    label: "MUMT",
                    data: mumt,
                    backgroundColor: "rgba(19, 87, 196, 0.8)",
                },
                {
                    label: "CMUAMS",
                    data: cmuams,
                    backgroundColor: "rgba(147, 4, 158, 0.8)",
                },
                {
                    label: "KKUAMS",
                    data: kkuams,
                    backgroundColor: "rgba(158, 78, 4, 0.8)",
                }
            ]
        }
    })
}