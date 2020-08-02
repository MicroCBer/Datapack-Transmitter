const server = require("./server.js");

const args = process.argv.slice(2)
const SERVER_MODE = 0, CLIENT_MODE = 10;
let mode = SERVER_MODE
let serverOpt = {
  ip: "",
  token: ""
}
let folder = "", port;
for (var x in args) {
  switch (args[x]) {
    case "-mode": {
      mode = (args[parseInt(x) + 1] == "server") ? SERVER_MODE : CLIENT_MODE;
      break;
    }
    case "-server-ip": {
      serverOpt.ip = args[parseInt(x) + 1];
      break;
    }
    case "-port": {
      port = args[parseInt(x) + 1];
    }
    case "-client-token": {
      serverOpt.token = args[parseInt(x) + 1];
      break;
    }
    case "-folder": {
      folder = args[parseInt(x) + 1];
      break;
    }
  }
}
if (mode == SERVER_MODE) {
  console.log("Minecraft Datapack Transmitter Server is running.")
  require("./server.js")(folder, port)
} else {
  console.log("Minecraft Datapack Transmitter Client is running.")
  require("./client.js")(folder, serverOpt)
}