"use strict";
const http = require("http");
const fs = require("fs");
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(
      `[${now}] Requested by ${req.socket.remoteAddress}`
    );
    res.writeHead(200, {
      "Content-type": "text/html; charset=utf-8"
    });
    switch (req.method) {
      case "GET":
        const rs = fs.createReadStream("./form.html");
        rs.pipe(res);
        break;
      case "POST":
        res.write(`Post ${req.url}`);
        let rawData = "";
        req
          .on("data", (chunk) => {
            rawData += chunk;
          })
          .on("end", () => {
            console.info(`${now} Data posted: ${rawData}`);
            res.end();
          });
        break;
      case "DELETE":
        res.write(`DELETE ${req.url}`);
        break;
      default:
        break;
    }
  })
  .on("error", e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on("clientError", e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
