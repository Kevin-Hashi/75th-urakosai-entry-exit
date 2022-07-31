function SetSpreadSheet(data) {
  var sheet = spreadsheetApp.openById('1RJo_oHopmUq0B8w9JNGum1BxJ3tl62YgYI3QsTyz3-I').getSheetByName('シート1');
  sheet.appendRow(data);
}
