// Variables to store the flight data and the flight lines to be drawn
let flightsData;
let flightLines = [];

// This is a setup function that runs once at the beginning.
function setup() {
  createCanvas(800, 800); // Creates a canvas that's 800 pixels wide and 800 pixels high.
  colorMode(HSB); // Switches to Hue, Saturation, Brightness (HSB) color mode.
  loadJSON('data.json', gotData); // Loads a JSON file and calls the gotData function.
}

// This is a callback function that gets called when the JSON has finished loading.
function gotData(data) {
  console.log(data); // Logs the loaded data to the console.
  flightsData = data; // Stores the loaded data in flightsData.

  // This for loop goes through each element of the list array in the flight data.
  for (let i = 0; i < flightsData.list.length; i++) {
    let flight = flightsData.list[i]; // Stores the current flight.
    
    // Extracts the flight information.
    let flights = flight.flight;
    let destination = flight.destination[0]; // Assuming one destination per flight
    let status = flight.status;

    // Extracts and processes the flight time.
    let timeHour = parseInt(flight.time.split(':')[0]); // Splits the time at the colon and takes the first part (hours), then converts it to an integer.
    let hue = map(timeHour, 0, 24, 0, 360); // Maps the time from the range [0, 24] to the range [0, 360] for color hue.

    let gate = flight.gate;

    // Randomly positions the start and end points of the line.
    let startX = random(width);
    let startY = random(height);
    let endX = random(width);
    let endY = random(height);

    // Creates an object to store the line information.
    let flightLine = {
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      targetStartX: startX,
      targetStartY: startY,
      targetEndX: endX,
      targetEndY: endY,
      destination: destination,
      time: flight.time,
      gate: gate,
      hue: hue,
      status: status
    };

    flightLines.push(flightLine); // Adds the line to the flightLines array.
  }
}

// This is a draw function that gets called repeatedly after setup.
function draw() {
  background(0); // Sets the background color to black (0).

  // Checks if the flight data has been loaded.
  if (flightsData) {
    // If it has, it goes through each line in the flightLines array.
    for (let i = 0; i < flightLines.length; i++) {
      let flightLine = flightLines[i]; // Stores the current flight line.

      // Lerps (linear interpolates) the start and end points of the line towards their targets. This creates a smooth animation.
      flightLine.startX = lerp(flightLine.startX, flightLine.targetStartX, 0.01);
      flightLine.startY = lerp(flightLine.startY, flightLine.targetStartY, 0.01);
      flightLine.endX = lerp(flightLine.endX, flightLine.targetEndX, 0.01);
      flightLine.endY = lerp(flightLine.endY, flightLine.targetEndY, 0.01);

      // Checks if the line has reached its target.
      let distThreshold = 1;
      let reachedTarget =
        dist(flightLine.startX, flightLine.startY, flightLine.targetStartX, flightLine.targetStartY) < distThreshold &&
        dist(flightLine.endX, flightLine.endY, flightLine.targetEndX, flightLine.targetEndY) < distThreshold;

      // If the line has reached its target, it sets a new random target.
      if (reachedTarget) {
        flightLine.targetStartX = random(width);
        flightLine.targetStartY = random(height);
        flightLine.targetEndX = random(width);
        flightLine.targetEndY = random(height);
      }

      // Sets the stroke color and draws the line.
      stroke(flightLine.hue, 100, 100, 70); // add alpha to stroke
      line(flightLine.startX, flightLine.startY, flightLine.endX, flightLine.endY);

      fill(flightLine.hue, 100, 100); // Sets the fill color for the text and other shapes.
      noStroke(); // Disables the stroke for the text and other shapes.

      // Calculates the midpoint of the line.
      let midX = (flightLine.startX + flightLine.endX) / 2;
      let midY = (flightLine.startY + flightLine.endY) / 2;

      // Translates the canvas to the midpoint of the line and rotates it.
      push();
      translate(midX, midY);
      rotate(HALF_PI / 2); // rotate text slightly

      // Draws the flight information.
      text(flightLine.destination, 0, -10);
      text("Gate: " + flightLine.gate, 0, 10);

      // Restores the canvas translation and rotation.
      pop();

      // Checks the flight status and draws additional shapes based on it.
      if (flightLine.status === "Cancelled") {
        stroke(flightLine.hue, 100, 100);
        line(midX - 5, midY - 5, midX + 5, midY + 5);
        line(midX + 5, midY - 5, midX - 5, midY + 5);
      } else if (flightLine.status === "On time") {
        fill(flightLine.hue, 100, 100);
        ellipse(midX, midY, 10, 10);
      }
    }
  }
}
