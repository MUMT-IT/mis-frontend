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
        return "http://localhost:8800/api/abstracts/list";
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
            return a.citedByCount < b.citedByCount ? 1 : -1;
        } else {
            return a.citedByCount > b.citedByCount ? 1 : -1;
        }
    });
    vm.reverseSortCitation(!vm.reverseSortCitation()); // toggle sort order
};

$.getJSON("http://localhost:8800/api/abstracts/numbers", function(data) {
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
                    display: true,
                    text: "Articles Per Year",
                    fontSize: 28
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
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
                    label: 'Number of Citations Per Year',
                    data: citations_annual,
                    borderColor: 'navy',
                    borderWidth: 1,
                    pointRadius: 4,
                    pointBackgroundColor: 'navy',
                    fill: false,
                }, {
                    label: 'Cumulative Number of Citations',
                    data: citations_cum,
                    borderColor: 'rgba(249, 162, 250, 0.8)',
                    borderWidth: 1,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(249, 162, 250, 0.8)',
                    fill: false,
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Citations Statistics",
                    fontSize: 28
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
    });
});

var vm = new viewModel();
vm.loadAbstracts();
ko.applyBindings(vm);
vm.query.subscribe(vm.search);