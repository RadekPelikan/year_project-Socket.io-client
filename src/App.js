import React, { useState } from "react";
import CanvasPage from "./pages/CanvasPage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="draw" element={<CanvasPage />} />
      </Routes>
    </div>
  );
};

export default App;