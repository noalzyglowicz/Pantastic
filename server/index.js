// server/index.js

const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

let data = [
  {
    name: "Temp 1",
    Temp: 75,
  },
  {
    name: "Temp 2",
    Temp: 100,
  },
  {
    name: "Temp 3",
    Temp: 175,
  },
  {
    name: "Temp 4",
    Temp: 130,
  },
];

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

let options = {
  type: "text/plain",
};

app.use(express.text([]));
app.use(express.json([]));
app.use(express.raw([options]));
app.use(express.urlencoded([]));

//The real post
app.post("/api", (req, res) => {
  data.push({
    name: "Temp 1",
    Temp: parseInt(req.body),
  });
  res.json({
    //requestBodyPostHeaders: req.headers,
    requestBodyPostBody: req.body,
  });
});

app.get("/dataRetrieve", (req, res) => {
  res.send(data);
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
  //res.send("GeeksforGeeks");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
