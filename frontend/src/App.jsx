import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";

const App = () => {
  return(
    <div>
      <Navbar/>
      <Chat />
    </div>
  );
};

export default App;
