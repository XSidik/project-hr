$(document).ready(function () {
    const token = localStorage.getItem('token');
    if (token) {
        // Token doesn't exist
        window.location.href = '/dashboard.html';
    }

    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                // alert('Login successful');
                window.location.href = '/dashboard.html';
            } else {
                // alert(data.message);
                $('#errorMessage').text('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});