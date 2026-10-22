import { createContext, useContext, useState } from "react";

const DataContext = createContext<any>(null);

export function DataProvider({ children }: any) {
  const [data, setData] = useState(new Date());

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}