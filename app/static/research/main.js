'use strict';

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var viewModel = function() {
    var self = this;
    self.articles = ko.observableArray([]);
    self.filteredArticles = ko.observableArray([]);
    self.reverse_sort = ko.observable(false);
    self.query = ko.observable('');
    self.search = function (query) {
        self.filteredArticles([]);
        if(query === '') {
            self.filteredArticles(self.articles());
        } else {
            $.each(self.articles(), function(idx, ab) {
                if(ab.title.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ab.journal.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ab.authors.toLowerCase().indexOf(query.toLowerCase()) > -1) {
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
        var abs = {
            title: d.title,
            journal: d.journal,
            cover_date: new Date(d.cover_date),
            authors: d.authors,
            cover_date_string: date
        };
        vm.articles.push(abs);
    });
    vm.filteredArticles(vm.articles());
});
ko.applyBindings(vm);
vm.query.subscribe(vm.search);
function sortArticlesByDate() {
    vm.articles.sort(function(a,b) {
        if(vm.reverse_sort()===false) {
            return a.cover_date < b.cover_date;
        } else {
            return a.cover_date > b.cover_date;
        }
    });
    vm.reverse_sort(!vm.reverse_sort()); // toggle sort order
    console.log(vm.reverse_sort());
};