import React from 'react';

export default function Leaderboard({ leaderboardData = [] }) {
  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-sm font-extrabold text-yellow-400 tracking-wider uppercase">Tournament Leaderboard</h2>
        <p className="text-[10px] text-gray-400">Official player rankings based on real match victories</p>
      </div>

      {leaderboardData.length === 0 ? (
        <div className="bg-gray-900/60 p-8 rounded-2xl border border-gray-800 text-center space-y-2">
          <span className="text-3xl">🏆</span>
          <p className="text-xs font-bold text-gray-300">No Ranked Players Yet</p>
          <p className="text-[10px] text-gray-500">Rankings will update live as registered players complete official tournament matches.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboardData.map((player, index) => (
            <div 
              key={index}
              className="bg-gray-900 p-3 rounded-xl border border-gray-800 flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-yellow-400 w-5">#{index + 1}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{player.ign}</h4>
                  <p className="text-[10px] text-gray-400">{player.game}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-green-400">{player.points} Points</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}