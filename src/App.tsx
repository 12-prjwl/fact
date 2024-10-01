import React from "react";
import Accordion from "./components/Accordion";
import { CelebrityProvider } from "./context/CelebrityContext";

const App: React.FC = () => {
  return (
    <CelebrityProvider>
      <Accordion />
    </CelebrityProvider>
  );
};

export default App;
