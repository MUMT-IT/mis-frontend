'use strict';

var viewModel = function() {
    var self = this;
    self.statuses = ko.observableArray([
        'In preparation', 'In revision', 'In press', 'Published'
    ]);
    self.articleTitle = ko.observable();
    self.articleCoverDate = ko.observable();
    self.articlePub = ko.observable();
    self.articleAuthors = ko.observable();
    self.articleStatus = ko.observable();
    self.postData = function() {
        var data = JSON.stringify({
                'title': self.articleTitle(),
                'status': self.articleStatus(),
                'authors': self.articleAuthors(),
                'publisher': self.articlePub(),
                'cover_date': self.articleCoverDate()
            });
        $.ajax({
            url: "http://localhost:6600/api/employees/research/",
            crossDomain: true,
            type: "post",
            data: data,
            contentType: "application/json",
        });
    };
}

var vm = new viewModel();

ko.applyBindings(vm);