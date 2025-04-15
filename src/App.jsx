import React, { useState } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Firebase config (replace with your own)
const firebaseConfig = {
  apiKey: "AIzaSyAEp35udRq84UxQPfcYmDpgKJF2GldvlnA",
  authDomain: "airsenselive.firebaseapp.com",
  projectId: "airsenselive",
  storageBucket: "airsenselive.firebasestorage.app",
  messagingSenderId: "60349991330",
  appId: "1:60349991330:web:77b3ce71451c3b6f2a4afb"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [upperTemp, setUpperTemp] = useState('');
  const [lowerTemp, setLowerTemp] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const limitsRef = ref(database, 'ac_limits/');
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
