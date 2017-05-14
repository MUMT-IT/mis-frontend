'use strict';
var viewModel;

viewModel = function () {
    var self = this;
    self.departmentName = ko.observable();
    self.departmentHead = ko.observableArray([]);
    self.employees = ko.observableArray([]);
    self.loadData = function () {
        var dept_oid;
        $.getJSON("http://localhost:6600/api/employees/",
            {"department_slug": "community-mt"}, function(data) {
            $.each(data, function(idx, e) {
                var emp = {
                    "name": e.first_name_en + " " + e.last_name_en,
                    "email": e.email,
                    "id": e["_id"]["$oid"],
                    "imgUrl": "http://localhost:6600/api/employees/image/" + e["_id"]["$oid"],
                    "profileUrl": "http://localhost:5000/employee/profile/" + e["_id"]["$oid"],
                };
                if (e["contact"]) {
                    var contact = e["contact"];
                    emp["campus"] = contact["building_campus_en"] || "n/a";
                    emp["officeRoom"] = contact["office_number"] || "n/a";
                    emp["cellphone"] = contact["cellphone"] || "n/a";
                } else {
                    emp["officeRoom"] = "n/a";
                    emp["campus"] = "n/a";
                    emp["cellphone"] = "n/a";
                }
                dept_oid = e.department["$oid"];
                self.employees.push(emp);
            });
            $.getJSON("http://localhost:6600/api/affiliations/" + dept_oid,
                function(data) {
                    var d = data[0];  // a single department in an array
                    var dept = {
                        'headId': d["head"]["$oid"],
                        "nameEN": d["name_en"]
                    };
                    self.departmentName(dept["nameEN"]);
                    var deptMembersOnly = [];
                    $.each(self.employees(), function(idx, e) {
                        if(e["id"] === dept["headId"]) {
                            self.departmentHead.push(e);
                        } else {
                            deptMembersOnly.push(e);
                        }
                    });
                    self.employees(deptMembersOnly);
                }
            );
        });
    };
};

var vm = new viewModel();
ko.applyBindings(vm);
vm.loadData();
