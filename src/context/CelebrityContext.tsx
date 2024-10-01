import React, { createContext, useState, useContext } from "react";
import { Celebrity } from "../types/celebrity";

interface CelebrityContextProps {
  celebrities: Celebrity[];
  setCelebrities: React.Dispatch<React.SetStateAction<Celebrity[]>>;
  updateCelebrity: (updatedCelebrity: Celebrity) => void;
  deleteCelebrity: (id: number) => void; // Add the deleteCelebrity function to the context
}

const CelebrityContext = createContext<CelebrityContextProps | undefined>(
  undefined
);

export const useCelebrityContext = () => {
  const context = useContext(CelebrityContext);
  if (!context) {
    throw new Error(
      "useCelebrityContext must be used within a CelebrityProvider"
    );
  }
  return context;
};

export const CelebrityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);

  const deleteCelebrity = (id: number) => {
    setCelebrities((prev) => prev.filter((celebrity) => celebrity.id !== id));
  };

  const updateCelebrity = (updatedCelebrity: Celebrity) => {
    setCelebrities((prev) =>
      prev.map((celebrity) =>
        celebrity.id === updatedCelebrity.id ? updatedCelebrity : celebrity
      )
    );
  };

  return (
    <CelebrityContext.Provider
      value={{
        celebrities,
        setCelebrities,
        updateCelebrity,
        deleteCelebrity, // Provide the deleteCelebrity function here
      }}
    >
      {children}
    </CelebrityContext.Provider>
  );
};
