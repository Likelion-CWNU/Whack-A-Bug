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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) return;
    const randomLabel = LABELS[Math.floor(Math.random() * LABELS.length)];
    setLabel(randomLabel);
    setHit(true);
    onHit();
    setTimeout(() => {
      setHit(false);
    }, 400);
  };

  return (
    <div className="cell-wrapper" onClick={handleClick}>
      <img src={pit} alt="pit" className="pit-img" />

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="mole-wrapper"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
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
                width: "100px",
                height: "100px",
                objectFit: "cover",
                pointerEvents: "none",
                userSelect: "none",
                borderRadius: professorPhoto ? "50%" : "0",
                border: professorPhoto ? "2px solid white" : "none",
                filter: hit ? "brightness(0.85) contrast(1.15)" : "none",
              }}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              top: "0px",
              right: "-10px",
              fontSize: "16px",
              fontWeight: 900,
              color: "#dc2626",
              pointerEvents: "none",
              zIndex: 10,
              whiteSpace: "nowrap",
              fontFamily: "sans-serif",
              textShadow: "1px 1px 0 white, -1px -1px 0 white",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
