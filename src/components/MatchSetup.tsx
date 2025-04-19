// MatchSetup.tsx
import React, { useState } from "react";

type Props = {
  onStart: (
    team1: string,
    team2: string,
    players1: string[],
    players2: string[],
    battingFirst: string,
    overs: number,
    isSoloBatsman: boolean
  ) => void;
};

const MatchSetup: React.FC<Props> = ({ onStart }) => {
  const [numPlayers, setNumPlayers] = useState(5);
  const [overs, setOvers] = useState(5);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [players1, setPlayers1] = useState<string[]>(Array(5).fill(""));
  const [players2, setPlayers2] = useState<string[]>(Array(5).fill(""));
  const [battingFirst, setBattingFirst] = useState("");
  const [isSoloBatsman, setIsSoloBatsman] = useState(false);

  const handlePlayerCountChange = (count: number) => {
    setNumPlayers(count);
    setPlayers1(Array(count).fill(""));
    setPlayers2(Array(count).fill(""));
  };

  const handleStart = () => {
    if (
      team1 &&
      team2 &&
      battingFirst &&
      !players1.includes("") &&
      !players2.includes("")
    ) {
      onStart(team1, team2, players1, players2, battingFirst, overs, isSoloBatsman);
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <div className="match-setup-wrapper">
      <h2 className="section-title">Match Setup</h2>

      {/* Form Controls */}
      <div className="setup-top-row">
        <div className="setup-field">
          <label className="block mb-1 font-medium">Players per Team</label>
          <select value={numPlayers} onChange={(e) => handlePlayerCountChange(Number(e.target.value))}>
            {[...Array(11)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div className="setup-field">
          <label className="block mb-1 font-medium">Overs</label>
          <input
            type="number"
            min={1}
            step="0.1"
            value={overs}
            onChange={(e) => setOvers(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Table for Team Names & Players */}
      <div className="match-setup-table">
        <table>
          <thead>
            <tr>
              <th>{team1 || "Team 1"}</th>
              <th>{team2 || "Team 2"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  placeholder="Team 1 Name"
                />
              </td>
              <td>
                <input
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  placeholder="Team 2 Name"
                />
              </td>
            </tr>
            {players1.map((_, i) => (
              <tr key={i}>
                <td>
                  <input
                    value={players1[i]}
                    onChange={(e) => {
                      const updated = [...players1];
                      updated[i] = e.target.value;
                      setPlayers1(updated);
                    }}
                    placeholder={`Player ${i + 1}`}
                  />
                </td>
                <td>
                  <input
                    value={players2[i]}
                    onChange={(e) => {
                      const updated = [...players2];
                      updated[i] = e.target.value;
                      setPlayers2(updated);
                    }}
                    placeholder={`Player ${i + 1}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="setup-batting-row">
        <select
          value={battingFirst}
          onChange={(e) => setBattingFirst(e.target.value)}
        >
          <option value="">Choose Batting First</option>
          <option value={team1}>{team1}</option>
          <option value={team2}>{team2}</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={isSoloBatsman}
            onChange={(e) => setIsSoloBatsman(e.target.checked)}
          />
          <span className="ml-2">Only one batsman will play</span>
        </label>
      </div>

      <div className="setup-button-container">
        <button
          onClick={handleStart}
          className="start-button"
        >
          Start Match
        </button>
      </div>

      <p className="text-sm italic text-gray-400">More features coming soon...</p>

    </div>
  );
};

export default MatchSetup;