import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

// Componente TransportCalculator
export const TransportCalculator = () => {
  const [distance, setDistance] = useState(0);
  const [urban, setUrban] = useState(true);
  const [animalSize, setAnimalSize] = useState("small");
  const [waitTime, setWaitTime] = useState(0);
  const [origin, setOrigin] = useState("central");
  const [destination, setDestination] = useState("");
  const [total, setTotal] = useState(0);

  const neighborhoods = [
    "Centro",
    "Tarumã",
    "Adrianópolis",
    "Ponta Negra",
    "Cidade Nova",
    "Aleixo",
    "Japiim",
    "São Raimundo",
    "Compensa",
    "Flores",
  ];

  const calculatePrice = () => {
    const baseRate = 80.0;
    const urbanRate = 2.5;
    const highwayRate = 2.4;
    const additionalTimeRate = 100.0;
    const largeAnimalFee = 30.0;

    let price = distance * (urban ? urbanRate : highwayRate);

    if (price < 40.0) {
      price = baseRate;
    }

    if (waitTime > 60) {
      price += additionalTimeRate;
    }

    if (animalSize === "large") {
      price += largeAnimalFee;
    }

    setTotal(price.toFixed(2));
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">Calculadora de Transporte</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Origem:</label>
        <select
          className="w-full border rounded p-2"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        >
          <option value="central">Central</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Destino:</label>
        <select
          className="w-full border rounded p-2"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tipo de percurso:</label>
        <select
          className="w-full border rounded p-2"
          value={urban ? "urban" : "highway"}
          onChange={(e) => setUrban(e.target.value === "urban")}
        >
          <option value="urban">Urbano</option>
          <option value="highway">Estrada</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tamanho do animal:</label>
        <select
          className="w-full border rounded p-2"
          value={animalSize}
          onChange={(e) => setAnimalSize(e.target.value)}
        >
          <option value="small">Pequeno</option>
          <option value="large">Grande</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Tempo de espera no local (em minutos):
        </label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={waitTime}
          onChange={(e) => setWaitTime(parseInt(e.target.value, 10))}
        />
      </div>

      <button
        onClick={calculatePrice}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Calcular Preço
      </button>

      {total > 0 && (
        <div className="text-center mt-4">
          <h2 className="text-lg font-semibold">Preço Total:</h2>
          <p className="text-2xl font-bold">R$ {total}</p>
        </div>
      )}
    </div>
  );
};
