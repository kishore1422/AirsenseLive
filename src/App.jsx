import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCZR8w2aeXUFhDktcvRV8QMnHMgu1HZw8k",
  authDomain: "airsense-43b75.firebaseapp.com",
  databaseURL: "https://airsense-43b75-default-rtdb.firebaseio.com",
  projectId: "airsense-43b75",
  storageBucket: "airsense-43b75.firebasestorage.app",
  messagingSenderId: "158645904912",
  appId: "1:158645904912:web:1ec1c9bdaf0db4bada8c95",
  measurementId: "G-PYK9BGLGJQ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [upperTemp, setUpperTemp] = useState('');
  const [lowerTemp, setLowerTemp] = useState('');
  const [status, setStatus] = useState('');
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    aqi: null,
    pressure: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const limitsRef = ref(database, 'limits/');
    set(limitsRef, {
      upper: Number(upperTemp),
      lower: Number(lowerTemp)
    })
      .then(() => {
        setStatus('✅ Limits updated successfully!');
        setTimeout(() => setStatus(''), 3000);
      })
      .catch(() => setStatus('❌ Failed to update limits.'));
  };

  useEffect(() => {
    const sensorRef = ref(database, 'sensors/');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData({
          temperature: data.temperature,
          humidity: data.humidity,
          aqi: data.air_quality_index,
          pressure: data.pressure
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>AirSense Live</h1>
        <p>Smart Indoor Climate Control</p>
      </header>

      <main>
        <section className="ac-control">
          <h2>Set AC Temperature Limits</h2>
          <p className="caption">Specify when your AC should turn ON or OFF automatically.</p>
          <form onSubmit={handleSubmit}>
            <label>
              Lower Limit Temperature (AC ON):
              <input
                type="number"
                value={lowerTemp}
                onChange={(e) => setLowerTemp(e.target.value)}
                required
              />
            </label>
            <label>
              Upper Limit Temperature (AC OFF):
              <input
                type="number"
                value={upperTemp}
                onChange={(e) => setUpperTemp(e.target.value)}
                required
              />
            </label>
            <button type="submit">Update Limits</button>
          </form>
          <p className="status-msg">{status}</p>
        </section>

        <section className="sensor-readings">
          <h2>Live Sensor Data</h2>
          <ul>
            <li><strong>🌡️ Temperature:</strong> {sensorData.temperature ?? '--'} °C</li>
            <li><strong>💧 Humidity:</strong> {sensorData.humidity ?? '--'} %</li>
            <li><strong>☣️ Air Quality Index (AQI):</strong> {sensorData.aqi ?? '--'}</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>How it Works</h2>
          <div className="diagram">
            <div className="sensor-box">🌡️ Sensor</div>
            <div className="arrow">➡️</div>
            <div className="pico-box">Raspberry Pi Pico</div>
            <div className="arrow">➡️</div>
            <div className="ac-box">❄️ AC (via IR)</div>
          </div>
          <p>
            The sensor detects temperature. When it crosses the limits you set,
            the Raspberry Pi Pico activates or deactivates your AC using an IR blaster.
          </p>
        </section>

        <section className="team-section">
          <h3>Project Team</h3>
          <p>Developed with ❤️ by Nanda Kishore, Aadarsh, Atharv & Royal Roy.</p>
        </section>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 AirSense Live. All rights reserved.</p>
        <p>Contact us at <a href="mailto:nandakishore14n@gmail.com">nandakishore14n@gmail.com</a></p>
      </footer>
    </div>
  );
}

export default App;
