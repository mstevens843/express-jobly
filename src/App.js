import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import SnackOrBoozeApi from "./Api";
import NavBar from "./components/NavBar";
import Menu from "./components/Menu";
import Item from "./components/Item";
import AddItemForm from "./components/AddItemForm";
import NotFound from './components/NotFound';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [snacks, setSnacks] = useState([]);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    async function getData() {
      let snacks = await SnackOrBoozeApi.getSnacks();
      let drinks = await SnackOrBoozeApi.getDrinks();
      setSnacks(snacks);
      setDrinks(drinks);
      setIsLoading(false);
    }
    getData();
  }, []);

  if (isLoading) {
    return <p>Loading &hellip;</p>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home snacks={snacks} drinks={drinks} />} />
            <Route path="/snacks" element={<Menu items={snacks} title="Snacks" />} />
            <Route path="/snacks/:id" element={<Item items={snacks} cantFind="/snacks" />} />
            <Route path="/drinks" element={<Menu items={drinks} title="Drinks" />} />
            <Route path="/drinks/:id" element={<Item items={drinks} cantFind="/drinks" />} />
            <Route path="/add" element={<AddItemForm />} />
            <Route path="*" element={<NotFound />} /> {/* Handling not-found pages */}
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
