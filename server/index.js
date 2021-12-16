// server/index.js
//Run npm start to start the server
//cd into client and run npm start to start the client

//Set the path and add express backend
const path = require("path");
const express = require("express");

//Set port to listen on 3001
const PORT = process.env.PORT || 3001;

const app = express();

//Server data receives data from microcontroller
let data = [
  {
    name: "Temp 1",
    Temp: 73,
  },
];

let nextTemp = 2;

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

//Body-parser requires type to be set for incoming raw data (string literal) from http request
let options = {
  type: "text/plain",
};

//Allow the backend to read from multiple body types using express Body-parser
app.use(express.text([]));
app.use(express.json([]));
app.use(express.raw([options]));
app.use(express.urlencoded([]));

//Api to handle post data send by microcontroller by sending a response and updating server data
app.post("/api", (req, res) => {
  data.push({
    name: "Temp " + nextTemp.toString(),
    Temp: parseInt(req.body),
  });
  nextTemp += 1;
  res.json({
    requestBodyPostBody: req.body,
  });
});

//Api to allow client to poll server to check for new data
app.get("/dataRetrieve", (req, res) => {
  res.send(data);
});

app.get("/resetData", (req, res) => {
  data = [
    {
      name: "Temp 1",
      Temp: 73,
    },
  ];
});

//All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

//App listens on specified port
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
