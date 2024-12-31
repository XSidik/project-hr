const token = localStorage.getItem('token');
if (!token) {
    // Token doesn't exist
    window.location.href = '/index.html';
}

$(document).ready(function () {
    $('#formMsg').submit(function (event) {
        event.preventDefault();
        const message = $('#msg').val();
        const phone = $('#whatsapp_number').val();

        $.ajax({
            url: 'http://localhost:3000/whatsapp/send',
            type: 'POST',
            headers: {
                'Authorization': `${token}`
            },
            contentType: 'application/json',
            data: JSON.stringify({
                message,
                phone
            }),
            success: function (response) {
                alert('message sent.');
                $('#formMsg')[0].reset();
            },
            error: function (xhr, status, error) {
                alert('send message failed.');
                console.error(error);
            }
        });
    });
});
