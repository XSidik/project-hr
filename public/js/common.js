$('#logoutBtn').click(function () {
    // Remove token from local storage
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = '/index.html'; // Assuming your login page is named index.html
});

function convertISODateToNormalDate(data) {
    let date = new Date(data);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    let dtDate = year + '-' + month + '-' + dt;

    return dtDate;
}