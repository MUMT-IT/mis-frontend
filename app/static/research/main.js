'use strict';

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var viewModel = function() {
    var self = this;
    self.articles = ko.observableArray([]);
    self.filteredArticles = ko.observableArray([]);
    self.reverseSortDate = ko.observable(false);
    self.reverseSortTitle = ko.observable(false);
    self.reverseSortJournal = ko.observable(false);
    self.reverseSortCitation = ko.observable(false);
    self.query = ko.observable('');
    self.search = function (query) {
        self.filteredArticles([]);
        if(query === '') {
            self.filteredArticles(self.articles());
        } else {
            $.each(self.articles(), function(idx, ab) {
                if(ab.title.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ab.journal.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ab.authorList.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                    self.filteredArticles.push(ab);
                }
            });
        }
    };
};
var vm = new viewModel();
$.getJSON("http://localhost:5050/api/abstracts/2017", function(data) {
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
        vm.articles.push(abs);
    });
    vm.filteredArticles(vm.articles());
});
ko.applyBindings(vm);
vm.query.subscribe(vm.search);
function sortArticlesByDate() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortDate()===false) {
            return a.coverDate < b.coverDate;
        } else {
            return a.coverDate > b.coverDate;
        }
    });
    vm.reverseSortDate(!vm.reverseSortDate()); // toggle sort order
};

function sortArticlesByTitle() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortTitle()===false) {
            return a.title < b.title;
        } else {
            return a.title > b.title;
        }
    });
    vm.reverseSortTitle(!vm.reverseSortTitle()); // toggle sort order
};

function sortArticlesByJournal() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortJournal()===false) {
            return a.journal < b.journal;
        } else {
            return a.journal > b.journal;
        }
    });
    vm.reverseSortJournal(!vm.reverseSortJournal()); // toggle sort order
};

function sortArticlesByCitation() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverseSortCitation()===false) {
            return a.citedByCount < b.citedByCount;
        } else {
            return a.citedByCount > b.citedByCount;
        }
    });
    vm.reverseSortCitation(!vm.reverseSortCitation()); // toggle sort order
};