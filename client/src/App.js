import "./App.css";
import React, { useEffect, useState } from "react";
import { useInterval } from "react-use";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

function tempColor(value) {
  var RGB = { R: 0, G: 0, B: 0 };

  // y = mx + b
  // m = 4
  // x = value
  // y = RGB._
  if (0 <= value && value <= 1 / 8) {
    RGB.R = 0;
    RGB.G = 0;
    RGB.B = 4 * value + 0.5; // .5 - 1 // b = 1/2
  } else if (1 / 8 < value && value <= 3 / 8) {
    RGB.R = 0;
    RGB.G = 4 * value - 0.5; // 0 - 1 // b = - 1/2
    RGB.B = 1; // small fix
  } else if (3 / 8 < value && value <= 5 / 8) {
    RGB.R = 4 * value - 1.5; // 0 - 1 // b = - 3/2
    RGB.G = 1;
    RGB.B = -4 * value + 2.5; // 1 - 0 // b = 5/2
  } else if (5 / 8 < value && value <= 7 / 8) {
    RGB.R = 1;
    RGB.G = -4 * value + 3.5; // 1 - 0 // b = 7/2
    RGB.B = 0;
  } else if (7 / 8 < value && value <= 1) {
    RGB.R = -4 * value + 4.5; // 1 - .5 // b = 9/2
    RGB.G = 0;
    RGB.B = 0;
  } else {
    // should never happen - value > 1
    RGB.R = 0.5;
    RGB.G = 0;
    RGB.B = 0;
  }

  // scale for hex conversion
  RGB.R *= 15;
  RGB.G *= 15;
  RGB.B *= 15;

  return (
    Math.round(RGB.R).toString(16) +
    "" +
    Math.round(RGB.G).toString(16) +
    "" +
    Math.round(RGB.B).toString(16)
  );
}

function cToF(celsius) {
  return Math.round((celsius * 9) / 5) + 32;
}

function fToC(fahrenheit) {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

const minTempF = 32;
const maxTempF = 400;
const tempRangeF = maxTempF - minTempF;

const minTempC = fToC(minTempF);
const maxTempC = fToC(maxTempF);
const tempRangeC = maxTempC - minTempC;

const newMin = 0;
const newMax = 1;
const newRange = newMax - newMin;

function panTempTo0to1Range(OldValue, isF) {
  let NewValue = ((OldValue - minTempC) * newRange) / tempRangeC + newMin;

  if (isF) {
    NewValue = ((OldValue - minTempF) * newRange) / tempRangeF + newMin;
  }
  return NewValue;
}

function numberToCSSColor(value, isF) {
  return "#" + tempColor(panTempTo0to1Range(value, isF));
}

var blinkTab = function (message) {
  var oldTitle = document.title /* save original title */,
    timeoutId,
    blink = function () {
      document.title = document.title == message ? "Pantastic" : message;
    } /* function to BLINK browser tab */,
    clear = function () {
      /* function to set title back to original */
      clearInterval(timeoutId);
      document.title = oldTitle;
      window.onmousemove = null;
      timeoutId = null;
    };

  if (!timeoutId) {
    timeoutId = setInterval(blink, 1000);
    window.onmousemove = clear; /* stop changing title on moving the mouse */
  }
};

//Function that serves as React component for the entire app
function App() {
  //Reactjs state management variables
  const [temperature, setTemperature] = useState(75);
  const [isF, setIsF] = useState(true); //true is fahrenheit
  const [textTemperature, setTextTemperature] = useState(75);
  const [color, setColor] = useState(numberToCSSColor(75, isF));
  const [count, setCount] = useState(5);
  const [danger, setDanger] = useState(false);
  const [data, setData] = useState([
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
  ]);

  //When temperature changes check if it is a danger temperature and show visual concern to the user via flashing image and text
  useEffect(() => {
    if (temperature > 300) {
      blinkTab("🔥Fire🔥");
    }
  });

  //Poll server for new data sent by microcontroller
  useInterval(async () => updateData(), 2000);

  let divStyle = {
    color: color,
  };

  //Axios used by client to call server api
  async function updateData() {
    const res = await axios.get("/dataRetrieve");
    setData(res.data);
    if (res.data.length > data.length) {
      updateDisplay(res.data[res.data.length - 1].Temp);
    }
  }

  function updateDisplay(value) {
    setTextTemperature(value);
    setColor(numberToCSSColor(value, isF));
    setCount(count + 1);
    if (value > 300) {
      setDanger(true);
    }
  }

  function toggleUnit() {
    let convertFunc = cToF;

    if (isF) {
      convertFunc = fToC;
    }

    let newData = data.slice();
    console.log(newData);

    for (let i = 0; i < data.length; i++) {
      data[i].Temp = convertFunc(data[i].Temp);
      console.log(data[i].Temp);
    }

    setData(newData);
    setIsF(!isF);
    setTextTemperature(convertFunc(textTemperature));
    console.log(newData);
  }

  //Functions to handle change on button clicks
  function handleChange(e) {
    setTemperature(e.target.value);
  }

  function toggleDanger() {
    setDanger(!danger);
  }

  //Template for how html should syntactically/visually display components
  return (
    <>
      <div className="App">
        <div id="center in middle of screen">
          <h1>Pantastic</h1>
          <h2>My Device</h2>
          <div id="temp and alarm module" className="container">
            <div className="Temp">
              <div className="centeredTemp">
                <p style={divStyle}>{textTemperature}</p>
              </div>
              <input
                type="number"
                id="temp"
                name="Temp"
                min="10"
                max="100"
                value={temperature}
                onChange={handleChange}
              ></input>
              <button onClick={(e) => updateDisplay(temperature)}>
                Update Temp
              </button>
              <button onClick={toggleUnit}>
                Toggle Unit ({isF ? "F" : "C"})
              </button>
              <button className="dataButton" onClick={updateData}>
                Console Log Data
              </button>
            </div>
            {danger ? (
              <div className="alarmModule">
                <div id="alarm icon" classname="alarm">
                  <div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Achtung.svg/1200px-Achtung.svg.png"
                      width="45%"
                    ></img>
                  </div>
                </div>
                <div className="stupidButton">
                  <button className="stupidButton" onClick={toggleDanger}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <div className="colored">
            <LineChart
              width={500}
              height={200}
              data={data}
              margin={{
                top: 5,
                right: 70,
                left: -25,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis type="number" domain={isF ? [0, 400] : [0, fToC(400)]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Temp"
                stroke={color}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
