'use strict';

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var articlePerPage = 20;
var viewModel = function() {
    var self = this;
    self.loading = ko.observable(true);
    self.articles = ko.observableArray([]);
    self.filteredArticles = ko.observableArray([]);
    self.currpage = ko.observable(0);
    self.paginated = ko.computed(function() {
        var start, end;
        start = (self.currpage() * articlePerPage);
        end = ((self.currpage() + 1) * articlePerPage);
        return self.filteredArticles().slice(start, end);
    });
    self.pages = ko.computed(function() {
        var p = [];
        var numPages = self.filteredArticles().length / articlePerPage;
        var t = 0;
        for(var i=0; i<=numPages; i++) {
            p.push(i);
            t = t + i * self.articlePerPage;
        }
        if(t <=self.articles.length) {
            p.push(i+1);
        }
        return p;
    });
    self.pubYear = ko.observable('2017');
    self.reverseSortDate = ko.observable(true);
    self.reverseSortTitle = ko.observable(false);
    self.reverseSortJournal = ko.observable(false);
    self.reverseSortCitation = ko.observable(false);
    self.query = ko.observable('');
    self.search = function (query) {
        if(query === '') {
            self.filteredArticles(self.articles());
            self.currpage(0);
        } else {
            self.filteredArticles([]);
            $.each(self.articles(), function(idx, ab) {
                if(ab.title.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ab.journal.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ab.authorList.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                    self.filteredArticles.push(ab);
                }
            });
            self.currpage(0);
        }
    };
    self.url = ko.computed(function() {
        return "/api/research/abstracts/list";
    });
    self.loadAbstracts = function() {
        $.getJSON(self.url(), function(data) {
            $.each(data.data, function(idx, d) {
                var auths = [];
                var date = new Date(d.cover_date);
                date = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                var authorList = [];
                $.each(d.authors, function(_, auth) {
                    authorList.push(auth.name);
                })
                var abs = {
                    title: d.title,
                    journal: d.journal,
                    coverDate: new Date(d.cover_date),
                    authors: d.authors,
                    authorList: authorList.join(', '),
                    coverDateString: date,
                    citedByCount: d.citedby_count,
                    text: d.abstract,
                };
                self.articles.push(abs);
            });
            self.articles.sort(function(a, b) {
                return a.coverDate < b.coverDate ? 1 : -1;
            });
            self.filteredArticles(self.articles());
            self.loading(false);
        });
    }
};

function sortArticlesByDate() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortDate()===false) {
            return a.coverDate < b.coverDate ? 1 : -1;
        } else {
            return a.coverDate > b.coverDate ? 1 : -1;
        }
    });
    vm.reverseSortDate(!vm.reverseSortDate()); // toggle sort order
};

function sortArticlesByTitle() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortTitle()===false) {
            return a.title < b.title ? 1 : -1;
        } else {
            return a.title > b.title ? 1 : -1;
        }
    });
    vm.reverseSortTitle(!vm.reverseSortTitle()); // toggle sort order
};

function sortArticlesByJournal() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortJournal()===false) {
            return a.journal < b.journal ? 1 : -1;
        } else {
            return a.journal > b.journal ? 1 : -1;
        }
    });
    vm.reverseSortJournal(!vm.reverseSortJournal()); // toggle sort order
};

function sortArticlesByCitation() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortCitation()===false) {
            return parseInt(a.citedByCount) < parseInt(b.citedByCount) ? 1 : -1;
        } else {
            return parseInt(a.citedByCount) > parseInt(b.citedByCount) ? 1 : -1;
        }
    });
    vm.reverseSortCitation(!vm.reverseSortCitation()); // toggle sort order
};

