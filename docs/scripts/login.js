/**************************
* Login Page forntend js
**************************/

particlesJS.load('particles-js', 'assets/particles.json', function () {
    console.log('Login page loaded');
});

var wrongPasswordElem = document.getElementById('wrong-password');
var rightPasswordElem = document.getElementById('right-password');
var securityCodeElem = document.getElementById('securityCodeHint');

// Function to display alert message
function showAlert(message) {
    alert(message);
}

// Function to display notification message
function showNotification(message, delay) {
    const notificationElem = document.createElement('div');
    notificationElem.classList.add('notification');
    notificationElem.innerHTML = `
        <span>${message}</span>
        <button class="close-btn">&times;</button>
    `;
    document.body.appendChild(notificationElem);
    setTimeout(() => {
        notificationElem.classList.add('fade-out');
        setTimeout(() => {
            notificationElem.remove();
        }, 500);
    }, delay);
    notificationElem.querySelector('.close-btn').addEventListener('click', () => {
        notificationElem.remove();
    });
}

// Function to display information message
function showInformation(message, buttonMsg, callback) {
    const infoElem = document.createElement('div');
    infoElem.classList.add('information');
    infoElem.innerHTML = `
    <span>${message}</span>
    <button class="info-btn">${buttonMsg}</button>
    <button class="close-btn">&times;</button>
    `;
    document.body.appendChild(infoElem);
    infoElem.querySelector('.info-btn').addEventListener('click', () => {
        infoElem.remove();
        if (callback) callback();
    });
    infoElem.querySelector('.close-btn').addEventListener('click', () => {
        infoElem.remove();
    });
}

// Function to insert IP table
function insertTable(data) {
    var tableContainer = document.getElementById('table-container');
    var table = document.createElement('table');
    table.className = 'pc-info-table';

    var thead = `<thead><tr><th>PC NAME</th><th>IP Address</th><th>UPDATED ON</th></tr></thead>`;
    var tbody = '<tbody>';
    data.forEach(function (row) {
        const date = new Date(row.update_time);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        tbody += `<tr>
            <td>${row.pc_name}</td>
            <td>${row.ip_address}</td>
            <td>${hours}:${minutes} ${day}/${month}/${year}</td>
        </tr>`;
    });
    tbody += '</tbody>';

    table.innerHTML = thead + tbody;
    tableContainer.appendChild(table);
}

// Function to handle pin
function handleSubmit(event) {
    event.preventDefault();
    var pin = getPin();
    var formData = new FormData();
    formData.append('password', pin);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/fetch.php', true);
    xhr.onload = function () {
        var xhrStatus = xhr.status;
        if (xhrStatus === 200) {
            var response = JSON.parse(xhr.responseText);

            if (response.status === 'success') {
                console.log('Authentication Success');
                securityCodeElem.innerText = 'Access Granted';
                securityCodeElem.style.opacity = '1';
                setTimeout(function () {
                    securityCodeElem.style.opacity = '0';
                    setTimeout(function () {
                        securityCodeElem.style.opacity = '1';
                    }, 500);
                    document.getElementById('pin').value = '';
                    document.getElementById('c1').focus();
                    pinChanged();
                    document.getElementById('login-section').style.display = 'none';
                    document.getElementById('table-container').style.display = 'flex';
                    const postLogin = document.querySelectorAll('.postLoginHeader');
                    postLogin.forEach(container => {
                        container.style.display = 'block';
                    });
                    insertTable(response.data);
                    window.scrollBy(0, -1000);
                }, 500);
            } else {
                securityCodeElem.innerText = 'Incorrect Password';
                securityCodeElem.style.opacity = '1';
                setTimeout(function () {
                    securityCodeElem.style.opacity = '0';
                    setTimeout(function () {
                        securityCodeElem.innerText = 'Enter 4-digit PIN';
                        securityCodeElem.style.opacity = '1';
                    }, 500);
                }, 1000);
                document.getElementById('pin').value = '';
                document.getElementById('c1').focus();
                pinChanged();
            }
        } else if (xhrStatus === 405) {
            showAlert('Please use the IITK URL to access this page');
        } else {
            showAlert('An error occurred during the request');
        }
    };
    xhr.send(formData);
}


// Function to update visible inputs with asterisks, 
// when the hidden input changes
function pinChanged() {
    const pin = getPin();
    for (let i = 1; i <= 4; i++) {
        document.getElementById("c" + i).value = i <= pin.length ? "*" : "";
    }
    pinFocused();
}

// Function to focus on the correct visible input
function pinFocused() {
    const pin = getPin();
    const focusIndex = pin.length; // Index from 0 to 3

    pinUnfocused(); // Remove focus from all inputs

    if (focusIndex >= 0 && focusIndex < 4) {
        const cId = "c" + (focusIndex + 1);
        const focusedElement = document.getElementById(cId);
        if (focusedElement) {
            focusedElement.classList.add("focus");
        }
    }
}

// Function to remove focus from all visible inputs
function pinUnfocused() {
    ["c1", "c2", "c3", "c4"].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove("focus");
        }
    });
}

// Function to get the hidden input value
function getPin() {
    let pin = document.getElementById("pin").value;
    if (pin.length >= 4) {
        pin = pin.substr(0, 4);
    }
    return pin;
}

// Function to focus on the hidden input when visible inputs are clicked on
function focusHiddenInput() {
    document.getElementById('pin').focus();
}

// On window load, add event listeners
window.onload = function () {
    if (window.innerWidth >= 640) {
        document.getElementById('pin').focus();
    } else {
        document.getElementById('pin').addEventListener('focus', function () {
            window.scrollBy(0, 1000);
        });
    }
    document.getElementById('login-form').addEventListener('submit', handleSubmit);
}

// Function to handle the Manual link click
function handleManualClick(anchor) {
    showInformation(
        'Access is restricted to INTENT Labs GitHub members only', "continue",
        () => window.open('https://github.com/intentlabiitk/intentlabmanual', '_blank')
    );
    console.log('Manual is accessed')
}
