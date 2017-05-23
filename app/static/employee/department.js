'use strict';
var viewModel;

viewModel = function () {
    var self = this;
    self.academic_titles_th = {
        'Assistant Professor': 'ผู้ช่วยศาสตราจารย์',
        'Associate Professor': 'รองศาสตราจารย์',
        'Professor': 'ศาสตราจารย์',
        'Lecturer': 'อาจารย์'
    };
    self.departmentName = ko.observable();
    self.departmentHead = ko.observableArray([]);
    self.employees = ko.observableArray([]);
    self.loadData = function () {
        $.getJSON("/api/employees/",
            {"department_slug": dept_slug}, function(data) {
            $.each(data, function(idx, e) {
                var emp = {
                    "name_en": e.first_name_en + " " + e.last_name_en,
                    "name_th": e.first_name_th + " " + e.last_name_th,
                    "degree": e.highest_degree,
                    "position": e.academic_title,
                    "email": e.email,
                    "id": e["_id"]["$oid"],
                    "imgUrl": "/api/employees/image/" + e["_id"]["$oid"],
                    "profileUrl": "/employee/profile/" + e["_id"]["$oid"],
                };
                emp["degree_en"] = emp["degree"] == 3 ? "Dr." : "";
                emp["degree_th"] = emp["degree"] == 3 ? "ดร." : "";
                emp["position_en"] = emp["position"];
                emp["position_th"] = self.academic_titles_th[emp["position"]];
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
                self.employees.push(emp);
            });
            $.getJSON("/api/employees/affiliations/slug/" + dept_slug,
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
