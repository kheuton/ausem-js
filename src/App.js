import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [problemId, setProblemId] = useState(3); // Pre-populated problem ID
  const [criteria, setCriteria] = useState([
    "Does the student identify the object (e.g. object, box, etc.)?",
    "Does the student identify the possible environmental influence acting on the object (e.g. applied net force)?",
    "Does the student identify the object properties (e.g. mass)?",
    "Does the student identify the object positioning before applied force (e.g. upwards)?",
    "Does the student identify the object positioning after applied force (e.g. horizontal)?",
    "Does the student identify the object movement prior to the applied force (e.g. constant velocity)?",
    "Does the student identify the object movement after the applied force (e.g. final velocity)?",
    "Does the student identify the interaction between the object and the net applied force (e.g. change in direction)?",
    "Does the student identify the mechanistic relationship between an applied net force and a change in motion? (e.g. a net force applied in the x direction will be a mechanism that causes a change in motion/acceleration in the x direction)"
  ]);
  const [predictions, setPredictions] = useState(null);

  const handleCriteriaChange = (index, value) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = value;
    setCriteria(updatedCriteria);
  };

  const handleSubmit = async () => {
    const requestData = {
      text,
      criteria,
      problem_id: problemId
    };

    try {
      const response = await axios.post("https://kheuton-AuSeM-Eval.hf.space/predict", requestData);
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to generate background color from red to green based on value (0 = red, 1 = green)
  const getBackgroundColor = (value) => {
    const red = Math.round(255 * (1 - value));
    const green = Math.round(255 * value);
    return `rgb(${red}, ${green}, 100)`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h1>Physics Concept Evaluation</h1>

      <div style={{ fontSize: "18px", fontWeight: "bold", textDecoration: "underline", marginBottom: "10px" }}>
        Problem 4
      </div>

      <div style={{ marginBottom: "15px", lineHeight: "1.5", fontSize: "16px" }}>
        1. The net force on the box is in the positive x direction. Which of the following statements best describes the motion of the box?
        <br />
        (a) Its acceleration is parallel to the x axis. <br />
        (b) Its velocity is parallel to the x axis. <br />
        (c) Both its velocity and acceleration are parallel to the x axis. <br />
        (d) Neither its velocity nor its acceleration need to be parallel to the x axis.
      </div>

      <label style={{ fontWeight: "bold" }}>Enter Your Response:</label>
      <textarea 
        rows="4"
        cols="50"
        placeholder="Type your response here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />

      <label style={{ fontWeight: "bold" }}>Problem ID:</label>
      <input 
        type="number"
        value={problemId}
        readOnly
        style={{ display: "block", width: "100%", marginBottom: "10px", background: "#f0f0f0", border: "1px solid #ccc" }}
      />

      <h3>Evaluation Criteria</h3>
      {criteria.map((criterion, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          <input
            type="text"
            value={criterion}
            onChange={(e) => handleCriteriaChange(index, e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>
      ))}

      <button 
        onClick={handleSubmit}
        style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
      >
        Predict
      </button>

      {predictions && (
        <div style={{ marginTop: "20px" }}>
          <h3>Predictions:</h3>
          <ul style={{ padding: "0", listStyleType: "none" }}>
            {predictions.map((pred, index) => (
              pred !== null && index < criteria.length ? ( // Only show if a corresponding criterion exists
                <li key={index} style={{
                  marginBottom: "5px",
                  padding: "10px",
                  backgroundColor: getBackgroundColor(pred),
                  color: "white",
                  borderRadius: "5px"
                }}>
                  <strong>{criteria[index]}:</strong> {pred.toFixed(4)}
                </li>
              ) : null
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
