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

    // Function to fetch and display all salarys
    function fetchsalarys(page = currentPage, limit = pageSize, search = searchQuery) {
        $.ajax({
            url: 'http://localhost:3000/salary',
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
        const $dataList = $('#salaryList tbody');
        $dataList.empty();

        const startIndex = (currentPage - 1) * pageSize + 1;
        // <td>${convertISODateToNormalDate(data.date_of_entry)}</td>

        datas.forEach(function (data, index) {
            const rowNumber = startIndex + index;
            $dataList.append(`<tr>
            <td>${rowNumber}</td>
            <td><span>a</span></td>
            <td>${data.nik}</td>
            <td>${data.Employee.name}</td>
            <td>${data.tanggal_gaji}</td>
            <td>${data.upah_pokok}</td>
            <td>${data.tunjangan_jabatan}</td>
            <td>${data.tunjangan_masa_kerja}</td>
            <td>${data.tunjangan_transport}</td>
            <td>${data.tunjangan_uang_makan}</td>
            <td>${data.uang_makan_Long_shift1}</td>
            <td>${data.uang_makan_Long_shift2}</td>
            <td>${data.tunjangan_shift2}</td>
            <td>${data.tunjangan_shift3}</td>
            <td>${data.premi_kehadiran}</td>
            <td>${data.upah_lembur_hari_biasa_jam}</td>
            <td>${data.upah_lembur_hari_biasa_harga}</td>
            <td>${data.upah_lembur_hari_libur_jam}</td>
            <td>${data.upah_lembur_hari_libur_harga}</td>
            <td>${data.komplain_bulan_lalu}</td>
            <td>${data.penggantian_cuti}</td>
            <td>${data.potongan_absensi}</td>
            <td>${data.potongan_bpjs_dan_jamsostek}</td>
            <td>${data.potongan_koperasi}</td>
            <td>${data.potongan_pinjaman}</td>
            <td>${data.potongan_lain_lain}</td>
            <td>${data.dana_pensiun}</td>
            <td>${data.pph21}</td>            
            </tr>`);
        });

        // <td>
        //     <button class="btn btn-outline-success" id="editBtn" data-id="${data.id}">Edit</button>
        //     <button class="btn btn-outline-danger" id="deleteBtn" data-name="${data.Employee.name}" data-id="${data.id}">Delete</button>
        // </td>
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

    // Fetch and display salarys on page load
    fetchsalarys();

    // Event listeners for pagination buttons
    $(document).on('click', '.pageNumber', function () {
        currentPage = parseInt($(this).data('page'));
        fetchsalarys(currentPage);
        displayPagination();
    });

    $('#prevPage').click(function () {
        if (currentPage > 1) {
            currentPage--;
            fetchsalarys(currentPage);
            displayPagination();
        }
    });

    $('#nextPage').click(function () {
        if (currentPage < totalPages) {
            currentPage++;
            fetchsalarys(currentPage);
            displayPagination();
        }
    });

    $('#firstPage').click(function () {
        currentPage = 1;
        fetchsalarys(currentPage);
        displayPagination();
    });

    $('#lastPage').click(function () {
        currentPage = totalPages;
        fetchsalarys(currentPage);
        displayPagination();
    });

    $('#pageSizeSelect').change(function () {
        pageSize = parseInt($(this).val());
        currentPage = 1;
        fetchsalarys(currentPage);
        displayPagination();
    });

    // Search Form Submission
    $('#searchForm').submit(function (event) {
        event.preventDefault();
        searchQuery = $('#searchInput').val().trim();
        fetchsalarys(1, pageSize, searchQuery);
    });

    // // Add salary Form Submission
    // $('#addsalaryForm').submit(function (event) {
    //     event.preventDefault();
    //     const name = $('#name').val();
    //     const nik = $('#nik').val();
    //     const whatsapp_number = $('#whatsapp_number').val();
    //     const date_of_entry = $('#date_of_entry').val();
    //     const status = $('#status').val();
    //     const departement = $('#departement').val();
    //     const position = $('#position').val();

    //     $.ajax({
    //         url: 'http://localhost:3000/salary',
    //         type: 'POST',
    //         headers: {
    //             'Authorization': `${token}`
    //         },
    //         contentType: 'application/json',
    //         data: JSON.stringify({
    //             name,
    //             nik,
    //             whatsapp_number,
    //             date_of_entry,
    //             status,
    //             departement,
    //             position
    //         }),
    //         success: function (response) {
    //             $('#modalAddsalary').modal('hide');
    //             fetchsalarys();
    //             $('#addsalaryForm')[0].reset();
    //         },
    //         error: function (xhr, status, error) {
    //             console.error(error);
    //             $("#errorAdd").text(error);
    //         }
    //     });
    // });

    // // Update salary Form Submission
    // $('#editsalaryForm').submit(function (event) {
    //     event.preventDefault();
    //     const id = $('#edit_id').val();
    //     const name = $('#edit_name').val();
    //     const nik = $('#edit_nik').val();
    //     const whatsapp_number = $('#edit_whatsapp_number').val();
    //     const date_of_entry = $('#edit_date_of_entry').val();
    //     const status = $('#edit_status').val();
    //     const departement = $('#edit_departement').val();
    //     const position = $('#edit_position').val();

    //     $.ajax({
    //         url: `http://localhost:3000/salary/${id}`,
    //         type: 'PUT',
    //         headers: {
    //             'Authorization': `${token}`
    //         },
    //         contentType: 'application/json',
    //         data: JSON.stringify({
    //             name,
    //             nik,
    //             whatsapp_number,
    //             date_of_entry,
    //             status,
    //             departement,
    //             position
    //         }),
    //         success: function (response) {
    //             $('#modalEditsalary').modal('hide');
    //             fetchsalarys(); // Refresh salary list
    //             $('#editsalaryForm')[0].reset(); // Clear form fields
    //         },
    //         error: function (xhr, status, error) {
    //             console.error(error);
    //         }
    //     });
    // });

    // // Edit salary Button Click Event
    // $(document).on('click', '#editBtn', function () {
    //     const id = $(this).data('id');

    //     $.ajax({
    //         url: `http://localhost:3000/salary/${id}`,
    //         type: 'GET',
    //         headers: {
    //             'Authorization': `${token}`
    //         },
    //         success: function (response) {
    //             $('#edit_id').val(response.id);
    //             $('#edit_name').val(response.name);
    //             $('#edit_nik').val(response.nik);
    //             $('#edit_whatsapp_number').val(response.whatsapp_number);
    //             $('#edit_date_of_entry').val(convertISODateToNormalDate(response.date_of_entry));
    //             $('#edit_status').val(response.status);
    //             $('#edit_departement').val(response.departement);
    //             $('#edit_position').val(response.position);

    //             $('#modalEditsalary').modal('show');
    //         },
    //         error: function (xhr, status, error) {
    //             console.error(error);
    //         }
    //     });
    // });

    // // Delete salary Button Click Event
    // $(document).on('click', '#deleteBtn', function () {
    //     const id = $(this).data('id');
    //     const name = $(this).data('name');
    //     console.log(name);
    //     const isConfirmed = confirm('Are you sure you want to delete ' + name + '?');

    //     if (isConfirmed) {
    //         $.ajax({
    //             url: `http://localhost:3000/salary/${id}`,
    //             type: 'DELETE',
    //             headers: {
    //                 'Authorization': `${token}`
    //             },
    //             success: function (response) {
    //                 fetchsalarys(); // Refresh salary list
    //             },
    //             error: function (xhr, status, error) {
    //                 console.error(error);
    //             }
    //         });
    //     }
    // });

    // upload file
    $('#uploadData').click(function (event) {
        const formData = new FormData();
        formData.append('csvFile', $('#csvFileSalary')[0].files[0]);

        $.ajax({
            url: 'http://localhost:3000/salary/upload',
            type: 'POST',
            headers: {
                'Authorization': `${token}`
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert('File uploaded successfully.');
                $('#modalUploadSalary').modal('hide');
                fetchsalarys(); // Refresh salary list
            },
            error: function (xhr, status, error) {
                console.error(error);
                alert('Error uploading file.');
            }
        });
    });

    // send file to wa
    $('#sendPayslip').click(function (event) {
        // const formData = new FormData();
        // formData.append('csvFile', $('#csvFileSalary')[0].files[0]);

        $('#modalSendSalary').modal('hide');
        $('#loadingModal').modal('show');

        $.ajax({
            url: 'http://localhost:3000/whatsapp/sendSalarySlip',
            type: 'POST',
            headers: {
                'Authorization': `${token}`
            },
            // data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert('send salary slip to wa successfully.');
                $('#loadingModal').modal('hide');
                fetchsalarys(); // Refresh salary list
            },
            error: function (xhr, status, error) {
                console.error(error);
                alert('Error send salary slip to wa.');
                $('#loadingModal').modal('hide');
            }
        });
    });
});
