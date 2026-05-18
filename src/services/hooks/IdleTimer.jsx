import { useEffect } from "react";
import { logoutUser } from "../api/Api";

const IDLE_TIME = 45 * 60 * 1000; // 45 mins

export const IdleTimer = () => {

  useEffect(() => {
    let timeout;
    
    /* =========================
       RESET TIMER
    ========================= */
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Session expired due to inactivity");
        logoutUser();
      }, IDLE_TIME);
    };

    /* =========================
       EVENTS
    ========================= */
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "touchmove",
      "scroll",
      "click",
    ];

    /* =========================
       ADD LISTENERS
    ========================= */
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    /* =========================
       START TIMER
    ========================= */
    resetTimer();

    /* =========================
       CLEANUP
    ========================= */
    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);
  return null;
};