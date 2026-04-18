import EffectCell from "./components/EffectCell";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);

  const handleScore = () => {
    if (!isRunning || timeLeft <= 0) return;
    setScore((prev) => prev + 10);
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const startGame = () => {
    setIsRunning(true);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(180);
    setIsRunning(false);
  };

  return (
    <div
      className="game-container"
      style={{
        textAlign: "center",
        backgroundColor: "#1a202c",
        color: "white",
        minHeight: "screen",
        padding: "20px",
      }}
    >
      <header>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Whack-A-Bug 🎓</h1>
        <div
          className="status"
          style={{ margin: "20px 0", fontSize: "1.2rem" }}
        >
          <p>
            현재 점수: <span style={{ color: "#ecc94b" }}>{score}</span>
          </p>
          <p>남은 시간: {timeLeft}초</p>
          {!isRunning && timeLeft > 0 && (
            <button
              onClick={startGame}
              style={{
                marginTop: "12px",
                marginRight: "8px",
                padding: "10px 20px",
                backgroundColor: "#16a34a",
                borderRadius: "5px",
                border: "none",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              게임 시작
            </button>
          )}
        </div>
      </header>

      <main
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        {[...Array(9)].map((_, i) => (
          <EffectCell key={i} onHit={handleScore} />
        ))}
      </main>

      <footer style={{ marginTop: "30px" }}>
        <button
          onClick={resetGame}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3182ce",
            borderRadius: "5px",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          게임 리셋
        </button>
      </footer>
    </div>
  );
}

export default App;
