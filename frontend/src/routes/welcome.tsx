import React from "react";
import { WelcomeScreen } from "#/components/features/welcome/welcome-screen";

function Welcome() {
  return (
    <div
      data-testid="welcome-screen"
      className="h-full w-full bg-base relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Subtle glow effects */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-purple-500/10 rounded-full filter blur-3xl"></div>

      <WelcomeScreen />
    </div>
  );
}

export default Welcome;
