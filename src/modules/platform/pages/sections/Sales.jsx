import React from "react";
import "../../styles/Sales.css";

export default function SalesPage() {
  return (
    <div className="sales">

      {/* HERO */}
      <section className="hero">
        <h1>Background Verification Platform</h1>
        <p>Fast. Reliable. Scalable BGV for modern businesses.</p>
        <button>Get Started</button>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="card">
          <h3>Automated Checks</h3>
          <p>Reduce manual effort with automated workflows</p>
        </div>

        <div className="card">
          <h3>Real-time Tracking</h3>
          <p>Track candidate verification status instantly</p>
        </div>

        <div className="card">
          <h3>Secure & Compliant</h3>
          <p>Data protection and audit-ready system</p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start verifying candidates today</h2>
        <button>Request Demo</button>
      </section>

    </div>
  );
}   