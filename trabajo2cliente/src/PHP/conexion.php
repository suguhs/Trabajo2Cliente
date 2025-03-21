<?php
    $hn = 'localhost:3307';  // Puerto 3307 en lugar del predeterminado 3306
    $un = 'root';
    $pw = '';
    $db = 'diabetesdb';

    $conn = new mysqli($hn, $un, $pw, $db);

    // Verificar conexión
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]));
    }
?>
