import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import mole from "../assets/mole.png";

type Props = {
  onHit: () => void;
  isActive: boolean;
};

const LABELS = ["재수강!", "과락!", "F!", "성적 공개!", "과제 추가!"];

export default function EffectCell({ onHit, isActive }: Props) {
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
    <div
      onClick={handleClick}
      style={{
        width: "80px",
        height: "80px",
        cursor: isActive ? "pointer" : "default",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        position: "relative",
        overflow: "visible",
      }}
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
              width: "55px",
              height: "55px",
              border: "3px solid rgba(255, 70, 70, 0.9)",
              borderRadius: "999px",
              bottom: "6px",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* 두더지 */}
      <AnimatePresence>
        {isActive && (
          <motion.img
            src={mole}
            alt="mole"
            initial={{ y: 12, opacity: 0 }}
            animate={{
              opacity: 1,
              scaleX: hit ? 1.18 : 1,
              scaleY: hit ? 0.75 : 1,
              y: hit ? 5 : 0,
              rotate: hit ? -8 : 0,
              x: hit ? [-2, 2, -1, 1, 0] : 0,
            }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              width: "58px",
              height: "58px",
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
              position: "relative",
              zIndex: 2,
              filter: hit ? "brightness(0.85) contrast(1.15)" : "none",
            }}
            draggable={false}
          />
        )}
      </AnimatePresence>

      {/* 임팩트 텍스트 */}
      <AnimatePresence>
  {hit && (
    <motion.div
      key={label}
      initial={{
        opacity: 0,
        scale: 1.22,
        rotate: -12,
      }}
      animate={{
        opacity: 0.95,
        scale: 1,
        rotate: -12,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        rotate: -12,
      }}
      transition={{
        duration: 0.18,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        top: "4px",
        right: "-4px",

        fontSize: "10px",
        fontWeight: 900,
        letterSpacing: "0.35px",

        color: "#dc2626",
        border: "2px solid #dc2626",

        padding: "3px 6px",
        borderRadius: "4px",

        backgroundColor: "rgba(255,255,255,0.78)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.14)",

        pointerEvents: "none",
        zIndex: 5,
        lineHeight: 1,
      }}
    >
      {label}
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
}