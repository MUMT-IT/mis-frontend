var ctx = document.getElementById("customer-chart").getContext("2d");
var ctx2 = document.getElementById("companies-chart").getContext("2d");

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
$.getJSON("http://localhost:5000/api/customers/companies/engagement/", function(data) {
    var oldCustomersPct = [];
    var newCustomersPct = [];
    var years = [];
    var oldBgColors = [];
    var newBgColors = [];
    $.each(data.data, function(idx, d) {
        var oldCustomers = 0;
        var newCustomers = 0;
        $.each(d.value, function(ix, v) {
            if(parseInt(v.count) > 1) {
                oldCustomers += 1;
            } else {
                newCustomers += 1;
            }
        });
        years.push(d.year);
        oldCustomersPct.push(oldCustomers/(oldCustomers+newCustomers)*100.0);
        newCustomersPct.push(newCustomers/(oldCustomers+newCustomers)*100.0);
        oldBgColors.push('rgba(247, 85, 9, 0.8)')
        newBgColors.push('rgba(247, 231, 9, 0.8)')
    });
    var myChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: "ลูกค้าเก่า",
                data: oldCustomersPct,
                backgroundColor: oldBgColors,
                borderWidth: 2
            },
                {
                    label: "ลูกค้าใหม่",
                    data: newCustomersPct,
                    backgroundColor: newBgColors,
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
            },
            stacked :true
        }
    })
});
