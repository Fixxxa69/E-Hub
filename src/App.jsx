import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userCoins, setUserCoins] = useState(0); // Starts at 0 real coins
  const [registeredMatches, setRegisteredMatches] = useState([]); // Real user registered matches
  const [leaderboardData, setLeaderboardData] = useState([]); // Empty until real matches complete & points added
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Dynamic scheduled matches base template (No dummy room ID/Pass)
  const [matches, setMatches] = useState([
    { id: 'ff-1', game: 'Free Fire', title: 'FF Squad Battle #1', time: '1:00 PM', slotHour: 13, map: 'Bermuda', roomId: '', roomPass: '' },
    { id: 'ff-2', game: 'Free Fire', title: 'FF Squad Battle #2', time: '2:00 PM', slotHour: 14, map: 'Purgatory', roomId: '', roomPass: '' },
    { id: 'ff-3', game: 'Free Fire', title: 'FF Squad Battle #3', time: '3:00 PM', slotHour: 15, map: 'Kalahari', roomId: '', roomPass: '' },
    { id: 'bgmi-1', game: 'BGMI', title: 'BGMI Classic #1', time: '1:00 PM', slotHour: 13, map: 'Erangel', roomId: '', roomPass: '' },
    { id: 'bgmi-2', game: 'BGMI', title: 'BGMI Classic #2', time: '2:00 PM', slotHour: 14, map: 'Miramar', roomId: '', roomPass: '' },
    { id: 'bgmi-3', game: 'BGMI', title: 'BGMI Classic #3', time: '3:00 PM', slotHour: 15, map: 'Sanhok', roomId: '', roomPass: '' },
  ]);

  // Clock state for real-time match expiry
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter out expired matches dynamically
  const activeBgmiMatches = matches.filter(m => m.game === 'BGMI' && m.slotHour >= currentHour);
  const activeFfMatches = matches.filter(m => m.game === 'Free Fire' && m.slotHour >= currentHour);

  return (
    <div className="bg-gray-950 text-white min-h-screen pb-20 font-sans max-w-md mx-auto border-x border-gray-800 relative">
      
      {/* TOP HEADER */}
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-base font-black text-yellow-500 tracking-wider">ESPORTS HUB</h1>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-800 px-3 py-1 rounded-xl border border-gray-700 flex items-center space-x-1">
            <span className="text-yellow-400 text-xs">🪙</span>
            <span className="text-xs font-bold">{userCoins}</span>
          </div>
          <button 
            onClick={() => setShowAdminModal(true)}
            className="bg-gray-800 p-1.5 rounded-xl border border-gray-700 text-xs hover:bg-gray-700"
            title="Admin Panel"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'home' && (
        <Home 
          userCoins={userCoins}
          setUserCoins={setUserCoins}
          activeBgmiMatches={activeBgmiMatches}
          activeFfMatches={activeFfMatches}
          registeredMatches={registeredMatches}
          setRegisteredMatches={setRegisteredMatches}
        />
      )}

      {activeTab === 'profile' && (
        <Profile 
          registeredMatches={registeredMatches} 
          userCoins={userCoins}
        />
      )}

      {activeTab === 'leaderboard' && (
        <Leaderboard leaderboardData={leaderboardData} />
      )}

      {activeTab === 'wallet' && (
        <Wallet userCoins={userCoins} setUserCoins={setUserCoins} />
      )}

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <Admin 
          matches={matches} 
          setMatches={setMatches} 
          onClose={() => setShowAdminModal(false)} 
        />
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-900/95 backdrop-blur-md border-t border-gray-800 grid grid-cols-4 py-2 text-center z-40">
        <button onClick={() => setActiveTab('home')} className={`text-xs font-bold ${activeTab === 'home' ? 'text-yellow-400' : 'text-gray-400'}`}>
          🏠<br/>Home
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`text-xs font-bold ${activeTab === 'leaderboard' ? 'text-yellow-400' : 'text-gray-400'}`}>
          🏆<br/>Ranks
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`text-xs font-bold ${activeTab === 'wallet' ? 'text-yellow-400' : 'text-gray-400'}`}>
          💳<br/>Wallet
        </button>
        <button onClick={() => setActiveTab('profile')} className={`text-xs font-bold ${activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-400'}`}>
          👤<br/>Profile
        </button>
      </div>

    </div>
  );
}