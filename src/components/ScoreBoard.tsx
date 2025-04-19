// ScoreBoard.tsx
import React, { useState, useEffect } from "react";
// import PredictionGraph from "./PredictionGraph";

type Props = {
  overs: number;
  players: string[];
  isSoloBatsman: boolean;
  onInningEnd: (runs: number, wickets: number) => void;
  target?: number;
  teamName: string;
};

const ScoreBoard: React.FC<Props> = ({ overs, players, isSoloBatsman, onInningEnd, target, teamName }) => {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [extraMode, setExtraMode] = useState<"none" | "wide" | "noball">("none");
  const [isOver, setIsOver] = useState(false);
  const [lastBall, setLastBall] = useState<string>("–");

  const [batsmen, setBatsmen] = useState<{ name: string; runs: number; balls: number; out: boolean }[]>([]);
  const [strikerIndex, setStrikerIndex] = useState(0);
  const [nonStrikerIndex, setNonStrikerIndex] = useState(1);
  const [nextBatsmanIndex, setNextBatsmanIndex] = useState(2);

  const [overData, setOverData] = useState<{ over: number; runs: number; predicted?: number }[]>([]);
  const [lastAction, setLastAction] = useState<null | {
    type: "run" | "wicket" | "extra";
    value?: number;
    strikerIndex?: number;
  }>(null);

  const totalBalls = Math.floor(overs) * 6 + Math.round((overs % 1) * 10);
  const maxWickets = players.length > 1 ? players.length - 1 : 1;
  const oversDisplay = `${Math.floor(balls / 6)}.${balls % 6}`;

  const crr = balls > 0 ? (runs / (balls / 6)).toFixed(2) : "0.00";
  const rrr = target !== undefined && balls > 0 ? (((target + 1 - runs) / ((totalBalls - balls) / 6)).toFixed(2)) : null;

  const predictedMid = Math.round((runs / (balls / 6)) * overs);
  const predictedLow = predictedMid - 5;
  const predictedHigh = predictedMid + 5;

  useEffect(() => {
    const init = players.map((p) => ({ name: p, runs: 0, balls: 0, out: false }));
    setBatsmen(init);
  }, [players]);

  useEffect(() => {
    if ((balls >= totalBalls || wickets >= maxWickets || (target !== undefined && runs > target)) && !isOver) {
      setIsOver(true);
      onInningEnd(runs, wickets);
    }
  }, [balls, wickets, runs, isOver, onInningEnd, totalBalls, maxWickets, target]);

  const handleRun = (value: number) => {
    const updated = [...batsmen];
    if (!updated[strikerIndex] || updated[strikerIndex].out) return;

    updated[strikerIndex].runs += value;
    updated[strikerIndex].balls += 1;
    setBatsmen(updated);
    setRuns(runs + value);
    setBalls(balls + 1);

    if (!isSoloBatsman && !isOver) {
      if (value % 2 === 1) {
        setStrikerIndex(nonStrikerIndex);
        setNonStrikerIndex(strikerIndex);
      }
      if ((balls + 1) % 6 === 0) {
        setStrikerIndex(nonStrikerIndex);
        setNonStrikerIndex(strikerIndex);
      }
    }

    setLastBall(`${value}️⃣`);
    setLastAction({ type: "run", value, strikerIndex });

    const overNum = Math.floor((balls + 1) / 6);
    const index = overData.findIndex((o) => o.over === overNum);
    const updatedData = [...overData];

    if (index !== -1) {
      const updatedOver = { ...updatedData[index] };
      updatedOver.runs += value;
      updatedData[index] = updatedOver;
    } else {
      updatedData.push({ over: overNum, runs: value });
    }

    setOverData(updatedData);
  };

  const handleWicket = () => {
    const updated = [...batsmen];
    updated[strikerIndex].out = true;
    updated[strikerIndex].balls += 1;
    setBatsmen(updated);
    setWickets(wickets + 1);
    setBalls(balls + 1);

    if (nextBatsmanIndex < batsmen.length) {
      setStrikerIndex(nextBatsmanIndex);
      setNextBatsmanIndex(nextBatsmanIndex + 1);
    } else {
      setIsOver(true);
      onInningEnd(runs, wickets + 1);
    }

    setLastBall("❌ Wicket");
    setLastAction({ type: "wicket", strikerIndex });
  };

  const handleUndo = () => {
    if (!lastAction) return;
    const updated = [...batsmen];

    if (lastAction.type === "run" && lastAction.strikerIndex !== undefined) {
      updated[lastAction.strikerIndex].runs -= lastAction.value || 0;
      updated[lastAction.strikerIndex].balls -= 1;
      setRuns((r) => r - (lastAction.value || 0));
      setBalls((b) => b - 1);
      setBatsmen(updated);
    }

    if (lastAction.type === "wicket" && lastAction.strikerIndex !== undefined) {
      updated[lastAction.strikerIndex].out = false;
      updated[lastAction.strikerIndex].balls -= 1;
      setWickets((w) => w - 1);
      setBalls((b) => b - 1);
      setBatsmen(updated);
      setStrikerIndex(lastAction.strikerIndex);
      setNextBatsmanIndex((n) => n - 1);
    }

    if (lastAction.type === "extra") {
      setRuns((r) => r - 1);
    }

    setLastAction(null);
  };

  return (
    <div className="scoreboard-wrapper">
      <div className="scoreboard-inner">
        <h2 className="section-title">GullyScore</h2>
        <p className="font-semibold text-lg">Batting: {teamName}</p>
        {/* <p className="text-sm text-gray-600">Players: {players.join(", ")}</p> */}

        <p className="stat-overs">Overs: {oversDisplay} / {overs}</p>
        <p className="stat-wickets">Runs: {runs} | Wickets: {wickets} / {maxWickets}</p>

        <div className="score-summary">
          <div className="score-rate">
            <span className="stat-crr">CRR: {crr}</span>
            {rrr && <span className="stat-rrr"> | RRR: {rrr}</span>}
          </div>

          {/* <PredictionGraph data={projected} /> */}

          <p className="predicted-score">
            Predicted Score: {predictedLow} – {predictedHigh}
          </p>

          {isSoloBatsman && <p className="text-blue-600 font-semibold">Solo Batsman Mode 🧍‍♂️</p>}
          {target !== undefined && <p className="target">Target: {target + 1}</p>}
        </div>

        <div className="last-ball">Last Ball: <span>{lastBall}</span></div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              disabled={isOver}
              onClick={() => {
                if (extraMode === "none") handleRun(run);
                else {
                  const updated = [...batsmen];
                  if (!updated[strikerIndex] || updated[strikerIndex].out) return;
                  updated[strikerIndex].runs += run;
                  setBatsmen(updated);
                  setRuns(runs + 1 + run);
                  setExtraMode("none");
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              +{run}
            </button>
          ))}

          <button
            disabled={isOver}
            onClick={() => {
              if (extraMode === "none") handleWicket();
              else {
                setRuns(runs + 1);
                setExtraMode("none");
                handleWicket();
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Wicket
          </button>

          <button
            disabled={isOver}
            onClick={() => {
              setExtraMode("wide");
              setLastBall("🟡 Wide");
              setLastAction({ type: "extra", value: 1 });
            }}
            className="bg-yellow-500 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Wide
          </button>

          <button
            disabled={isOver}
            onClick={() => {
              setExtraMode("noball");
              setLastBall("🟠 No-Ball");
              setLastAction({ type: "extra", value: 1 });
            }}
            className="bg-yellow-500 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            No-Ball
          </button>

          <button
            onClick={handleUndo}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Undo
          </button>
        </div>

        <p className="text-sm italic text-gray-400">More features coming soon...</p>


        {/* <div className="mt-4 text-center space-y-1 batting-info">
          <h3 className="font-bold text-lg">Batting:</h3>
          {batsmen.map((b, i) => (
            <p key={i} className={b.out ? "out" : i === strikerIndex ? "active" : ""}>
              {b.name} – {b.runs} ({b.balls}) {b.out ? "❌" : i === strikerIndex ? "🟢" : ""}
            </p>
          ))}
        </div> */}

        {isOver && <p className="mt-4 text-red-600 font-bold text-lg">Inning Over 🔔</p>}
      </div>
    </div>
  );
};

export default ScoreBoard;
