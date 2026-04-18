import EffectCell from "./components/EffectCell";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const BOARD_SIZE = 9;

/** 점수 구간별 스테이지 (임시: 50·100·150·200 돌파 시 +1) */
function getStageFromScore(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 200) return 5;
  if (score >= 150) return 4;
  if (score >= 100) return 3;
  if (score >= 50) return 2;
  return 1;
}

/** 스테이지별 두더지 보이는 시간 / 숨는 시간(ms) — 상위 스테이지일수록 짧게(어렵게) */
const STAGE_TIMING: Record<
  1 | 2 | 3 | 4 | 5,
  { visibleMin: number; visibleMax: number; hiddenMin: number; hiddenMax: number }
> = {
  1: { visibleMin: 850, visibleMax: 1150, hiddenMin: 250, hiddenMax: 900 },
  2: { visibleMin: 750, visibleMax: 1000, hiddenMin: 220, hiddenMax: 800 },
  3: { visibleMin: 700, visibleMax: 950, hiddenMin: 200, hiddenMax: 700 },
  4: { visibleMin: 650, visibleMax: 900, hiddenMin: 180, hiddenMax: 600 },
  5: { visibleMin: 600, visibleMax: 850, hiddenMin: 150, hiddenMax: 500 },
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMoleIndex, setActiveMoleIndex] = useState<number | null>(null);

  const stage = useMemo(() => getStageFromScore(score), [score]);

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

    const timing = STAGE_TIMING[stage];

    const scheduleMole = () => {
      if (cancelled) return;

      const hiddenDelay = randomBetween(timing.hiddenMin, timing.hiddenMax);
      showTimeout = setTimeout(() => {
        if (cancelled) return;

        setActiveMoleIndex(Math.floor(Math.random() * BOARD_SIZE));

        const visibleDelay = randomBetween(timing.visibleMin, timing.visibleMax);
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
  }, [isRunning, stage]);

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
          <p>
            스테이지:{" "}
            <span style={{ color: "#63b3ed" }}>
              {stage} / 5
            </span>
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
