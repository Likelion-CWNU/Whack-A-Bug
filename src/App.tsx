import EffectCell from "./components/EffectCell";
import { useEffect, useState } from "react";
import "./App.css";

const BOARD_SIZE = 9;
const VISIBLE_MIN_MS = 750;
const VISIBLE_MAX_MS = 1000;
const HIDDEN_MIN_MS = 250;
const HIDDEN_MAX_MS = 900;

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMoleIndex, setActiveMoleIndex] = useState<number | null>(null);

  const handleScore = (index: number) => {
    if (!isRunning || timeLeft <= 0 || activeMoleIndex !== index) return;
    setScore((prev) => prev + 10);
    setActiveMoleIndex(null);
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

  useEffect(() => {
    if (!isRunning) {
      setActiveMoleIndex(null);
      return;
    }

    let cancelled = false;
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleMole = () => {
      if (cancelled) return;

      const hiddenDelay = randomBetween(HIDDEN_MIN_MS, HIDDEN_MAX_MS);
      showTimeout = setTimeout(() => {
        if (cancelled) return;

        setActiveMoleIndex(Math.floor(Math.random() * BOARD_SIZE));

        const visibleDelay = randomBetween(VISIBLE_MIN_MS, VISIBLE_MAX_MS);
        hideTimeout = setTimeout(() => {
          if (cancelled) return;
          setActiveMoleIndex(null);
          scheduleMole();
        }, visibleDelay);
      }, hiddenDelay);
    };

    scheduleMole();

    return () => {
      cancelled = true;
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [isRunning]);

  const startGame = () => {
    if (timeLeft <= 0) {
      setTimeLeft(180);
      setScore(0);
    }
    setIsRunning(true);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(180);
    setIsRunning(false);
    setActiveMoleIndex(null);
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
        {[...Array(BOARD_SIZE)].map((_, i) => (
          <EffectCell
            key={i}
            onHit={() => handleScore(i)}
            isActive={isRunning && activeMoleIndex === i}
          />
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
