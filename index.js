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
        let rawData = "";
        req
          .on("data", (chunk) => {
            rawData += chunk;
          })
          .on("end", () => {
            const decoded = decodeURIComponent(rawData);
            console.info(`${now} 投稿: ${decoded}`);
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${decoded}が投稿されました</h1></body></html>`
            );
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
