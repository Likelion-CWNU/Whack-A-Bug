import EffectCell from "./components/EffectCell";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchRankings } from "./services/rankingService";
import { submitGameResult } from "./services/gameResultservice";
import type { RankingEntry } from "./types/ranking";
import playImg from "./assets/play.png";
import heartFull from "./assets/heart_full.png";
import heartEmpty from "./assets/heart_empty.png";
import devilImg from "./assets/devil.png";
import "./App.css";

const BOARD_SIZE = 9;
const INITIAL_TIME_SEC = 180;

/** 교수 선택 UI가 없을 때 랭킹 저장용 기본값 (나중에 교수 목록과 연동 가능) */
const DEFAULT_PROFESSOR_ID = "default";
const DEFAULT_PROFESSOR_NAME = "교수님";

type Screen = "main" | "photo-modal" | "game" | "result-modal";

type Stage = 1 | 2 | 3 | 4 | 5;

type StageTiming = {
  visibleMin: number;
  visibleMax: number;
  hiddenMin: number;
  hiddenMax: number;
};

function getStageFromScore(score: number): Stage {
  if (score >= 200) return 5;
  if (score >= 150) return 4;
  if (score >= 100) return 3;
  if (score >= 50) return 2;
  return 1;
}

const STAGE_TIMING: Record<Stage, StageTiming> = {
  1: { visibleMin: 850, visibleMax: 1150, hiddenMin: 250, hiddenMax: 900 },
  2: { visibleMin: 750, visibleMax: 1000, hiddenMin: 220, hiddenMax: 800 },
  3: { visibleMin: 700, visibleMax: 950, hiddenMin: 200, hiddenMax: 700 },
  4: { visibleMin: 650, visibleMax: 900, hiddenMin: 180, hiddenMax: 600 },
  5: { visibleMin: 600, visibleMax: 850, hiddenMin: 150, hiddenMax: 500 },
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function Hearts({ lives = 3 }: { lives?: number }) {
  return (
    <div className="hearts">
      {[...Array(3)].map((_, i) => (
        <img
          key={i}
          src={i < lives ? heartFull : heartEmpty}
          alt="heart"
          className="heart-img"
        />
      ))}
    </div>
  );
}

function App() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SEC);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMoleIndex, setActiveMoleIndex] = useState<number | null>(null);
  const [screen, setScreen] = useState<Screen>("main");
  const [professorPhoto, setProfessorPhoto] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [topRankings, setTopRankings] = useState<RankingEntry[] | null>(null);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerDone, setRegisterDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stage = useMemo(() => getStageFromScore(score), [score]);

  const handleScore = (index: number) => {
    if (!isRunning || timeLeft <= 0 || activeMoleIndex !== index) return;
    setScore((prev) => prev + 10);
    setActiveMoleIndex(null);
  };

  // 타이머
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setScreen("result-modal");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  // 두더지 스케줄러
  useEffect(() => {
    if (!isRunning) return;
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
        const visibleDelay = randomBetween(
          timing.visibleMin,
          timing.visibleMax
        );
        hideTimeout = setTimeout(() => {
          if (cancelled) return;
          setActiveMoleIndex((prev) => {
            if (cancelled) return null;
            if (prev !== null) {
              setLives((l) => {
                const next = l - 1;
                if (next <= 0) {
                  setIsRunning(false);
                  setScreen("result-modal");
                }
                return next;
              });
            }
            return null;
          });
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

  useEffect(() => {
    if (screen !== "result-modal") {
      setTopRankings(null);
      return;
    }
    setRegisterError(null);
    setRegisterDone(false);
    let cancelled = false;
    fetchRankings({ limit: 3, orderBy: "score" })
      .then((rows) => {
        if (!cancelled) setTopRankings(rows);
      })
      .catch(() => {
        if (!cancelled) setTopRankings([]);
      });
    return () => {
      cancelled = true;
    };
  }, [screen]);

  const handleSubmitRanking = async () => {
    const nick = nickname.trim();
    if (!nick || registerSubmitting || registerDone) return;

    setRegisterSubmitting(true);
    setRegisterError(null);
    try {
      await submitGameResult({
        nickname: nick,
        professorId: DEFAULT_PROFESSOR_ID,
        professorName: DEFAULT_PROFESSOR_NAME,
        totalScore: score,
        clearTime: INITIAL_TIME_SEC - timeLeft,
        stageReached: stage,
        stageResults: [],
      });
      setRegisterDone(true);
      const rows = await fetchRankings({ limit: 3, orderBy: "score" });
      setTopRankings(rows);
    } catch (e) {
      setRegisterError(
        e instanceof Error ? e.message : "등록에 실패했습니다."
      );
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(INITIAL_TIME_SEC);
    setIsRunning(false);
    setActiveMoleIndex(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfessorPhoto(URL.createObjectURL(file));
  };

  const handleStartGame = () => {
    resetGame();
    setScreen("game");
    setIsRunning(true);
  };

  const handleRestart = () => {
    resetGame();
    setProfessorPhoto(null);
    setNickname("");
    setScreen("main");
  };

  // ── 메인 화면 ──
  // 메인 화면
  if (screen === "main") {
    return (
      <div className="game-container main-screen">
        <div className="main-top">
          <span className="score-display">Score: 0</span>
          <Hearts />
        </div>
        <div className="main-center">
          <button className="play-btn" onClick={() => setScreen("photo-modal")}>
            <img src={playImg} alt="PLAY" className="play-btn-img" />
          </button>
        </div>
        <div className="main-ground" />
      </div>
    );
  }

  // ── 교수님 사진 팝업 ──
  if (screen === "photo-modal") {
    return (
      <div className="game-container main-screen">
        <div className="main-ground" />
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">교수님 사진 등록</h2>
            <p className="modal-desc">
              두더지에 적용될 교수님 사진을 올려주세요!
            </p>
            <div
              className="photo-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              {professorPhoto ? (
                <img
                  src={professorPhoto}
                  alt="professor"
                  className="photo-preview"
                />
              ) : (
                <div className="photo-placeholder">
                  <span style={{ fontSize: "32px" }}>📷</span>
                  <span>클릭해서 사진 선택</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            <div className="modal-buttons">
              <button
                className="btn-secondary"
                onClick={() => setScreen("main")}
              >
                취소
              </button>
              <button className="btn-primary" onClick={handleStartGame}>
                게임 시작!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 게임 화면 ──
  if (screen === "game") {
    return (
      <div className="game-container game-screen">
        <header className="game-header">
          <span className="score-display">Score: {score}</span>
          <Hearts lives={lives} />
        </header>
        <div className="time-bar-wrap">
          <div
            className="time-bar"
            style={{ width: `${(timeLeft / INITIAL_TIME_SEC) * 100}%` }}
          />
        </div>
        <img src={devilImg} alt="devil" className="devil-img" />
        <div className="main-ground" />
        <div className="game-field">
          <div className="holes-grid">
            {[...Array(BOARD_SIZE)].map((_, i) => (
              <EffectCell
                key={i}
                onHit={() => handleScore(i)}
                isActive={isRunning && activeMoleIndex === i}
                professorPhoto={professorPhoto}
              />
            ))}
          </div>
        </div>
        <button className="reset-btn" onClick={handleRestart}>
          다시하기
        </button>
      </div>
    );
  }

  // ── 결과 / 랭킹 모달 (게임 종료 시) ──
  if (screen === "result-modal") {
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <div className="game-container main-screen">
        <div className="main-ground" />
        <div className="modal-overlay ranking-modal-overlay">
          <div className="ranking-modal">
            <button
              type="button"
              className="ranking-close"
              onClick={handleRestart}
              aria-label="닫기"
            >
              ×
            </button>
            <h2 className="ranking-modal-title">랭킹</h2>
            <p className="ranking-my-score">
              이번 점수{" "}
              <strong className="ranking-my-score-num">{score}</strong>
            </p>
            <div className="ranking-board">
              {medals.map((m, i) => {
                const row = topRankings?.[i];
                return (
                  <div key={i} className="ranking-row">
                    <span className="ranking-medal" aria-hidden>
                      {m}
                    </span>
                    <div className="ranking-row-text">
                      <span className="ranking-name">
                        {topRankings === null ? "…" : row?.nickname ?? "—"}
                      </span>
                      <span className="ranking-pts">
                        {topRankings === null
                          ? ""
                          : row !== undefined
                            ? `${row.score}`
                            : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="ranking-hint">
              닉네임을 입력하고 랭킹에 등록할 수 있어요.
            </p>
            <input
              className="nickname-input ranking-nickname"
              type="text"
              placeholder="닉네임 입력"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={10}
              disabled={registerSubmitting || registerDone}
            />
            {registerError && (
              <p className="ranking-register-msg ranking-register-msg--error">
                {registerError}
              </p>
            )}
            {registerDone && (
              <p className="ranking-register-msg ranking-register-msg--ok">
                등록되었습니다.
              </p>
            )}
            <div className="modal-buttons ranking-modal-actions">
              <button className="btn-secondary" onClick={handleRestart}>
                나가기
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={handleSubmitRanking}
                disabled={
                  !nickname.trim() ||
                  registerSubmitting ||
                  registerDone
                }
              >
                {registerSubmitting ? "등록 중…" : "등록하기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
