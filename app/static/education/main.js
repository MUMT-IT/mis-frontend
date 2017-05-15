var ctx = document.getElementById('wrs-chart').getContext('2d');
var data = {
    labels: ["red", "blue", "yellow"],
    datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
        ],
        hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
        ]
    }]
};

var chart = new Chart(ctx, {
    type: 'pie',
    data: data,
});