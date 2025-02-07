import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ZeroProvider } from "@rocicorp/zero/react";
import { Zero } from "@rocicorp/zero";
import { type Schema, schema } from "./schema.ts";
import { CookiesProvider } from "react-cookie";

const z = new Zero({
  userID: "anon",
  server: import.meta.env.VITE_PUBLIC_SERVER,
  schema,
  // This is often easier to develop with if you're frequently changing
  // the schema. Switch to 'idb' for local-persistence.
  kvStore: "mem",
});

function exposeDevHooks(z: Zero<Schema>) {
  const casted = window as unknown as {
    z?: Zero<Schema>;
  };
  casted.z = z;
}

exposeDevHooks(z);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZeroProvider zero={z}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </ZeroProvider>
  </StrictMode>
);
