var ctx = document.getElementById("customer-chart").getContext("2d");

var viewModel = function() {
    var self = this;
    $.getJSON("http://localhost:5000/api/customers/count/", function(data) {
        var counts = [];
        var years = [];
        var bgColors = [];
        $.each(data.data, function(idx, d) {
            counts.push(parseInt(d.count));
            years.push(d.year);
            bgColors.push('rgba(27, 69, 136, 0.8)')
        });
        console.log(counts, years);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: "จำนวนผู้มารับบริการทางสุขภาพ",
                    data: counts,
                    backgroundColor: bgColors,
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    });
}

var vm = new viewModel();
ko.applyBindings(vm);