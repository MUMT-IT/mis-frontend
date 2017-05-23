'use strict';

var ctxTitle = document.getElementById('lecturer-title-chart').getContext('2d');
var ctxDegree = document.getElementById('lecturer-degree-chart').getContext('2d');

var lecturers = $.getJSON('/api/employees/', {'job': 'lecturer'});
$.when(lecturers).done(function(data, statusText, _) {
    $('#total-lecturer').text(data.length);
    var titles = categorizeByTitle(data);
    var degrees = [0,0];
    $.each(data, function(ix, person) {
        if(person.highest_degree==3) {
            degrees[1] += 1;
        } else {
            degrees[0] += 1;
        }
    });
    var pieChartTitle = new Chart(ctxTitle, {
        type: 'doughnut',
        data: {
            labels: ["Lecturer", "Assistant Professor", "Associate Professor", "Professor"],
            datasets: [
                {
                    data: titles,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#C37C50",
                    ]
                }
            ]
        }
    })

    var pieChartDegree = new Chart(ctxDegree, {
        type: 'doughnut',
        data: {
            labels: ["Other", "Ph.D."],
            datasets: [
                {
                    data: degrees,
                    backgroundColor: [
                        "#FF6384",
                        "#C37C50",
                    ]
                }
            ]
        }
    })
    var tltPct = [];
    $.each(titles, function(ix, d) {
        tltPct.push((d/data.length * 100.0).toFixed(1))
    })
    var dgrPct = [];
    $.each(degrees, function(ix, d) {
        dgrPct.push((d/data.length * 100.0).toFixed(1))
    })
    $('#lecturer-title-table tbody').append(
        "<tr>" +
        "<td>" + titles[0] + " (" + tltPct[0] + "%)" + "</td>" +
        "<td>" + titles[1] + " (" + tltPct[1] + "%)" + "</td>" +
        "<td>" + titles[2] + " (" + tltPct[2] + "%)" + "</td>" +
        "<td>" + titles[3] + " (" + tltPct[3] + "%)" + "</td>" + "</tr>"
    )
    $('#lecturer-degree-table tbody').append(
        "<tr>" +
        "<td>" + degrees[1] + " (" + dgrPct[1] + "%)" + "</td>" +
        "<td>" + degrees[0] + " (" + dgrPct[0] + "%)" + "</td></tr>"
    )
})

var categorizeByTitle = function(data) {
    var titles = [0,0,0,0];
    $.each(data, function(idx, person) {
        if (person.academic_title == "Lecturer") {
            titles[0] += 1;
        } else if (person.academic_title == "Assistant Professor") {
            titles[1] += 1;
        } else if (person.academic_title == "Associate Professor") {
            titles[2] += 1;
        } else if (person.academic_title == "Professor") {
            titles[3] += 1;
        } else {
            // pass
        }
    });
    return titles;
}
