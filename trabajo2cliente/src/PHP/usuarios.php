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

// Funciones CRUD para la tabla usuario
function getAllUsuarios($conn)
{
    $result = $conn->query("SELECT id_usu, fecha_nacimiento, nombre, apellidos, usuario FROM usuario");
    return $result->fetch_all(MYSQLI_ASSOC);
}

function getUsuarioById($id, $conn)
{
    $stmt = $conn->prepare("SELECT id_usu, fecha_nacimiento, nombre, apellidos, usuario FROM usuario WHERE id_usu = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

function createUsuario($data, $conn)
{
    if (!isset($data['fecha_nacimiento'], $data['nombre'], $data['apellidos'], $data['usuario'], $data['contra'])) {
        return false;
    }

    $hashedPassword = password_hash($data['contra'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO usuario (fecha_nacimiento, nombre, apellidos, usuario, contra) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $data['fecha_nacimiento'], $data['nombre'], $data['apellidos'], $data['usuario'], $hashedPassword);

    return $stmt->execute() ? $conn->insert_id : false;
}

function updateUsuarioById($id, $data, $conn)
{
    if (!isset($data['fecha_nacimiento'], $data['nombre'], $data['apellidos'], $data['usuario'])) {
        return false;
    }

    $stmt = $conn->prepare("UPDATE usuario SET fecha_nacimiento = ?, nombre = ?, apellidos = ?, usuario = ? WHERE id_usu = ?");
    $stmt->bind_param("ssssi", $data['fecha_nacimiento'], $data['nombre'], $data['apellidos'], $data['usuario'], $id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteUsuarioById($id, $conn)
{
    $stmt = $conn->prepare("DELETE FROM usuario WHERE id_usu = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    return $stmt->affected_rows;
}

// Procesa las solicitudes según el método HTTP
try {
    


    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            if (isset($_GET['id'])) {
                $id = intval($_GET['id']);
                $usuario = getUsuarioById($id, $conn);
                if ($usuario) {
                    echo json_encode($usuario);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => "No se encontró el usuario con ID $id."]);
                }
            } else {
                echo json_encode(getAllUsuarios($conn));
            }
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $handler = fopen('./output.txt', 'a');
    fwrite($handler, json_encode($input) . PHP_EOL);
    fclose($handler);

            $nuevoId = createUsuario($input, $conn);
            if ($nuevoId) {
                http_response_code(201);
                echo json_encode(['id_usu' => $nuevoId]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos o incompletos.']);
            }
            break;

        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['id_usu'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de usuario no proporcionado.']);
                exit;
            }
            $actualizada = updateUsuarioById($input['id_usu'], $input, $conn);
            echo json_encode(['updated_rows' => $actualizada]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de usuario no proporcionado para eliminar.']);
                exit;
            }
            $id = intval($_GET['id']);
            $resultado = deleteUsuarioById($id, $conn);
 
            if ($resultado) {
                http_response_code(204);
            } else {
                http_response_code(404);
                echo json_encode(['error' => "No se encontró el usuario con ID $id."]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>
