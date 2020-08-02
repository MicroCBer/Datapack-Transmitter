let fetch = require("node-fetch"), md5 = require("md5");
const { readFileSync } = require("fs");
let ip = ""



var fs = require("fs")
var path = require("path");
const { callbackify } = require("util");


module.exports = async (folder, server) => {
  ip = server.ip
  function readDirSync (path, callback) {
    var pa = fs.readdirSync(path);
    pa.forEach(function (ele, index) {
      var info = fs.statSync(path + "/" + ele)
      if (info.isDirectory()) {
        readDirSync(path + "/" + ele, callback);
      } else {
        callback(path + "/" + ele)
      }
    })
  }
  async function uploadFile (token, path) {
    var myHeaders = { "Content-Type": "application/json" };
    let data = fs.readFileSync(folder + "/" + path).toString()
    console.log("Uploaded:" + path)
    var raw = JSON.stringify({
      "token": token,
      "data": data,
      "path": path
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return await (await fetch("http://" + ip + "/syncFile", requestOptions)).text()

  }
  async function chkFile (token, path) {
    var myHeaders = { "Content-Type": "application/json" }
    let aPath = folder + "/" + path
    aPath = aPath.replace(RegExp("//", "g"), "/")
    var raw = JSON.stringify({ "token": token, "path": path });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    let remoteMD5 = await (await fetch("http://" + ip + "/chkFile", requestOptions)).text()
    return (remoteMD5 == md5(readFileSync(aPath)))

  }
  async function renameFile (token, from, to) {
    var myHeaders = { "Content-Type": "application/json" }

    var raw = JSON.stringify({ "token": token, "path": from, "topath": to });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return await (await fetch("http://" + ip + "/renameFile", requestOptions)).text()

  }
  // readDirSync(folder, async function (path) {
  // if (!await chkFile(server.token, path.replace(folder, ""))) await uploadFile(server.token, path.replace(folder, ""))
  // })
  console.log(`正在监听 ${folder}`);

  let from = ""
  const chokidar = require('chokidar');

  chokidar.watch(folder).on("all", async (event, filename) => {
    filename = filename.replace(RegExp("//", "g"), "/").replace(/\\/g, "/").replace(RegExp(folder.replace(/\\/g, "/"), "g"), "")
    if (event == 'change' || event == "add") {
      console.log(`Changed: ${filename}`)
      await uploadFile(server.token, filename)
      return 0;
    }
    if (event == 'unlink' || event == 'unlinkDir') {

      console.log(`Unlinked:${filename}`)
      await renameFile(server.token, filename, `/.recycle/${new Date().valueOf()}/` + filename)
      return 0;
    }
    if (event == "unlink") {

    }
    console.log(event, " ", filename)
  })
}
