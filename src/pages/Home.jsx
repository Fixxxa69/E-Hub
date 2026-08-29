import React, { useState } from 'react';

export default function Home({ 
  userCoins, 
  setUserCoins, 
  activeBgmiMatches = [], 
  activeFfMatches = [], 
  registeredMatches = [], 
  setRegisteredMatches 
}) {
  // Free Fire on Left by default
  const [selectedGame, setSelectedGame] = useState('Free Fire');
  
  // Modals state
  const [joiningMatch, setJoiningMatch] = useState(null);
  const [viewingMatchDetails, setViewingMatchDetails] = useState(null);
  const [ignInput, setIgnInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentMatches = selectedGame === 'Free Fire' ? activeFfMatches : activeBgmiMatches;

  const handleOpenJoinModal = (match, e) => {
    // Prevent opening match breakdown modal when clicking "Join Match" button directly
    e.stopPropagation();

    const isAlreadyJoined = registeredMatches.some(m => m.matchId === match.id);
    if (isAlreadyJoined) {
      alert('You have already registered for this match!');
      return;
    }

    setJoiningMatch(match);
    setIgnInput('');
    setErrorMsg('');
  };

  const handleConfirmJoin = (e) => {
    e.preventDefault();
    
    if (!ignInput.trim()) {
      setErrorMsg('Please enter your In-Game Name (IGN)');
      return;
    }

    const entryFee = selectedGame === 'Free Fire' ? 20 : 10;

    if (userCoins < entryFee) {
      setErrorMsg('Insufficient Coins! Please recharge your wallet.');
      return;
    }

    // Deduct coins
    setUserCoins(prev => prev - entryFee);

    // Register Match to User Profile
    const newRegistration = {
      matchId: joiningMatch.id,
      title: joiningMatch.title,
      game: selectedGame,
      time: joiningMatch.time,
      map: joiningMatch.map,
      ign: ignInput.trim(),
      roomId: joiningMatch.roomId || '',
      roomPass: joiningMatch.roomPass || ''
    };

    setRegisteredMatches(prev => [...prev, newRegistration]);
    alert(`Successfully registered for ${joiningMatch.title}!`);
    setJoiningMatch(null);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      
      {/* GAME SELECTION TABS: FREE FIRE ON LEFT, BGMI ON RIGHT */}
      <div className="grid grid-cols-2 gap-2 bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
        {/* LEFT: FREE FIRE */}
        <button
          onClick={() => setSelectedGame('Free Fire')}
          className={`py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            selectedGame === 'Free Fire'
              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>⚡</span>
          <span>Free Fire</span>
        </button>

        {/* RIGHT: BGMI */}
        <button
          onClick={() => setSelectedGame('BGMI')}
          className={`py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            selectedGame === 'BGMI'
              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>🔥</span>
          <span>BGMI</span>
        </button>
      </div>

      {/* MATCHES LISTING SECTION */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Available Lobbies ({currentMatches.length})
          </h2>
          <span className="text-[10px] text-yellow-400 font-mono bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
            {selectedGame === 'Free Fire' ? 'Entry: 20 Coins (Squad)' : 'Entry: 10 Coins'}
          </span>
        </div>

        {currentMatches.length === 0 ? (
          <div className="bg-gray-900/60 p-8 rounded-2xl border border-gray-800 text-center space-y-2">
            <span className="text-3xl">⏰</span>
            <p className="text-xs font-bold text-gray-300">No Active Matches Available</p>
            <p className="text-[10px] text-gray-500">All match slots for today have expired or concluded.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMatches.map((match) => {
              const isJoined = registeredMatches.some(m => m.matchId === match.id);
              const isFF = selectedGame === 'Free Fire';

              return (
                <div 
                  key={match.id} 
                  onClick={() => setViewingMatchDetails(match)}
                  className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-3 relative overflow-hidden group hover:border-gray-700 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-xs font-extrabold text-white group-hover:text-yellow-400 transition-colors">
                          {match.title}
                        </h3>
                        {isFF && (
                          <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/40 px-1.5 py-0.5 rounded font-bold">
                            Squad (12 Teams)
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Map: <span className="text-gray-200 font-medium">{match.map}</span> | Tap card for details ℹ️
                      </p>
                    </div>
                    <span className="bg-gray-800 text-yellow-400 text-[10px] font-mono px-2 py-1 rounded-lg border border-gray-700 font-bold">
                      🕒 {match.time}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-800/80">
                    <div className="text-[10px] text-gray-400">
                      Prize Pool: <span className="text-green-400 font-bold">{isFF ? '200 Coins' : '100 Coins'}</span>
                    </div>

                    {isJoined ? (
                      <button 
                        disabled
                        onClick={(e) => e.stopPropagation()}
                        className="bg-green-600/20 border border-green-500/40 text-green-400 font-extrabold text-[11px] px-4 py-1.5 rounded-xl cursor-default"
                      >
                        ✓ Registered
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => handleOpenJoinModal(match, e)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-[11px] px-4 py-1.5 rounded-xl active:scale-95 transition-all shadow-md shadow-yellow-500/10"
                      >
                        Join Match
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PRIZE POOL BREAKDOWN & DETAILS MODAL */}
      {viewingMatchDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl relative">
            
            <button 
              onClick={() => setViewingMatchDetails(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold text-xs bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <span className="text-3xl">🏆</span>
              <h3 className="text-sm font-extrabold text-yellow-400">{viewingMatchDetails.title}</h3>
              <p className="text-[11px] text-gray-400">{selectedGame} • {viewingMatchDetails.map} • {viewingMatchDetails.time}</p>
            </div>

            {/* MATCH OVERVIEW INFO */}
            <div className="grid grid-cols-3 gap-2 bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-center">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase">Entry Fee</span>
                <span className="text-xs font-bold text-yellow-400">
                  {selectedGame === 'Free Fire' ? '20 Coins' : '10 Coins'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 block uppercase">Type</span>
                <span className="text-xs font-bold text-white">
                  {selectedGame === 'Free Fire' ? 'Squad (12)' : 'Solo'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 block uppercase">Total Prize</span>
                <span className="text-xs font-bold text-green-400">
                  {selectedGame === 'Free Fire' ? '200 Coins' : '100 Coins'}
                </span>
              </div>
            </div>

            {/* PRIZE BREAKDOWN LIST */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wide">
                💰 Prize Pool Breakdown
              </h4>
              
              {selectedGame === 'Free Fire' ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-yellow-500/30">
                    <span className="font-bold text-yellow-400">🥇 1st Place (Winner)</span>
                    <span className="font-mono font-extrabold text-green-400">120 Coins</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <span className="font-bold text-gray-300">🥈 2nd Place</span>
                    <span className="font-mono font-extrabold text-green-400">40 Coins</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <span className="font-bold text-gray-300">🥉 3rd Place</span>
                    <span className="font-mono font-extrabold text-green-400">20 Coins</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <span className="font-bold text-gray-300">🎖️ 4th Place</span>
                    <span className="font-mono font-extrabold text-green-400">20 Coins</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-yellow-500/30">
                    <span className="font-bold text-yellow-400">🥇 1st Place</span>
                    <span className="font-mono font-extrabold text-green-400">60 Coins</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <span className="font-bold text-gray-300">🥈 2nd Place</span>
                    <span className="font-mono font-extrabold text-green-400">30 Coins</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <span className="font-bold text-gray-300">🥉 3rd Place</span>
                    <span className="font-mono font-extrabold text-green-400">10 Coins</span>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setViewingMatchDetails(null)}
              className="w-full bg-yellow-500 text-black font-extrabold text-xs py-2.5 rounded-xl active:scale-95 transition-all"
            >
              Close Details
            </button>

          </div>
        </div>
      )}

      {/* JOIN MATCH MODAL */}
      {joiningMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl relative">
            
            <button 
              onClick={() => setJoiningMatch(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold text-xs bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <span className="text-3xl">🎮</span>
              <h3 className="text-sm font-extrabold text-yellow-400">JOIN TOURNAMENT MATCH</h3>
              <p className="text-[11px] text-gray-400">{joiningMatch.title} ({joiningMatch.time})</p>
            </div>

            <form onSubmit={handleConfirmJoin} className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">In-Game Name (IGN)</label>
                <input 
                  type="text" 
                  placeholder="Enter your exact game name..."
                  value={ignInput}
                  onChange={(e) => setIgnInput(e.target.value)}
                  className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs focus:outline-none focus:border-yellow-500 font-medium"
                />
              </div>

              <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 space-y-1">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Entry Fee:</span>
                  <span className="text-yellow-400 font-bold">
                    {selectedGame === 'Free Fire' ? '20 Coins' : '10 Coins'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Your Balance:</span>
                  <span className="text-white font-bold">{userCoins} Coins</span>
                </div>
              </div>

              {errorMsg && (
                <p className="text-red-400 text-[10px] font-bold text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  ⚠️ {errorMsg}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  type="button"
                  onClick={() => setJoiningMatch(null)}
                  className="bg-gray-800 text-gray-300 font-bold text-xs py-2.5 rounded-xl hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs py-2.5 rounded-xl active:scale-95 transition-all"
                >
                  Confirm & Join
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}