// nx.d.ts
type JSONValue = string | number | boolean | { [key: string]: JSONValue } | JSONValue[];

declare const NX: {
    get: (key: string) => JSONValue;
    [key: string]: JSONValue; 
  };
  