var viewModel = function() {
    var self = this;
    self.papers = ko.observableArray([]);
    self.otherPapers = ko.observableArray([]);
    self.publishedYears = ko.observableArray([]);
    self.loadData = function () {
        $.getJSON("http://localhost:5570/api/employees/" + employee_id,
            function(data) {
                self.employee = data;
                self.imgUrl = "http://localhost:5570/api/employees/image/" + self.employee["_id"]["$oid"];
                $("#profileImg").attr("src", self.imgUrl);
                $("#employee_email").attr("href", "mailto:" + self.employee.email);
                $("#employee_email").text(self.employee.email);
                $("#employee_name").text(self.employee.first_name_en + " " + self.employee.last_name_en);
                $.getJSON("http://localhost:8800/api/abstracts/authors/", {
                    "first_name": self.employee.first_name_en,
                    "last_name": self.employee.last_name_en
                }, function(data) {
                    $.each(data.data, function(idx, d) {
                        var authorList= [];
                        $.each(d.authors, function(ix, au) {
                            authorList.push(au.name);
                        });
                        var paper = {
                            "title": d.title,
                            "publication_name": d.publication_name,
                            "cover_date": new Date(d.cover_date).getFullYear(),
                            "authors": authorList.join(", "),
                            "citedby_count": d.citedby_count
                        }
                        self.publishedYears.push(paper.cover_date);
                        self.papers.push(paper);
                    })
                });
                /*
                var dept_id = self.employee.department["$oid"];
                $.getJSON("http://localhost:5570/api/affiliations/" + dept_id,
                    function(data) {
                        $("#department_name").text(data[0].name_en);
                    }
                );
                */
                $.getJSON("http://localhost:8800/api/employees/research/" + self.employee["_id"]["$oid"],
                    function(data) {
                    $.each(data, function(ix, ar) {
                        var article = {
                            "title": ar.title,
                            "cover_date": new Date(ar.cover_date["$date"]).getFullYear(),
                            "publisher": ar.publisher,
                            "status": ar.status,
                            "authors": ar.author_list,
                        }
                        self.otherPapers.push(article);
                    });
                });
            }
        );
    }
}

var vm = new viewModel();
vm.loadData();
ko.applyBindings(vm);
