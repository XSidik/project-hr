const token = localStorage.getItem('token');
if (!token) {
    // Token doesn't exist
    window.location.href = '/index.html';
}

$(document).ready(function () {
    let currentPage = 1;
    let totalPages = 0;
    let pageSize = 10;
    let totalCount = 0;
    let searchQuery = '';

    // Function to fetch and display all employees
    function fetchEmployees(page = currentPage, limit = pageSize, search = searchQuery) {
        $.ajax({
            url: 'http://localhost:3000/employee',
            type: 'GET',
            headers: {
                'Authorization': `${token}`
            },
            data: { page, limit, search },
            success: function (response) {
                currentPage = page;
                totalPages = response.totalPages;
                pageSize = limit;
                totalCount = response.totalCount;

                displayData(response.data);
                displayPagination(response.totalPages, page);

                $('#paginationInfo').text('Showing 1 to ' + pageSize + ' of ' + totalCount + ' rows');
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }

    function displayData(datas) {
        const $dataList = $('#employeeList tbody');
        $dataList.empty();

        const startIndex = (currentPage - 1) * pageSize + 1;

        datas.forEach(function (data, index) {
            const rowNumber = startIndex + index;
            $dataList.append(`<tr>
            <td>${rowNumber}</td>
            <td>${data.name}</td>
            <td>${data.nik}</td>
            <td>${data.whatsapp_number}</td>
            <td>${convertISODateToNormalDate(data.date_of_entry)}</td>
            <td>${data.status}</td>
            <td>${data.departement}</td>
            <td>${data.position}</td>            
            <td>
                <button class="btn btn-outline-success" id="editBtn" data-id="${data.id}">Edit</button>
                <button class="btn btn-outline-danger" id="deleteBtn" data-name="${data.name}" data-id="${data.id}">Delete</button>
            </td>
            </tr>`);
        });
    }

    function displayPagination(totalPages, currentPage) {
        if (pageSize > totalCount) {
            $('#pagination').addClass('d-none');
        } else {
            $('#pagination').removeClass('d-none');
        }

        $('#prevPage').toggleClass('disabled', currentPage === 1);
        $('#nextPage').toggleClass('disabled', currentPage === totalPages);
        $('#firstPage').toggleClass('disabled', currentPage === 1);
        $('#lastPage').toggleClass('disabled', currentPage === totalPages);

        let startPage, endPage;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        let pageNumbersHtml = '';

        if (startPage !== 1) {
            pageNumbersHtml += '<li class="page-item"><a class="page-link pageNumber" href="#" data-page="1">1</a></li>';
            if (startPage > 2) {
                pageNumbersHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbersHtml += `<li class="page-item${i === currentPage ? ' active' : ''}"><a class="page-link pageNumber" href="#" data-page="${i}">${i}</a></li>`;
        }

        if (endPage !== totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbersHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            pageNumbersHtml += `<li class="page-item"><a class="page-link pageNumber" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }

        $('#pageNumbers').html(pageNumbersHtml);
    }

    // Fetch and display employees on page load
    fetchEmployees();

    // Event listeners for pagination buttons
    $(document).on('click', '.pageNumber', function () {
        currentPage = parseInt($(this).data('page'));
        fetchEmployees(currentPage);
        displayPagination();
    });

    $('#prevPage').click(function () {
        if (currentPage > 1) {
            currentPage--;
            fetchEmployees(currentPage);
            displayPagination();
        }
    });

    $('#nextPage').click(function () {
        if (currentPage < totalPages) {
            currentPage++;
            fetchEmployees(currentPage);
            displayPagination();
        }
    });

    $('#firstPage').click(function () {
        currentPage = 1;
        fetchEmployees(currentPage);
        displayPagination();
    });

    $('#lastPage').click(function () {
        currentPage = totalPages;
        fetchEmployees(currentPage);
        displayPagination();
    });

    $('#pageSizeSelect').change(function () {
        pageSize = parseInt($(this).val());
        currentPage = 1;
        fetchEmployees(currentPage);
        displayPagination();
    });

    // Search Form Submission
    $('#searchForm').submit(function (event) {
        event.preventDefault();
        searchQuery = $('#searchInput').val().trim();
        fetchEmployees(1, pageSize, searchQuery);
    });

    // Add employee Form Submission
    $('#addEmployeeForm').submit(function (event) {
        event.preventDefault();
        const name = $('#name').val();
        const nik = $('#nik').val();
        const whatsapp_number = $('#whatsapp_number').val();
        const date_of_entry = $('#date_of_entry').val();
        const status = $('#status').val();
        const departement = $('#departement').val();
        const position = $('#position').val();

        $.ajax({
            url: 'http://localhost:3000/employee',
            type: 'POST',
            headers: {
                'Authorization': `${token}`
            },
            contentType: 'application/json',
            data: JSON.stringify({
                name,
                nik,
                whatsapp_number,
                date_of_entry,
                status,
                departement,
                position
            }),
            success: function (response) {
                $('#modalAddEmployee').modal('hide');
                fetchEmployees();
                $('#addEmployeeForm')[0].reset();
            },
            error: function (xhr, status, error) {
                console.error(error);
                $("#errorAdd").text(error);
            }
        });
    });

    // Update employee Form Submission
    $('#editEmployeeForm').submit(function (event) {
        event.preventDefault();
        const id = $('#edit_id').val();
        const name = $('#edit_name').val();
        const nik = $('#edit_nik').val();
        const whatsapp_number = $('#edit_whatsapp_number').val();
        const date_of_entry = $('#edit_date_of_entry').val();
        const status = $('#edit_status').val();
        const departement = $('#edit_departement').val();
        const position = $('#edit_position').val();

        $.ajax({
            url: `http://localhost:3000/employee/${id}`,
            type: 'PUT',
            headers: {
                'Authorization': `${token}`
            },
            contentType: 'application/json',
            data: JSON.stringify({
                name,
                nik,
                whatsapp_number,
                date_of_entry,
                status,
                departement,
                position
            }),
            success: function (response) {
                $('#modalEditEmployee').modal('hide');
                fetchEmployees(); // Refresh employee list
                $('#editEmployeeForm')[0].reset(); // Clear form fields
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    });

    // Edit employee Button Click Event
    $(document).on('click', '#editBtn', function () {
        const id = $(this).data('id');

        $.ajax({
            url: `http://localhost:3000/employee/${id}`,
            type: 'GET',
            headers: {
                'Authorization': `${token}`
            },
            success: function (response) {
                $('#edit_id').val(response.id);
                $('#edit_name').val(response.name);
                $('#edit_nik').val(response.nik);
                $('#edit_whatsapp_number').val(response.whatsapp_number);
                $('#edit_date_of_entry').val(convertISODateToNormalDate(response.date_of_entry));
                $('#edit_status').val(response.status);
                $('#edit_departement').val(response.departement);
                $('#edit_position').val(response.position);

                $('#modalEditEmployee').modal('show');
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    });

    // Delete employee Button Click Event
    $(document).on('click', '#deleteBtn', function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        console.log(name);
        const isConfirmed = confirm('Are you sure you want to delete ' + name + '?');

        if (isConfirmed) {
            $.ajax({
                url: `http://localhost:3000/employee/${id}`,
                type: 'DELETE',
                headers: {
                    'Authorization': `${token}`
                },
                success: function (response) {
                    fetchEmployees(); // Refresh employee list
                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });
        }
    });

    // upload file
    $('#uploadData').click(function (event) {
        const formData = new FormData();
        formData.append('csvFile', $('#csvFileEmployee')[0].files[0]);

        $.ajax({
            url: 'http://localhost:3000/employee/upload',
            type: 'POST',
            headers: {
                'Authorization': `${token}`
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert('File uploaded successfully.');
                $('#modalUploadEmployee').modal('hide');
                fetchEmployees(); // Refresh employee list
            },
            error: function (xhr, status, error) {
                console.error(error);
                alert('Error uploading file.');
            }
        });
    });

    // // open page wa
    // $('#connectToWa').click(function () {
    //     console.log("here");
    //     $.ajax({
    //         url: 'http://localhost:3000/whatsapp',
    //         type: 'GET',
    //         headers: {
    //             'Authorization': `${token}`
    //         },            
    //         success: function (response) {
    //             console.log(response);
    //         },
    //         error: function (xhr, status, error) {
    //             console.error(error);
    //         }
    //     });
    // });
});
