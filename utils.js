const fs = require('fs');
const path = require('path');

class SidebarUtils {
  //ユーティリティ

  //グループタイトル変換
  toTitle(title, targetpath) {
    if (title === '') {
      return targetpath.replace('/', '');
    }
    return title;
  };

  // returns true exactly when the file is the index file
  isIndexFile(file) {
    return file === 'README.md' || file === 'index.md';
  }

  // utility function for mapping and ordering files
  // the order being: index file first (see above), everything else alphabetically
  mapFiles(files, targetdir) {
    let indexFile;
    const mappedFiles = files
    .filter((file) => {
      // skip the index file in order to add it afterwards
      if (this.isIndexFile(file)) {
        // save the index file
        indexFile = path.join(targetdir);
        // file is the index file, therefore skip it
        return false;
      } else {
        // file is not the index file, therefore add it to the filtered list
        return true;
      }
    })
    .map((file) => {
      // README.md以外の場合は子ディレクトリ+ファイル名を返す。
      //return "/" + targetdir + "/" + file;
      return path.join(targetdir, file);
    })
    // add the index file as the first item and return the result
    mappedFiles.splice(0, 0, indexFile);
    return mappedFiles;
  }

  // 対象ディレクトリ配下のファイルを取得
  getFilepaths(files, targetdir) {
    // map files to sidebar elements
    return this.mapFiles(files, targetdir);
  };

  getFiles (workingdir, targetpath) {
    //return fs.readdirSync(workingdir + targetpath).filter((file) => {
    return fs.readdirSync(path.join(workingdir, targetpath)).filter((file) => {
      //return isFile(workingdir + targetpath + file);
      return this.isFile(path.join(workingdir, targetpath, file));
    });
  };

  // 対象ディレクトリ配下のファイルを取得
  getFileitems(workingdir, targetdir) {
    // map files to sidebar elements
    return this.mapFiles(fs.readdirSync(path.join(workingdir, targetdir)), targetdir);
  };
  // ディレクトリ一覧の取得
  getDirectores (workingdir) {
    // root配下のファイル＆ディレクトリ一覧取得
    return fs.readdirSync(workingdir).filter((childdir) => {
      // .vuepressのみ除外
      if (childdir === '.vuepress') {
        //対象ディレクトリが.vuepressの場合、false
        return false;
      }
      // ディレクトリの場合：true 対象がファイルであった場合はfalse
      //return isDirectory(workingdir + '/' + childdir);
      return this.isDirectory(path.join(workingdir, childdir));
    });
  };

  // ルート直下のファイルを取得（ex.README.md, privacy.md...etc）
  getRootFileItems (workingdir) {
    // root配下のファイル＆ディレクトリ一覧取得
    return fs.readdirSync(workingdir).filter((file) => {
      //root配下のREADME.mdは'/'で表現されるので排除する。
      if (this.isIndexFile(file)) {
        // README.mdの場合：false
        return false;
      }
      // ファイル存在判定 and マークダウンファイル判定
      //return isFile(workingdir + '/' + file);
      return this.isFile(path.join(workingdir, file));
    });
  };

  // ファイル存在確認（マークダウンファイル判定）
  isFile(targetpath) {
    return fs.existsSync(targetpath) && fs.statSync(targetpath).isFile() && path.extname(targetpath) === '.md';
  };

  // ディレクトリ存在確認
  isDirectory(targetpath) {
    // existsSyncは非推奨だから使わないほうが良い？
    // 参考；fs.statSyncでファイルの存在判定 - Qiita https://qiita.com/tokimari/items/82222e1f99b2b9eb1fb8
    // やっぱりこのままでいいっぽい
    // 参考：Node.js でディレクトリかどうかを判定する方法 | phiary http://phiary.me/nodejs-check-is-directory/
    // ディレクトリが存在する かつ 対象パスはディレクトリか否か
    return fs.existsSync(targetpath) && fs.statSync(targetpath).isDirectory();
  };
}
module.exports = new SidebarUtils();