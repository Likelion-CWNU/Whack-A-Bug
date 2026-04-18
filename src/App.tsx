import EffectCell from "./components/EffectCell";
import { useState } from "react";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3분

  // 점수를 올리는 함수 (setScore 사용!)
  const handleScore = () => {
    setScore((prev) => prev + 10);
  };

  // 타이머를 줄이는 로직 (나중에 A님이 구체화할 예정, 우선 선언만)
  // setTimeLeft(179);

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
        </div>
      </header>

      {/* 9개 구멍 그리드 */}
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
          onClick={() => setTimeLeft(180)} // 리셋 버튼으로 setTimeLeft 사용!
          style={{
            padding: "10px 20px",
            backgroundColor: "#3182ce",
            borderRadius: "5px",
            border: "none",
            color: "white",
            fontWeight: "bold",
          }}
        >
          게임 리셋 (시간 초기화)
        </button>
      </footer>
    </div>
  );
}

export default App;
