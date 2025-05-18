function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function crc32(str) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ lookup[(crc ^ str.charCodeAt(i)) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

// CRC32のルックアップテーブル（簡略化のため一部のみ記載）
const lookup = [
  0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F,
  0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988,
  0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2,
  0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
  // ... (完全なテーブルはもっと長くなります)
];

document.addEventListener('DOMContentLoaded', function() {
  const nameInput = document.getElementById('name');
  const passwordInput = document.getElementById('password');
  const messageInput = document.getElementById('message');
  const submitButton = document.getElementById('submit');
  const postsDiv = document.getElementById('posts');

  // Cookieから名前を復元
  const savedName = getCookie('username');
  if (savedName) {
    nameInput.value = savedName;
  }

  submitButton.addEventListener('click', function() {
    const name = nameInput.value;
    const password = passwordInput.value;
    const message = messageInput.value;

    // パスワードをCRC32でハッシュ化
    const passwordHash = crc32(password);

    // Cookieに名前を保存 (パスワードはIDとしてハッシュ値を保存)
    setCookie('username', name, 30); // 30日間保存

    // ここで、ID (passwordHash), name, message を id.txt に書き込む処理が必要
    // これはブラウザのJavaScriptから直接行うことはセキュリティ上の制約があるため、
    // 通常はサーバーサイドの処理が必要です。
    // 今回は、この部分を「手動でテキストファイルに追記する」と想定してください。
    console.log(`ID: ${passwordHash}, Name: ${name}, Message: ${message}`);
    alert('投稿しました（実際には手動でid.txtを更新してください）。');

    // フォームをクリア
    messageInput.value = '';
  });

  // id.txt の内容を読み込んで表示する処理
  // これもブラウザのJavaScriptから直接ファイルシステムにアクセスできないため、
  // 通常
