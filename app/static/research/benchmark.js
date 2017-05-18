'use strict';

var ctxArticleByField1 = document.getElementById('article-by-field-1').getContext('2d');
var ctxArticleByField2 = document.getElementById('article-by-field-2').getContext('2d');
var ctxArticleByField3 = document.getElementById('article-by-field-3').getContext('2d');

var articleByField = $.getJSON("http://localhost/api/research/abstracts/subject_areas/");

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
    plotBarChart(articleByFieldCounts["2015"], ctxArticleByField1, fields);
    plotBarChart(articleByFieldCounts["2016"], ctxArticleByField2, fields);
    plotBarChart(articleByFieldCounts["2017"], ctxArticleByField3, fields);
})

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
    console.log(cmuams, kkuams);

    var radarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fields,
            datasets: [
                {
                    label: "MUMT",
                    data: mumt,
                    backgroundColor: "rgba(179, 181, 198, 0.8)"
                },
                {
                    label: "CMUAMS",
                    data: cmuams,
                    backgroundColor: "rgba(179, 0, 198, 0.8)"
                },
                {
                    label: "KKUAMS",
                    data: kkuams,
                    backgroundColor: "rgba(255, 99, 132, 0.8)"
                }
            ]
        }
    })
}