$.getJSON("/api/research/abstracts/numbers", function(data) {
    var articles_chart_labels = [];
    var articles_chart_data = [];
    var citations_chart_data = [];
    var citations_annual = [];
    var citations_cum = [];
    var cc = 0; // cumulative citations
    var sumNumArticles = 0;
    var meanNumArticles = 0;
    $.each(data.articles, function(idx, article) {
        articles_chart_labels.push(article.year);
        articles_chart_data.push(+article.value);
        sumNumArticles = sumNumArticles + +(article.value);
    });
    meanNumArticles = sumNumArticles / articles_chart_data.length;
    $.each(data.citations, function(idx, citation) {
        citations_annual.push(citation.value);
        cc = cc + citation.value;
        citations_cum.push(cc);
    });
    var backgroundColors = [];
    var color;
    $.each(articles_chart_data, function(ix, d) {
        if(d >= meanNumArticles) {
            color = 'rgba(199,0,57,1)';
        } else {
            color = 'rgba(199,0,57,0.5)';
        }
        backgroundColors.push(color);
    });
    var ctx = document.getElementById('articles_per_year').getContext('2d');
    var articlePerYearChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: articles_chart_labels,
                datasets: [{
                    type: 'bar',
                    label: 'Number of Articles',
                    data: articles_chart_data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: false,
                    text: "Articles Per Year",
                    fontSize: 28
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 15
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Number of Articles",
                            fontSize: 15
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 15
                        }
                    }]
                }
            }
    });
    var citation_chart = document.getElementById('citations_per_year').getContext('2d');
    var articlePerYearChart = new Chart(citation_chart, {
            type: 'line',
            data: {
                labels: articles_chart_labels,
                datasets: [{
                    label: 'Per Year',
                    data: citations_annual,
                    borderColor: 'rgba(36,7,153,0.8)',
                    backgroundColor: 'rgba(36,7,153,0.4)',
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(36,7,153,0.8)',
                    borderWidth: 2,
                    fill: false
                }, {
                    label: 'Cumulative',
                    data: citations_cum,
                    borderColor: 'rgba(226, 6, 76, 0.8)',
                    backgroundColor: 'rgba(226, 6, 76, 0.4)',
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(226, 6, 76, 0.8)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                title: {
                    display: false,
                    text: "Citations Statistics",
                    fontSize: 28
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 15
                        },
                        scaleLabel: {
                            display: true,
                            fontSize: 15,
                            labelString: "Number of Citations"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 15
                        }
                    }]
                }
            }
    });
});

var ctxAll = document.getElementById('all-chart').getContext('2d');
var monthCounts = [0,0,0,0,0,0,0,0,0,0,0,0];
$.getJSON('/api/research/abstracts/list/2017', function(articles) {
    $.each(articles.data, function(idx, article) {
        var m = new Date(article.cover_date).getMonth();
        monthCounts[m] += 1;
    });
    $('#all-total-articles').text(articles.data.length);
    plotArticleCount(ctxAll, monthCounts);
});

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
        data: {
            labels: months,
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
                        suggestedMax: 30, // should make it dynamically adjustable
                        fontSize: 15
                    },
                    scaleLabel: {
                        display: true,
                        fontSize: 15,
                        labelString: "Number of Articles"
                    }
                }],
                xAxes: [{
                    display: true,
                    ticks: {
                        fontSize: 15
                    }
                }]
            }
        }
    });
}

var ctxArticleByField = document.getElementById('article-by-field').getContext('2d');
var articleByField = $.getJSON("/api/research/abstracts/subject_areas/");
$.when(articleByField).done(function(data) {
    var fields = [];
    var articles = {2016: [], 2017: []};
    var years = [2016,2017];
    $.each(years, function(ix, y) {
        $.each(data, function(idx, item) {
            if(item.year === y) {
                $.each(item.counts, function(ix, cnt) {
                    if(cnt.affil==="MUMT") {
                        if(cnt.area!=="ARTS" && cnt.area!=="DENT" && cnt.area!=="SOCI"
                            && cnt.area!=="ECON" && cnt.area!=="BUSI" && cnt.area!=="MATE"
                            && cnt.area!=="ENVI" && cnt.area!=="EART" && cnt.area!=="VETE"
                            && cnt.area!=="DECI" && cnt.area!=="NURS" && cnt.area!=="ENER"
                            && cnt.area!=="PSYC") {
                            articles[y].push(cnt.articles);
                            if ($.inArray(cnt.area, fields) < 0) {
                                fields.push(cnt.area);
                            }
                        }
                    }
                })
            }
        })

    })
    var radarChart = new Chart(ctxArticleByField, {
        type: 'radar',
        data: {
            labels: fields,
            datasets: [
                {
                    label: "2017",
                    data: articles['2017'],
                    borderColor: "rgba(0, 0, 255,0.8)",
                    backgroundColor: "rgba(0, 0, 255, 0.5)",
                    lineTension: 0.0
                },
                {
                    label: "2016",
                    data: articles['2016'],
                    borderColor: "rgba(142, 141, 141,0.8)",
                    backgroundColor: "rgba(142, 141, 141, 0.5)",
                    lineTension: 0.0
                }
            ]
        }
    })
})

var vm = new viewModel();
vm.loadAbstracts();
ko.applyBindings(vm);
vm.query.subscribe(vm.search);