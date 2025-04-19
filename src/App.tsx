import React, { useState } from "react";
import MatchSetup from "./components/MatchSetup";
import ScoreBoard from "./components/ScoreBoard";

function App() {
  const [matchStarted, setMatchStarted] = useState(false);
  const [inning, setInning] = useState(1);
  const [secondInningReady, setSecondInningReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [players1, setPlayers1] = useState<string[]>([]);
  const [players2, setPlayers2] = useState<string[]>([]);
  const [battingFirst, setBattingFirst] = useState("");
  const [overs, setOvers] = useState(5);
  const [isSoloBatsman, setIsSoloBatsman] = useState(false);

  const [firstInningScore, setFirstInningScore] = useState({ runs: 0, wickets: 0 });
  const [secondInningScore, setSecondInningScore] = useState({ runs: 0, wickets: 0 });

  const handleStartMatch = (
    t1: string,
    t2: string,
    p1: string[],
    p2: string[],
    batting: string,
    ovr: number,
    solo: boolean
  ) => {
    setTeam1(t1);
    setTeam2(t2);
    setPlayers1(p1);
    setPlayers2(p2);
    setBattingFirst(batting);
    setOvers(ovr);
    setIsSoloBatsman(solo);
    setMatchStarted(true);
  };

  const handleInningEnd = (runs: number, wickets: number) => {
    if (inning === 1) {
      setFirstInningScore({ runs, wickets });
      setSecondInningReady(true);
    } else {
      setSecondInningScore({ runs, wickets });
      setGameOver(true);
    }
  };

  const handleStartSecondInning = () => {
    setInning(2);
    setSecondInningReady(false);
  };

  const getWinnerText = () => {
    const team2Batting = battingFirst === team1 ? team2 : team1;
    const team1Batting = battingFirst;

    if (firstInningScore.runs > secondInningScore.runs) {
      return `${team1Batting} wins by ${firstInningScore.runs - secondInningScore.runs} runs`;
    } else if (secondInningScore.runs > firstInningScore.runs) {
      return `${team2Batting} wins by ${players1.length - 1 - secondInningScore.wickets} wickets`;
    } else {
      return "Match Tied!";
    }
  };

  const getCurrentBattingTeam = () => (inning === 1 ? battingFirst : battingFirst === team1 ? team2 : team1);
  const getCurrentPlayers = () => (inning === 1 ? (battingFirst === team1 ? players1 : players2) : (battingFirst === team1 ? players2 : players1));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl">
        {!matchStarted ? (
          <MatchSetup onStart={handleStartMatch} />
        ) : gameOver ? (
          <div className="p-6 bg-white rounded-xl shadow text-center w-full">
            <h2 className="text-2xl font-bold mb-2">Match Over</h2>
            <p className="text-lg font-semibold mb-4">{getWinnerText()}</p>
            <p className="text-gray-700 mb-2">{battingFirst}: {firstInningScore.runs}/{firstInningScore.wickets}</p>
            <p className="text-gray-700">{battingFirst === team1 ? team2 : team1}: {secondInningScore.runs}/{secondInningScore.wickets}</p>
          </div>
        ) : secondInningReady ? (
          <div className="p-6 bg-white rounded-xl shadow text-center w-full">
            <h2 className="text-2xl font-bold mb-4">1st Inning Complete</h2>
            <p className="mb-4">{battingFirst}: {firstInningScore.runs}/{firstInningScore.wickets}</p>
            <button onClick={handleStartSecondInning} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Start 2nd Inning
            </button>
          </div>
        ) : (
          <ScoreBoard
            overs={overs}
            players={getCurrentPlayers()}
            isSoloBatsman={isSoloBatsman}
            onInningEnd={handleInningEnd}
            target={inning === 2 ? firstInningScore.runs : undefined}
            teamName={getCurrentBattingTeam()}
          />
        )}
      </div>
    </div>
  );
}

export default App;
