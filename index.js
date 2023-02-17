"use strict";
const http = require("http");
const pug = require("pug");
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      "Content-type": "text/html; charset=utf-8",
    });
    switch (req.method) {
      case "GET":
        if (req.url === "/enquetes/yaki-shabu") {
          res.write(pug.renderFile("./form.pug", {
            path: req.url,
            firstItem: "焼き肉", 
            secondItem: "しゃぶしゃぶ"
          }));
        } else if (req.url === "/enquetes/rice-bread") {
          res.write(pug.renderFile("./form.pug", {
            path: req.url,
            firstItem: "ごはん", 
            secondItem: "パン"
          }));
        }
        res.end();
        break;
      case "POST":
        let rawData = "";
        req
          .on("data", (chunk) => {
            rawData += chunk;
          })
          .on("end", () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get("name")}さんは${answer.get("favourite")}に投票しました`
            console.info(`[${now}] ${body}`);
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`
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
  .on("error", (e) => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on("clientError", (e) => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
