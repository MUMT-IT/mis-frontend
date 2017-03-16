'use strict';

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var viewModel = function() {
    var self = this;
    self.articles = ko.observableArray([]);
    self.filteredArticles = ko.observableArray([]);
    self.reverse_sort_date = ko.observable(false);
    self.reverse_sort_title = ko.observable(false);
    self.reverse_sort_journal = ko.observable(false);
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
        if(vm.reverse_sort_date()===false) {
            return a.coverDate < b.coverDate;
        } else {
            return a.coverDate > b.coverDate;
        }
    });
    vm.reverse_sort_date(!vm.reverse_sort_date()); // toggle sort order
};

function sortArticlesByTitle() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverse_sort_title()===false) {
            return a.title < b.title;
        } else {
            return a.title > b.title;
        }
    });
    vm.reverse_sort_title(!vm.reverse_sort_title()); // toggle sort order
};

function sortArticlesByJournal() {
    vm.filteredArticles.sort(function(a,b) {
        if(vm.reverse_sort_journal()===false) {
            return a.journal < b.journal;
        } else {
            return a.journal > b.journal;
        }
    });
    vm.reverse_sort_journal(!vm.reverse_sort_journal()); // toggle sort order
};