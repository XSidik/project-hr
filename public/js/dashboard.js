const token = localStorage.getItem('token');
if (!token) {
    // Token doesn't exist
    window.location.href = '/index.html';
}

$(document).ready(function () {
    // Dummy data for the chart
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Total Users',
            data: [100, 150, 200, 250, 300, 350, 400],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    // Render the chart
    const ctx = document.getElementById('userChart').getContext('2d');
    const userChart = new Chart(ctx, config);
});
