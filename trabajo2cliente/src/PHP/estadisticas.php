<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once 'conexion.php'; // Asegúrate de que este archivo define $conn para mysqli

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

// Estadísticas


if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $id_usu = intval($_GET["id_usu"]);
    $mes = intval($_GET["mes"]);
    $anio = intval($_GET["anio"]);

    $sql = "SELECT AVG(lenta) AS promedio, MIN(lenta) AS minimo, MAX(lenta) AS maximo 
            FROM control_glucosa
            INNER JOIN usuario ON usuario.id_usu = control_glucosa.id_usu
            WHERE usuario.id_usu = ? 
            AND MONTH(fecha) = ? 
            AND YEAR(fecha) = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iii", $id_usu, $mes, $anio);
    $stmt->execute();
    $resultado = $stmt->get_result()->fetch_assoc();

    echo json_encode($resultado);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}

$conexion->close();
?>