<?php
// Include the configuration files
if (file_exists('config.creds.php')) {
    require 'config.creds.php'; // Use Local credentials, not tracked by Git
} else {
    require 'config.php'; // Use Repo credential, tracked by Git
}
if (file_exists('database.creds.php')) {
    require 'database.creds.php'; // Use Local credentials, not tracked by Git
} else {
    require 'database.php'; //  Use Repo credential, tracked by Git
}

// Create a connection to the database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Connection failed']);
    exit();
}

// Define the table names
$passwordsTable = DB_PASSWD_TABLE;
$ipTable = DB_IP_TABLE;

// Get the JSON data from the request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
    exit();
}

// Extract the data
$submittedPassword = $data['password'] ?? '';
$macAddress = $data['mac_address'] ?? '';
$ipAddress = $data['ip_address'] ?? '';
$pcName = $data['pc_name'] ?? '';

// Prepare and execute the query to get the password
$sql = $conn->prepare("
    SELECT passwd 
    FROM $passwordsTable 
    WHERE app = 'weblogin' 
    AND username = 'admin' 
");

$sql->execute();
$result = $sql->get_result();

// Check if any rows were returned
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $storedPassword = $row['passwd'];

    // Cross-validate the password
    if ($submittedPassword === $storedPassword) {
        $sql->close();
        
    // Prepare and execute the query to insert the PC data
    $sql = $conn->prepare("
            INSERT INTO iplog (`mac_address`, `ip_address`, `pc_name`, `update_time`) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            AS new_data
            ON DUPLICATE KEY UPDATE 
            ip_address = new_data.ip_address, 
            pc_name = new_data.pc_name,
            update_time = new_data.update_time;");
        $sql->bind_param('sss', $macAddress, $ipAddress, $pcName);

        if ($sql->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Data updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update data']);
        }

    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Incorrect password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No record found for the application name']);
}

// Close the SQL connection
$sql->close();
$conn->close();
?>
