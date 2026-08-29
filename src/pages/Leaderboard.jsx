import React from 'react';

export default function Leaderboard() {
  const topPlayers = [
    { rank: 1, name: 'Alpha_King', kills: 142, earnings: '₹3,400', badge: '🥇' },
    { rank: 2, name: 'Viper_FF', kills: 128, earnings: '₹2,850', badge: '🥈' },
    { rank: 3, name: 'Shadow_Ninja', kills: 115, earnings: '₹2,100', badge: '🥉' },
    { rank: 4, name: 'Headshot_Pro', kills: 98, earnings: '₹1,750', badge: '4' },
    { rank: 5, name: 'Dark_Knight', kills: 84, earnings: '₹1,200', badge: '5' },
    { rank: 6, name: 'RedBull_Esports', kills: 79, earnings: '₹950', badge: '6' }
  ];

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="bg-gradient-to-r from-amber-600 to-yellow-500 p-4 rounded-2xl text-black font-extrabold text-center space-y-1 shadow-lg">
        <h2 className="text-lg">🏆 Weekly Esports Leaderboard</h2>
        <p className="text-xs opacity-90">Top players win extra tournament entry passes every Sunday!</p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-950 p-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center border-b border-gray-800">
          <span>Rank</span>
          <span>Player</span>
          <span>Kills</span>
          <span>Winnings</span>
        </div>

        <div className="divide-y divide-gray-800/60">
          {topPlayers.map((player) => (
            <div key={player.rank} className="grid grid-cols-4 p-3.5 text-xs items-center text-center font-semibold">
              <span className="text-base">{player.badge}</span>
              <span className="text-white font-bold truncate text-left">{player.name}</span>
              <span className="text-yellow-400">{player.kills} 🎯</span>
              <span className="text-green-400 font-bold">{player.earnings}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}