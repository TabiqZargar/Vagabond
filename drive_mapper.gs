/**
 * Vagabond Library — Google Drive File Mapper
 *
 * Deploy this script as a web app (Anyone access).
 * It returns a JSON map of:  "Volume I/# 1/001.png" → "FILE_ID"
 *
 * How to deploy:
 *   1. Go to https://script.google.com
 *   2. Create a new project, paste this code
 *   3. File > Save (name it "Vagabond Drive Mapper")
 *   4. Deploy > New deployment > Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   5. Copy the deployment URL
 *   6. Paste it into index.html where APPS_SCRIPT_URL is set
 */

const FOLDER_ID = '1eu6t-2KmKjYXdnACGhwFAdI1JDDHq2Fz';

function doGet() {
  try {
    const map = {};
    const root = DriveApp.getFolderById(FOLDER_ID);
    walkFolder(root, '', map);
    return ContentService
      .createTextOutput(JSON.stringify(map))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function walkFolder(folder, prefix, map) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const path = prefix ? prefix + '/' + file.getName() : file.getName();
    map[path] = file.getId();
  }
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const sub = subfolders.next();
    const subPrefix = prefix ? prefix + '/' + sub.getName() : sub.getName();
    walkFolder(sub, subPrefix, map);
  }
}
