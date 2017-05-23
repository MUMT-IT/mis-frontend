'use strict';

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var articlePerPage = 30;
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
    var currYear = new Date().getFullYear();
    self.url = ko.computed(function() {
        return "/api/research/abstracts/list/" + currYear;
    });
    self.loadAbstracts = function() {
        $.getJSON(self.url(), function(data) {
            $.each(data.data, function(idx, d) {
                var auths = [];
                var date = new Date(d.cover_date);
                date = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                var authorList = [];
                $.each(d.authors, function(_, auth) {
                    var name = auth.last_name + " " + auth.first_name[0];
                    authorList.push(name);
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

var ctxAll = document.getElementById('all-chart').getContext('2d');
var monthCounts = [0,0,0,0,0,0,0,0,0,0,0,0];
var mostPubMonth = 0;
$.getJSON('/api/research/abstracts/list/2017', function(articles) {
    $.each(articles.data, function(idx, article) {
        var m = new Date(article.cover_date).getMonth();
        monthCounts[m] += 1;
        if (m > mostPubMonth) {
            mostPubMonth = m;
        }
    });
    $('#all-total-articles').text(articles.data.length);
    plotArticleCount(ctxAll, monthCounts, mostPubMonth);
});

var plotArticleCount = function(canvas, countData, mostPubMonth) {
    var cumData = [];
    var cnt = 0;
    for(var i=0; i<=mostPubMonth; i++) {
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
                    data: countData.slice(0,mostPubMonth+1),
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
                        suggestedMax: 30 // should make it dynamically adjustable
                    }
                }]
            }
        }
    });
}

var vm = new viewModel();
vm.loadAbstracts();
ko.applyBindings(vm);
vm.query.subscribe(vm.search);
