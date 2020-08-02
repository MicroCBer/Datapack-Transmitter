module.exports = async (folder, port) => {
  console.log("The server is running at port ", port, "\n\n")
  let fs = require("fs")
  var md5 = require('md5');
  let express = require('express')
  let fetch = require("node-fetch")
  let bodyParser = require('body-parser')
  let app = express()
  let logs = [], maxLog = 3, logNum = Math.ceil(Math.random() * 100000);
  if (fs.existsSync("logs") == 0) fs.mkdirSync("logs");
  fs.writeFileSync("./logs/log" + logNum + ".txt", "")
  async function saveLogs () {
    let log = logs.splice(0, logs.length - maxLog);
    if (log.length > 0)
      fs.appendFileSync("log" + logNum + ".txt", log.join("\n\n"))
  }
  setInterval(saveLogs, 1000)
  let ip = /<input id="address" type="text" name="ip" url="true" value="(\S+)" /.exec(await (await fetch("http://ip.tool.chinaz.com")).text())[1]
  console.log("    Generated client startup parameters:\n     node app -mode client -server-ip " + ip + ":" + port + " -token [Your_Token(Any,_only_for_recording)] -folder [Folder]")
  var jsonParser = bodyParser.json()
  var urlencodedParser = bodyParser.urlencoded({ extended: false })

  app.get('/log', (req, res) => {
    res.send(logs.join("\n\n").replace(/\n/g, "<br>"));
  })
  app.post('/syncFile', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    let aPath = folder + "/" + req.body.path.replace(/\\/g, "/")
    aPath = aPath.replace(RegExp("//", "g"), "/")
    aPath.split("/").reduce((itr, e, r) => {
      if (r == aPath.split("/").length - 1) return;
      if (itr != "") {

        if (fs.existsSync(itr + "/" + e) == 0) {
          fs.mkdirSync(itr + "/" + e)
        }
        return itr + "/" + e;
      } else return e;
    }, "")
    logs.push(`


-------------------------------------------------------
  File Changed:
      Token:${req.body.token}
      Timestramp:${new Date().valueOf()}
      Path:${req.body.path}(${aPath})
      SourceFile:
      ${(fs.existsSync(aPath)) ? fs.readFileSync(aPath) : "[Does not exist]"}
      ChangeTo:
      ${req.body.data}
-------------------------------------------------------



  `)
    console.log(`
  -------------------------------------------------------
    File Changed:
        Token:${req.body.token}
        Timestramp:${new Date().valueOf()}
        Path:${req.body.path}(${aPath})
  -------------------------------------------------------
    `)
    fs.writeFileSync(aPath, req.body.data)
    res.sendStatus(200)
  })
  app.post('/chkFile', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    let aPath = folder + "/" + req.body.path.replace(/\\/g, "/")
    aPath = aPath.replace(RegExp("//", "g"), "/")
    logs.push(`


-------------------------------------------------------
  File Checked:
      Token:${req.body.token}
      Timestramp:${new Date().valueOf()}
      Path:${req.body.path}(${aPath})
      MD5:${md5((fs.existsSync(aPath)) ? fs.readFileSync(aPath) : "[Does not exist]")}
-------------------------------------------------------



  `)
    console.log(`
  -------------------------------------------------------
    File Checked:
        Token:${req.body.token}
        Timestramp:${new Date().valueOf()}
        Path:${req.body.path}(${aPath})
        MD5:${md5((fs.existsSync(aPath)) ? fs.readFileSync(aPath) : "[Does not exist]")}
  -------------------------------------------------------
    `)
    res.statusCode = 200
    res.send(md5((fs.existsSync(aPath)) ? fs.readFileSync(aPath) : "[Does not exist]"));
  })
  app.post('/renameFile', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    let aPath = folder + "/" + req.body.path.replace(/\\/g, "/")
    let aPath2 = folder + "/" + req.body.topath.replace(/\\/g, "/")
    aPath = aPath.replace(RegExp("//", "g"), "/")
    aPath2 = aPath2.replace(RegExp("//", "g"), "/")
    logs.push(`


-------------------------------------------------------
  File Renamed:
      Token:${req.body.token}
      Timestramp:${new Date().valueOf()}
      Path:${req.body.path}(${aPath})
      ChangeTo:
      ${req.body.path2}(${aPath2})
-------------------------------------------------------



  `)
    console.log(`
  -------------------------------------------------------
  File Renamed:
      Token:${req.body.token}
      Timestramp:${new Date().valueOf()}
      Path:${req.body.path}(${aPath})
      ChangeTo:
      ${req.body.topath}(${aPath2})
  -------------------------------------------------------
    `)
    aPath2.split("/").reduce((itr, e, r) => {
      if (r == aPath2.split("/").length - 1) return;
      if (itr != "") {

        if (fs.existsSync(itr + "/" + e) == 0) {
          fs.mkdirSync(itr + "/" + e)
        }
        return itr + "/" + e;
      } else return e;
    }, "")
    fs.rename(aPath, aPath2, () => {
      res.sendStatus(200);
    })

  })
  app.listen(port);
}