"use client";

import type { DataUIPart } from "ai";
import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { CustomUIDataTypes } from "@/lib/types";

type DataStreamContextValue = {
  dataStream: DataUIPart<CustomUIDataTypes>[];
  setDataStream: React.Dispatch<
    React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
  >;
};

const DataStreamContext = createContext<DataStreamContextValue | null>(null);

export function DataStreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataStream, setDataStream] = useState<DataUIPart<CustomUIDataTypes>[]>(
    []
  );

  const value = useMemo(() => ({ dataStream, setDataStream }), [dataStream]);

  return (
    <DataStreamContext.Provider value={value}>
      {children}
    </DataStreamContext.Provider>
  );
}

const defaultDataStream: DataUIPart<CustomUIDataTypes>[] = [];

const defaultSetDataStream = (
  _value: React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
) => {
  // no-op for SSR
};

const defaultValue: DataStreamContextValue = {
  dataStream: defaultDataStream,
  setDataStream: defaultSetDataStream,
};

export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (!context) {
    return defaultValue;
  }
  return context;
}
