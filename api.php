<?php
$dataFile = 'posts.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $password = $_POST['password'] ?? '';
    $message = $_POST['message'] ?? '';

    if (!empty($name) && !empty($password) && !empty($message)) {
        $hashedPassword = hash('crc32', $password);
        $newPost = [
            'id' => uniqid(),
            'name' => $name,
            'passwordHash' => $hashedPassword,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];

        file_put_contents($dataFile, json_encode($newPost) . "\n", FILE_APPEND);

        http_response_code(201);
        header('Content-Type: application/json');
        echo json_encode(['message' => '投稿が完了しました']);
    } else {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => '名前、パスワード、メッセージを入力してください']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $posts = [];
    if (file_exists($dataFile)) {
        $lines = file($dataFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $post = json_decode($line, true);
            if ($post) {
                $posts[] = $post;
            }
        }
    }

    header('Content-Type: application/json');
    echo json_encode(array_reverse($posts));

} else {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => '許可されていないメソッドです']);
}
?>
