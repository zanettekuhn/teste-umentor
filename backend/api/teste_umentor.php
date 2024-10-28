<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

$servername = "database-teste-umentor.cvm4oew2qe96.us-east-2.rds.amazonaws.com";
$username = "admin";
$password = "j1VEfksWNlG00miDTjWI";
$dbname = "teste_umentor";
$port = "3306";

function connectToDatabase()
{
    global $servername, $username, $password, $dbname, $port;
    return mysqli_connect($servername, $username, $password, $dbname, $port);
}
$conn = connectToDatabase();

if (!$conn) {
    global $conn;
    echo json_encode("Falha na conexão com o banco de dados: " . mysqli_connect_error());
    mysqli_close($conn);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($method) {
    case 'GET':
        listUsers($conn);
        break;

    case 'POST':
        createUser($conn);
        break;

    case 'PUT':
        updateUser($conn);
        break;

    case 'DELETE':
        deleteUser($conn);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        break;
}

function listUsers($conn)
{
    $sql = "SELECT id, name, email, situation, date_admission, date_created, date_updated FROM users";
    $prepare = mysqli_prepare($conn, $sql);

    mysqli_stmt_execute($prepare);
    mysqli_stmt_store_result($prepare);
    mysqli_stmt_bind_result($prepare, $idUser, $name, $email, $situation, $date_admission, $date_created, $date_updated);

    $resultado = [];
    while (mysqli_stmt_fetch($prepare)) {
        $resultado[] = array(
            'id' => $idUser,
            'name' => $name,
            'email' => $email,
            'situation' => $situation,
            'date_admission' => $date_admission,
            'date_created' => $date_created,
            'date_updated' => $date_updated
        );
    }

    mysqli_stmt_close($prepare);
    echo json_encode($resultado);
}

function createUser($conn)
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        echo ['success' => false, 'message' => 'JSON Invalido.'];
    }

    $sql = "INSERT INTO users (name, email, situation, date_admission) VALUES (?, ?, ?, ?)";
    $prepare = mysqli_prepare($conn, $sql);

    if (!$prepare) {
        echo ['success' => false, 'message' => 'Pepare falhou.'];
    }

    mysqli_stmt_bind_param($prepare, 'ssss', strtolower($data['name']), strtolower($data['email']), $data['situation'], $data['date_admission']);

    if (mysqli_stmt_execute($prepare)) {
        mysqli_stmt_close($prepare);
        echo ['success' => true];
    } else {
        $error = mysqli_stmt_error($prepare);
        mysqli_stmt_close($prepare);
        echo ['success' => false, 'message' => 'Execução falhou: ' . $error];
    }
}

function updateUser($conn)
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['id'], $data['name'], $data['email'], $data['situation'], $data['date_admission'])) {
        $sql = "UPDATE users SET name = ?, email = ?, situation = ?, date_admission = ?, date_updated = NOW() WHERE id = ?";
        $prepare = mysqli_prepare($conn, $sql);

        if (!$prepare) {
            echo ['success' => false, 'message' => 'Pepare falhou.'];
        }

        mysqli_stmt_bind_param($prepare, 'ssssi', strtolower($data['name']), strtolower($data['email']), $data['situation'], $data['date_admission'], $data['id']);

        if (mysqli_stmt_execute($prepare)) {
            echo json_encode(['success' => true, 'message' => 'Usuário atualizado com sucesso']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao atualizar usuário']);
        }

        mysqli_stmt_close($prepare);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Parâmetros inválidos']);
    }
}

function deleteUser($conn)
{
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        $sql = "DELETE FROM users WHERE id = ?";
        $prepare = mysqli_prepare($conn, $sql);

        if (!$prepare) {
            echo ['success' => false, 'message' => 'Pepare falhou.'];
        }

        mysqli_stmt_bind_param($prepare, 'i', $id);

        if (mysqli_stmt_execute($prepare)) {
            mysqli_stmt_close($prepare);
            echo json_encode(['success' => true, 'message' => 'Usuario deletado com sucesso.']);
        } else {
            mysqli_stmt_close($prepare);
            echo json_encode(['success' => false, 'message' => 'Erro: ' . mysqli_stmt_error($prepare)]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ID não encontrado']);
    }
}
