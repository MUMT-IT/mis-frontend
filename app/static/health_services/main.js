var ctx = document.getElementById("customer-chart").getContext("2d");

$.getJSON("/api/health-services/gdrive/customers/stats/", function(data) {
    var years = [];
    var medilab = [];
    var mobile = [];
    var toxicology = [];
    var chromosome = [];
    var gjmt = [];
    var gjrt = [];
    var excellentCenter = [];
    var gj = [];
    $.each(data, function(idx, d) {
        years.push(d.year);
        $.each(d.data, function(ix, v) {
            if(v.center_slug==="medilab-center" && v.year===d.year) {
                medilab.push(v.customers)
            } else if(v.center_slug==="mobile-unit") {
                mobile.push(v.customers)
            } else if(v.center_slug==="toxicology") {
                toxicology.push(v.customers)
            } else if(v.center_slug==="chromosome") {
                chromosome.push(v.customers)
            } else if(v.center_slug==="gjmt") {
                gjmt.push(v.customers)
            } else if(v.center_slug==="gjrt") {
                gjrt.push(v.customers)
            } else {
                // pass
            }
        })
    })
    for(var i=0; i<gjmt.length; i++) {
        gj.push(gjmt[i] + gjrt[i]);
        excellentCenter.push(toxicology[i] + chromosome[i] + mobile[i]);
    }
    plotChart(ctx, years, medilab, mobile, toxicology, chromosome, gjmt, gjrt, excellentCenter, gj);
})


var plotChart = function (canvas, years, medilab, mobile, toxicology, chromosome, gjmt, gjrt, excellentCenter, gj) {
    var chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: "สถานเวชศาสตร์ชัณสูตร",
                    data: medilab,
                    borderColor: "rgba(65,14,117,0.8)",
                    backgroundColor: "rgba(65,14,117,0.8)",
                    fill: false
                },
                {
                    label: "หน่วยสุขภาพเคลื่อนที่",
                    data: mobile,
                    borderColor: "rgba(20,6,153,0.8)",
                    backgroundColor: "rgba(20,6,153,0.8)",
                    fill: false
                },
                {
                    label: "งานพิษวิทยา",
                    data: toxicology,
                    borderColor: "rgba(6,153,30,0.8)",
                    backgroundColor: "rgba(6,153,30,0.8)",
                    fill: false
                },
                {
                    label: "งานตรวจโครโมโซม",
                    data: chromosome,
                    borderColor: "rgba(153,82,6,0.8)",
                    backgroundColor: "rgba(153,82,6,0.8)",
                    fill: false
                },
                {
                    label: "งานเทคนิคการแพทย์ ศูนย์เทคนิคการแพทย์และรังสีเทคนิคนานาชาติ",
                    data: gjmt,
                    borderColor: "rgba(153,6,13,0.8)",
                    backgroundColor: "rgba(153,6,13,0.8)",
                    fill: false
                },
                {
                    label: "งานรังสีเทคนิค ศูนย์เทคนิคการแพทย์และรังสีเทคนิคนานาชาติ",
                    data: gjrt,
                    borderColor: "rgba(6,145,153,0.8)",
                    backgroundColor: "rgba(6,145,153,0.8)",
                    fill: false
                },
                {
                    label: "ศูนย์เทคนิคการแพทย์และรังสีเทคนิคนานาชาติ",
                    data: gj,
                    borderColor: "rgba(252,240,10,0.8)",
                    backgroundColor: "rgba(252,240,10,0.5)",
                    fill: true
                },
                {
                    label: "ศูนย์พัฒนามาตรฐานและการประเมินผลิตภัณฑ์",
                    data: excellentCenter,
                    borderColor: "rgba(63,214,252,0.8)",
                    backgroundColor: "rgba(63,214,252,0.5)",
                    fill: true
                }
            ]
        }
    })
}
/*
$.getJSON("http://localhost/api/health-services/customers/count/", function(data) {
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
$.getJSON("http://localhost/api/health-services/customers/companies/engagement/", function(data) {
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
*/
