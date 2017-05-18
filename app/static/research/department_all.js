'use strict';

var ctxDataMining = document.getElementById('datamining-chart').getContext('2d');
var ctxResearch = document.getElementById('research-chart').getContext('2d');
var ctxMicrobio = document.getElementById('microbio-chart').getContext('2d');
var ctxMicros = document.getElementById('micros-chart').getContext('2d');
var ctxClinChem = document.getElementById('clinchem-chart').getContext('2d');
var ctxRadiology = document.getElementById('radiology-chart').getContext('2d');
var ctxComMt = document.getElementById('commt-chart').getContext('2d');
var ctxStandVal = document.getElementById('standval-chart').getContext('2d');
var ctxAll = document.getElementById('all-chart').getContext('2d');

var viewModel = function() {
    var self = this;
    self.people = ko.observableArray([]);
    self.articles_count = [];
    $.getJSON('http://localhost:8800/api/abstracts/list/2017', function(articles) {
        var dataMining = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'data-mining'});
        var researchInno = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'research-inno'});
        var microbio = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'microbio'});
        var micros = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'micros'});
        var clinchem = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'clinchem'});
        var radiology = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'radiology'});
        var commt = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'community-mt'});
        var standval = $.getJSON('http://localhost:5570/api/employees/', {'department_slug': 'stand-validation'});
        $.when(dataMining).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxDataMining);
            $('#data-mining-total-articles').text(info.totalArticles);
            var productivity = info.totalArticles / info.totalPeople;
            $('#data-mining-productivity').text(productivity.toFixed(1));
        })
        $.when(researchInno).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxResearch);
            $('#research-total-articles').text(info.totalArticles.length);
            var productivity = info.totalArticles / info.totalPeople;
            $('#research-productivity').text(productivity.toFixed(1));
        })
        $.when(microbio).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxMicrobio);
            $('#microbio-total-articles').text(info.totalArticles.length);
            var productivity = info.totalArticles / info.totalPeople;
            $('#microbio-productivity').text(productivity.toFixed(1));
        })
        $.when(micros).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxMicros);
            $('#micros-total-articles').text(info.totalArticles.length);
            var productivity = info.totalArticles / info.totalPeople;
            $('#micros-productivity').text(productivity.toFixed(1));
        })
        $.when(clinchem).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxClinChem);
            $('#clinchem-total-articles').text(info.totalArticles.length);
            var productivity = info.totalArticles / info.totalPeople;
            $('#clinchem-productivity').text(productivity.toFixed(1));
        })
        $.when(radiology).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxRadiology);
            $('#radiology-total-articles').text(info.totalArticles.length);
            var productivity = info.totalArticles / info.totalPeople;
            $('#radiology-productivity').text(productivity.toFixed(1));
        })
        $.when(commt).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxComMt);
            $('#commt-total-articles').text(info.totalArticles.length);
            var productivity = info.totalArticles / info.totalPeople;
            $('#commt-productivity').text(productivity.toFixed(1));
        })
        $.when(standval).done(function(data, statusText, jqXHR) {
            var info = selectDeptArticles(articles, data, ctxStandVal);
            $('#standval-total-articles').text(info.totalArticles.length);
            var productivity = info.totalArticles / info.totalPeople;
            $('#standval-productivity').text(productivity.toFixed(1));
        })
        var cnt = countArticlesPerMonth(articles.data);
        plotArticleCount(ctxAll, cnt);
        $('#all-total-articles').text(articles.data.length);
    });
}

var selectDeptArticles = function(articles, people, ctx) {
    var deptArticles = [];
    $.each(people, function(idx, person) {
        $.each(articles.data, function(ix, article) {
            $.each(article.authors, function(i, author) {
                if(person.first_name_en===author.first_name &&
                    person.last_name_en===author.last_name) {
                    if($.inArray(article, deptArticles) === -1) {
                        deptArticles.push(article)
                    }
                }
            })
        })
    })
    var numArticles = countArticlesPerMonth(deptArticles);
    plotArticleCount(ctx, numArticles);
    return {'totalArticles': deptArticles.length, 'totalPeople': people.length};
}

var countArticlesPerMonth = function(deptArticles) {
    var countData = [0,0,0,0,0,0,0,0,0,0,0,0];
    $.each(deptArticles, function(idx, article) {
        var m = new Date(article.cover_date).getMonth();
        countData[m] += 1;
    })
    return countData;
}

var plotArticleCount = function(canvas, countData) {
    var thisMonth = new Date().getMonth();
    var cumData = [];
    var cnt = 0;
    for(var i=0; i<=thisMonth; i++) {
        cnt += countData[i];
        cumData.push(cnt);
    }
    var chart = new Chart(canvas, {
        type: 'line',
        height: 200,
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Per Month",
                    data: countData.slice(0,thisMonth),
                    borderColor: "rgba(0,0,255,0.8)",
                    backgroundColor: "rgba(102,153,255,0.6)",
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: "Cumulative",
                    data: cumData,
                    borderColor: "rgba(204,0,204,0.8)",
                    backgroundColor: "rgba(255,102,255,0.6)",
                    borderWidth: 2,
                    fill: true
                }
            ],
        },
        options: {
            legend: {
                display: true
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 4 // should make it dynamically adjustable
                    }
                }]
            }
        }
    });
}

var vm = new viewModel();
ko.applyBindings(vm);