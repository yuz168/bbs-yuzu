<?php
// データの保存先ファイル
$dataFile = 'posts.txt';

// リクエストメソッドの確認
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POSTリクエストの処理

    $name = $_POST['name'] ?? '';
    $password = $_POST['password'] ?? '';
    $message = $_POST['message'] ?? '';

    if (!empty($name) && !empty($password) && !empty($message)) {
        // パスワードをハッシュ化 (CRC32 - 本番環境ではより安全な関数を使用)
        $hashedPassword = hash('crc32', $password);

        // 新しい投稿データを作成
        $newPost = [
            'id' => uniqid(), // 簡単なIDを生成
            'name' => $name,
            'passwordHash' => $hashedPassword,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];

        // データをファイルに追記 (JSON形式で保存)
        file_put_contents($dataFile, json_encode($newPost) . "\n", FILE_APPEND);

        // 成功のレスポンスを返す
        http_response_code(201); // Created
        header('Content-Type: application/json');
        echo json_encode(['message' => '投稿が完了しました']);
    } else {
        // 不正なリクエスト
        http_response_code(400); // Bad Request
        header('Content-Type: application/json');
        echo json_encode(['error' => '名前、パスワード、メッセージを入力してください']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GETリクエストの処理 (投稿データの取得)

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

    // 投稿データをJSON形式で返す (新しい順)
    header('Content-Type: application/json');
    echo json_encode(array_reverse($posts));

} else {
    // その他のメソッドは許可しない
    http_response_code(405); // Method Not Allowed
    header('Content-Type: application/json');
    echo json_encode(['error' => '許可されていないメソッドです']);
}
?>
