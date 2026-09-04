import React from 'react';

export default function Profile({ registeredMatches = [], userCoins = 0 }) {
  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      
      {/* USER PROFILE INFO */}
      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 font-extrabold text-lg rounded-full flex items-center justify-center border border-yellow-500/40">
            🎮
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Player Profile</h3>
            <p className="text-[11px] text-gray-400">Total Registered Matches: {registeredMatches.length}</p>
          </div>
        </div>
      </div>

      {/* MY REGISTERED MATCHES */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          My Tournaments ({registeredMatches.length})
        </h3>

        {registeredMatches.length === 0 ? (
          <div className="bg-gray-900/60 p-8 rounded-2xl border border-gray-800 text-center space-y-2">
            <span className="text-3xl">📌</span>
            <p className="text-xs font-bold text-gray-300">No Registrations Found</p>
            <p className="text-[10px] text-gray-500">You haven't joined any tournament yet. Browse matches from Home tab to enter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {registeredMatches.map((match, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">{match.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      IGN: <span className="text-yellow-400 font-bold">{match.ign}</span> | Map: {match.map}
                    </p>
                  </div>
                  <span className="bg-gray-800 text-yellow-400 text-[10px] font-mono px-2 py-1 rounded-lg border border-gray-700 font-bold">
                    🕒 {match.time}
                  </span>
                </div>

                {/* DYNAMIC ROOM ID & PASS FROM ADMIN */}
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Room ID:</span>
                    <span className="font-mono font-bold text-white">
                      {match.roomId ? match.roomId : 'Waiting for Admin...'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Password:</span>
                    <span className="font-mono font-bold text-white">
                      {match.roomPass ? match.roomPass : 'Waiting for Admin...'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}