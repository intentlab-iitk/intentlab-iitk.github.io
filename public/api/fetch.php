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

// Get the submitted data
$submittedPassword = $_POST['password'] ?? '';

// Define the table names
$passwordsTable = DB_PASSWD_TABLE;
$ipTable = DB_IP_TABLE;

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

        // Now Fetch the PCs Data
        $sql = $conn->prepare("
            SELECT pc_name, ip_address, update_time
            FROM $ipTable 
            ORDER BY update_time DESC
        ");
        $sql->execute();
        $sql->execute();
        $result = $sql->get_result();

        $pcData = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $pcData[] = $row;
            }
            echo json_encode(['status' => 'success', 'data' => $pcData]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No PC data found']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No record found for the application name']);
}

// Close the SQL connection
$sql->close();
$conn->close();
?>
