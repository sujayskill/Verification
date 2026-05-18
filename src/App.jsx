import React from "react";
import AppRouter from "./router/AppRouter";
import { IdleTimer } from "./services/hooks/IdleTimer";

export default function App() {

  return (
    <>
      <IdleTimer />
      <AppRouter />
    </>
  );
}