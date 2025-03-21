<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'conexion.php'; // Archivo externo para la conexión a la base de datos

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM usuario WHERE id_usu = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: ['error' => 'Usuario no encontrado']);
        } else {
            echo json_encode($pdo->query("SELECT * FROM usuario")->fetchAll(PDO::FETCH_ASSOC));
        }
        break;
    case 'POST':
        if (isset($input['fecha_nacimiento'], $input['nombre'], $input['apellidos'], $input['usuario'], $input['contra'])) {
            $stmt = $pdo->prepare("INSERT INTO usuario (fecha_nacimiento, nombre, apellidos, usuario, contra) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$input['fecha_nacimiento'], $input['nombre'], $input['apellidos'], $input['usuario'], $input['contra']]);
            echo json_encode(['id_usu' => $pdo->lastInsertId()]);
        } else {
            echo json_encode(['error' => 'Datos incompletos']);
        }
        break;
    case 'PUT':
        if (isset($input['id_usu'], $input['fecha_nacimiento'], $input['nombre'], $input['apellidos'], $input['usuario'], $input['contra'])) {
            $stmt = $pdo->prepare("UPDATE usuario SET fecha_nacimiento = ?, nombre = ?, apellidos = ?, usuario = ?, contra = ? WHERE id_usu = ?");
            $stmt->execute([$input['fecha_nacimiento'], $input['nombre'], $input['apellidos'], $input['usuario'], $input['contra'], $input['id_usu']]);
            echo json_encode(['updated' => $stmt->rowCount()]);
        } else {
            echo json_encode(['error' => 'Datos incompletos']);
        }
        break;
    case 'DELETE':
        if (isset($input['id'])) {
            $stmt = $pdo->prepare("DELETE FROM usuario WHERE id_usu = ?");
            echo json_encode(['deleted' => $stmt->execute([$input['id']])]);
        } else {
            echo json_encode(['error' => 'ID no proporcionado']);
        }
        break;
    default:
        echo json_encode(['error' => 'Método no permitido']);
}
