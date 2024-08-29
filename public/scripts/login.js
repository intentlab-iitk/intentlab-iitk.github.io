particlesJS.load('particles-js', 'assets/particles.json', function () {
    console.log('Particles.js loaded');
});

var wrongPasswordElem = document.getElementById('wrong-password');
var rightPasswordElem = document.getElementById('right-password');

function handleSubmit(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/fetch_data.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            wrongPasswordElem.style.opacity = '0';
            rightPasswordElem.style.opacity = '0';

            if (response.status === 'success') {
                console.log('Authentication Success, token stored');
                rightPasswordElem.style.display = 'block';
                rightPasswordElem.style.opacity = '1';
                setTimeout(function () {
                    // Insert the table with the data
                    document.getElementById('login-section').style.display = 'none';
                    document.getElementById('table-container').style.display = 'flex';
                    const postLogin = document.querySelectorAll('.postLoginHeader');
                    postLogin.forEach(container => {
                        container.style.display = 'block';
                    });
                    insertTable(response.data);
                }, 500);
            } else {
                wrongPasswordElem.style.display = 'block';
                wrongPasswordElem.style.opacity = '1';
                setTimeout(function () {
                    wrongPasswordElem.style.opacity = '0';
                    setTimeout(function () {
                        wrongPasswordElem.style.display = 'none';
                    }, 500);
                }, 1000);
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        } else {
            showAlert('An error occurred during the request.');
        }
    };
    xhr.send(formData);
}

function insertTable(data) {
    var tableContainer = document.getElementById('table-container');
    var table = document.createElement('table');
    table.className = 'pc-info-table';

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    var columns = ['PC NAME', 'IP Addr', 'UPDATED ON'];
    columns.forEach(function (col) {
        var th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    data.forEach(function (row) {
        var tr = document.createElement('tr');
        var pcNameTd = document.createElement('td');
        var ipAddrTd = document.createElement('td');
        var lastUpdateTd = document.createElement('td');

        pcNameTd.textContent = row.pc_name;
        ipAddrTd.textContent = row.ip_address;
        lastUpdateTd.textContent = row.update_time;

        tr.appendChild(pcNameTd);
        tr.appendChild(ipAddrTd);
        tr.appendChild(lastUpdateTd);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}


function fetchPCInfo() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/fetch_pc_info.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status === 'success') {
                insertTable(response.data);
            } else {
                showAlert('Failed to fetch PC information.');
            }
        } else {
            showAlert('An error occurred during the request.');
        }
    };
    xhr.send();
}

function showAlert(message) {
    alert(message);
}

// On window load
window.onload = function () {
    document.getElementById('password').focus();
    document.getElementById('login-form').addEventListener('submit', handleSubmit);
};
