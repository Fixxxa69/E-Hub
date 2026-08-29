import React from 'react';

export default function Profile({ userCoins, registeredMatches = [] }) {
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      
      {/* Profile Header */}
      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex items-center space-x-3">
        <div className="w-14 h-14 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center text-2xl">
          🎮
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-white">Player One</h2>
          <p className="text-[10px] text-yellow-400 font-mono">ID: #889021</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-300 border border-gray-700 font-bold">
              🪙 Coins: {userCoins}
            </span>
          </div>
        </div>
      </div>

      {/* Registered Matches History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
          <span>🎯 Registered Matches ({registeredMatches.length})</span>
          <span className="text-[9px] text-green-400 font-mono">🔴 Live</span>
        </h3>

        {registeredMatches.length === 0 ? (
          <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 text-center space-y-1">
            <p className="text-xs text-gray-400 font-bold">आपने अभी तक कोई मैच जॉइन नहीं किया है!</p>
            <p className="text-[10px] text-gray-500">Home पर जाकर रजिस्टर करें।</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {registeredMatches.map((match, idx) => {
              // STRICT CHECK: Only display if Admin explicitly set a non-empty string
              const hasRoomId = match.roomId && String(match.roomId).trim() !== '';
              const hasRoomPass = match.roomPass && String(match.roomPass).trim() !== '';

              return (
                <div key={idx} className="bg-gray-900 p-3.5 rounded-2xl border border-gray-800 space-y-2.5">
                  <div className="flex justify-between items-start border-b border-gray-800 pb-2">
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{match.title || "Tournament Match"}</h4>
                      <p className="text-[10px] text-gray-400">
                        Player IGN: <span className="text-yellow-400 font-bold">{match.ign || "Solo"}</span> | Time: <span className="text-gray-300 font-mono">{match.time}</span>
                      </p>
                    </div>
                    <span className="bg-green-500/10 text-green-400 text-[9px] font-extrabold px-2 py-0.5 rounded border border-green-500/30">
                      Confirmed
                    </span>
                  </div>

                  {/* ROOM CREDENTIALS CONTAINER */}
                  <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      
                      {/* ROOM ID */}
                      <div className="bg-gray-900 p-2 rounded-lg border border-gray-800">
                        <span className="text-gray-400 text-[9px] font-bold block mb-0.5">ROOM ID</span>
                        {hasRoomId ? (
                          <span className="text-yellow-400 font-mono font-extrabold text-xs tracking-wider">
                            {match.roomId}
                          </span>
                        ) : (
                          <span className="text-amber-400 text-[10px] font-bold flex items-center space-x-1">
                            <span className="animate-spin text-[10px]">⏳</span>
                            <span>Waiting...</span>
                          </span>
                        )}
                      </div>

                      {/* ROOM PASSWORD */}
                      <div className="bg-gray-900 p-2 rounded-lg border border-gray-800">
                        <span className="text-gray-400 text-[9px] font-bold block mb-0.5">PASSWORD</span>
                        {hasRoomPass ? (
                          <span className="text-yellow-400 font-mono font-extrabold text-xs tracking-wider">
                            {match.roomPass}
                          </span>
                        ) : (
                          <span className="text-amber-400 text-[10px] font-bold flex items-center space-x-1">
                            <span className="animate-spin text-[10px]">⏳</span>
                            <span>Waiting...</span>
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}