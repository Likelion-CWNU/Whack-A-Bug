import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import mole from "../assets/mole.png";
import pit from "../assets/pit.png";

type Props = {
  onHit: () => void;
  isActive: boolean;
  professorPhoto?: string | null;
};

const LABELS = ["재수강!", "과락!", "F!", "성적 공개!", "과제 추가!"];

export default function EffectCell({ onHit, isActive, professorPhoto }: Props) {
  const [hit, setHit] = useState(false);
  const [label, setLabel] = useState("");

  const handleClick = () => {
    if (!isActive) return;
    const randomLabel = LABELS[Math.floor(Math.random() * LABELS.length)];
    setLabel(randomLabel);
    setHit(true);
    onHit();
    setTimeout(() => {
      setHit(false);
    }, 260);
  };

  return (
    <div className="cell-wrapper" onClick={handleClick}>
      {/* 구멍 이미지 */}
      <img src={pit} alt="pit" className="pit-img" />

      {/* 두더지 or 교수님 사진 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="mole-wrapper"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* 충격파 */}
            <AnimatePresence>
              {hit && (
                <motion.div
                  key="impact-ring"
                  initial={{ scale: 0.4, opacity: 0.7 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: "70px",
                    height: "70px",
                    border: "3px solid rgba(255,70,70,0.9)",
                    borderRadius: "50%",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                  }}
                />
              )}
            </AnimatePresence>

            <motion.img
              src={professorPhoto ?? mole}
              alt="mole"
              animate={{
                scaleX: hit ? 1.18 : 1,
                scaleY: hit ? 0.75 : 1,
                y: hit ? 5 : 0,
                rotate: hit ? -8 : 0,
                x: hit ? [-2, 2, -1, 1, 0] : 0,
              }}
              transition={{ duration: 0.18 }}
              style={{
                width: "72px",
                height: "72px",
                objectFit: "cover",
                pointerEvents: "none",
                userSelect: "none",
                borderRadius: professorPhoto ? "50%" : "0",
                border: professorPhoto ? "2px solid white" : "none",
                filter: hit ? "brightness(0.85) contrast(1.15)" : "none",
              }}
              draggable={false}
            />

            {/* 임팩트 텍스트 */}
            <AnimatePresence>
              {hit && (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 1.22, rotate: -12 }}
                  animate={{ opacity: 0.95, scale: 1, rotate: -12 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-20px",
                    fontSize: "10px",
                    fontWeight: 900,
                    color: "#dc2626",
                    border: "2px solid #dc2626",
                    padding: "3px 6px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    pointerEvents: "none",
                    zIndex: 5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
