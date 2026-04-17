import { useState } from "react";
import { useGameStore } from "./store/useGameStore";
import { useGameLogic } from "./hooks/useGameLogic";

function App() {
  const {
    score,
    timeLeft,
    level,
    bugPosition,
    gameStarted,
    professor,
    startGame,
    hitBug,
    missBug,
    resetGame,
  } = useGameStore();

  useGameLogic();

  const [selectedProfessor, setSelectedProfessor] = useState("");

  const handleHoleClick = (index: number) => {
    if (!gameStarted) return;
    if (bugPosition === index) {
      hitBug();
    } else {
      missBug();
    }
  };

  const handleStartGame = () => {
    if (selectedProfessor) {
      startGame(selectedProfessor);
    }
  };

  if (!gameStarted) {
    return (
      <div
        className="start-screen"
        style={{
          textAlign: "center",
          backgroundColor: "#1a202c",
          color: "white",
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
          Whack-A-Bug 🎓
        </h1>
        <p style={{ marginBottom: "20px" }}>교수님을 선택하세요:</p>
        <select
          value={selectedProfessor}
          onChange={(e) => setSelectedProfessor(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            fontSize: "1rem",
            borderRadius: "5px",
          }}
        >
          <option value="">선택</option>
          <option value="김교수">김교수</option>
          <option value="이교수">이교수</option>
          <option value="박교수">박교수</option>
        </select>
        <button
          onClick={handleStartGame}
          disabled={!selectedProfessor}
          style={{
            padding: "10px 20px",
            backgroundColor: selectedProfessor ? "#3182ce" : "#4a5568",
            borderRadius: "5px",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: selectedProfessor ? "pointer" : "not-allowed",
          }}
        >
          게임 시작
        </button>
      </div>
    );
  }

  return (
    <div
      className="game-container"
      style={{
        textAlign: "center",
        backgroundColor: "#1a202c",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <header>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Whack-A-Bug 🎓</h1>
        <div
          className="status"
          style={{ margin: "20px 0", fontSize: "1.2rem" }}
        >
          <p>교수님: {professor}</p>
          <p>
            현재 점수: <span style={{ color: "#ecc94b" }}>{score}</span>
          </p>
          <p>남은 시간: {timeLeft}초</p>
          <p>레벨: {level}</p>
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
          <div
            key={i}
            onClick={() => handleHoleClick(i)}
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#2d3748",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            {bugPosition === i ? "🐛" : "🎯"}
          </div>
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
          }}
        >
          게임 리셋
        </button>
      </footer>
    </div>
  );
}

export default App;
