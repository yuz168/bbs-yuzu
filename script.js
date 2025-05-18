const SHEET_NAME = 'シート1'; // あなたのシート名に合わせて変更してください
const ID_COLUMN = 1;
const NAME_COLUMN = 2;
const MESSAGE_COLUMN = 3;

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const id = data.id;
  const name = data.name;
  const message = data.message;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  sheet.appendRow([id, name, message]);

  return ContentService.createTextOutput(JSON.stringify({ "status": "success" })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const header = data[0];
  const rows = data.slice(1).map(row => {
    return { [header[ID_COLUMN - 1]]: row[ID_COLUMN - 1], [header[NAME_COLUMN - 1]]: row[NAME_COLUMN - 1], [header[MESSAGE_COLUMN - 1]]: row[MESSAGE_COLUMN - 1] };
  });
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
