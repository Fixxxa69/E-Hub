import React, { useState, useEffect } from 'react';
import Home from './pages/home';
import Leaderboard from './pages/leaderboard';
import Profile from './pages/profile';
import Wallet from './pages/wallet';
import Admin from './pages/Admin'; // FIXED: Fixed Casing Error (Admin.jsx)

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(250);
  
  // Real-time Registered Matches Array for User Profile
  const [registeredMatches, setRegisteredMatches] = useState([]);

  // Dedicated Room ID & Pass Sharing Modal State
  const [showRoomAdminModal, setShowRoomAdminModal] = useState(false);
  const [roomAdminId, setRoomAdminId] = useState('');
  const [roomAdminPass, setRoomAdminPass] = useState('');
  const [isRoomAdminLoggedIn, setIsRoomAdminLoggedIn] = useState(false);

  const [selectedGame, setSelectedGame] = useState('BGMI');
  const [now, setNow] = useState(new Date());

  // Real-time Live Clock Updater (Updates every 5 seconds)
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setNow(new Date());
    }, 5000);
    return () => clearInterval(clockTimer);
  }, []);

  // Base 10 Matches (1:00 PM to 10:00 PM) - Initial Room ID and Pass are EMPTY string
  const baseSlotHours = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22]; // 13 = 1 PM, 22 = 10 PM
  
  const generate10Matches = (gameName) => {
    return baseSlotHours.map((hour, index) => {
      const displayHour = hour > 12 ? hour - 12 : hour;
      const timeStr = `${displayHour < 10 ? '0' + displayHour : displayHour}:00 PM`;
      return {
        id: `${gameName.toLowerCase().replace(/\s+/g, '')}_slot_${hour}`,
        matchNumber: index + 1,
        slotHour: hour,
        title: `${gameName} Match #${index + 1}`,
        time: `${timeStr} Today`,
        map: gameName === 'BGMI' ? 'Erangel' : 'Bermuda',
        roomId: '',   // STRICTLY EMPTY AT FIRST
        roomPass: ''  // STRICTLY EMPTY AT FIRST
      };
    });
  };

  const [bgmiMatches, setBgmiMatches] = useState(() => generate10Matches('BGMI'));
  const [ffMatches, setFfMatches] = useState(() => generate10Matches('Free Fire'));

  // Filter Active Matches Based on Current System Time (Closes 10 mins before slot)
  const getActiveMatches = (matchesList) => {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return matchesList.filter(m => {
      // If the current hour is already past the match slot hour, hide it
      if (currentHour > m.slotHour) return false;

      // If current hour is same as slot hour, match has started, hide it
      if (currentHour === m.slotHour) return false;

      // If it's 10 minutes before the match slot (e.g., 12:50 PM for 1:00 PM slot), hide it
      if (currentHour === m.slotHour - 1 && currentMinute >= 50) return false;

      return true;
    });
  };

  const activeBgmiMatches = getActiveMatches(bgmiMatches);
  const activeFfMatches = getActiveMatches(ffMatches);
  const currentActiveList = selectedGame === 'BGMI' ? activeBgmiMatches : activeFfMatches;

  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [inputRoomPass, setInputRoomPass] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentActiveList.length > 0) {
      const exists = currentActiveList.find(m => m.id === selectedMatchId);
      const matchToSelect = exists || currentActiveList[0];
      setSelectedMatchId(matchToSelect.id);
      setInputRoomId(matchToSelect.roomId || '');
      setInputRoomPass(matchToSelect.roomPass || '');
    } else {
      setSelectedMatchId('');
      setInputRoomId('');
      setInputRoomPass('');
    }
  }, [selectedGame, now]);

  const handleMatchSelect = (matchId) => {
    setSelectedMatchId(matchId);
    const target = currentActiveList.find(m => m.id === matchId);
    if (target) {
      setInputRoomId(target.roomId || '');
      setInputRoomPass(target.roomPass || '');
    }
  };

  const handleRoomAdminLogin = (e) => {
    e.preventDefault();
    if (roomAdminId === 'admin' && roomAdminPass === 'admin123') {
      setIsRoomAdminLoggedIn(true);
    } else {
      alert('गलत Admin ID या Password!');
    }
  };

  // Publish Room Credentials & Dynamically Update User Profile
  const handlePublishRoomDetails = () => {
    if (!inputRoomId.trim() || !inputRoomPass.trim()) {
      alert('कृपया Room ID और Password दोनों सही से भरें!');
      return;
    }

    const updateMatchList = (prev) => 
      prev.map(m => m.id === selectedMatchId ? { ...m, roomId: inputRoomId.trim(), roomPass: inputRoomPass.trim() } : m);
    
    if (selectedGame === 'BGMI') {
      setBgmiMatches(updateMatchList);
    } else {
      setFfMatches(updateMatchList);
    }

    // Instantly reflect in User's Registered Profile Matches
    setRegisteredMatches(prev => prev.map(reg => {
      if (reg.matchId === selectedMatchId) {
        return { ...reg, roomId: inputRoomId.trim(), roomPass: inputRoomPass.trim() };
      }
      return reg;
    }));

    alert(`सफलतापूर्वक Room ID & Password पब्लिश हो गया!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Loading Esports Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      
      {/* Fixed Top Header */}
      <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 p-3 flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowRoomAdminModal(true)}
            className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center justify-center text-base hover:bg-yellow-500/30 active:scale-95 transition-all"
            title="Room ID & Pass Share Panel"
          >
            🎮
          </button>
          <h1 className="font-extrabold text-xs text-yellow-400 tracking-wide cursor-pointer" onClick={() => setActiveTab('home')}>
            ESPORTS HUB
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center space-x-1 ${
              activeTab === 'admin' 
                ? 'bg-yellow-500 text-black border-yellow-400' 
                : 'bg-gray-800 text-yellow-400 border-yellow-500/30'
            }`}
          >
            <span>🔑</span>
            <span>Admin</span>
          </button>

          <button 
            onClick={() => setActiveTab('wallet')}
            className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded-full border border-yellow-500/40 transition-all"
          >
            <span className="text-xs font-bold text-yellow-400">🪙 {userCoins}</span>
          </button>
        </div>
      </header>

      {/* ROOM ID & PASS ADMIN MODAL */}
      {showRoomAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setShowRoomAdminModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold text-sm bg-gray-800 w-7 h-7 rounded-full"
            >
              ✕
            </button>

            {!isRoomAdminLoggedIn ? (
              <div className="space-y-3 text-center py-2">
                <span className="text-3xl">🎮🔑</span>
                <h2 className="text-sm font-extrabold text-yellow-400">ROOM ID & PASS ADMIN</h2>
                <p className="text-[11px] text-gray-400">Players को Room Details भेजने के लिए Login करें</p>

                <form onSubmit={handleRoomAdminLogin} className="space-y-2 pt-2">
                  <input 
                    type="text" 
                    placeholder="Admin ID (admin)" 
                    value={roomAdminId}
                    onChange={(e) => setRoomAdminId(e.target.value)}
                    className="w-full bg-gray-950 p-2.5 rounded-xl border border-gray-700 text-xs text-white"
                  />
                  <input 
                    type="password" 
                    placeholder="Password (admin123)" 
                    value={roomAdminPass}
                    onChange={(e) => setRoomAdminPass(e.target.value)}
                    className="w-full bg-gray-950 p-2.5 rounded-xl border border-gray-700 text-xs text-white"
                  />
                  <button type="submit" className="w-full bg-yellow-500 text-black font-extrabold py-2.5 rounded-xl text-xs">
                    LOGIN TO SHARE ROOM ID
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-b border-gray-800 pb-2">
                  <h2 className="text-xs font-extrabold text-yellow-400">📡 Live Matches Control</h2>
                  <p className="text-[10px] text-gray-400">Select Active Category & Match Slot</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
                  <button 
                    onClick={() => setSelectedGame('BGMI')}
                    className={`py-1.5 text-xs font-extrabold rounded-lg transition-all ${selectedGame === 'BGMI' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}
                  >
                    🔥 BGMI
                  </button>
                  <button 
                    onClick={() => setSelectedGame('Free Fire')}
                    className={`py-1.5 text-xs font-extrabold rounded-lg transition-all ${selectedGame === 'Free Fire' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}
                  >
                    ⚡ Free Fire (Bermuda)
                  </button>
                </div>

                {currentActiveList.length === 0 ? (
                  <p className="text-center text-xs text-red-400 font-bold py-4">आज के सभी मैचेस खत्म हो चुके हैं!</p>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-300 font-bold block">Select Active Match Slot:</label>
                    <select 
                      value={selectedMatchId} 
                      onChange={(e) => handleMatchSelect(e.target.value)}
                      className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs font-bold"
                    >
                      {currentActiveList.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.title} - {m.time} {m.roomId ? '✅ Published' : '⏳ Pending'}
                        </option>
                      ))}
                    </select>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Room ID</label>
                      <input 
                        type="text" 
                        placeholder="Enter Room ID" 
                        value={inputRoomId}
                        onChange={(e) => setInputRoomId(e.target.value)}
                        className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Room Password</label>
                      <input 
                        type="text" 
                        placeholder="Enter Room Password" 
                        value={inputRoomPass}
                        onChange={(e) => setInputRoomPass(e.target.value)}
                        className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs font-mono"
                      />
                    </div>

                    <button 
                      onClick={handlePublishRoomDetails}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl text-xs mt-2 active:scale-95 transition-all"
                    >
                      🚀 Share to Player Profiles
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Screen Pages */}
      <main className="max-w-md mx-auto">
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
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'wallet' && <Wallet userCoins={userCoins} setUserCoins={setUserCoins} />}
        {activeTab === 'profile' && (
          <Profile 
            userCoins={userCoins} 
            registeredMatches={registeredMatches} 
          />
        )}
        {activeTab === 'admin' && <Admin userCoins={userCoins} setUserCoins={setUserCoins} />}
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 max-w-md mx-auto grid grid-cols-4 p-2 z-40 text-center">
        <button onClick={() => setActiveTab('home')} className={`py-1 flex flex-col items-center text-[11px] font-bold ${activeTab === 'home' ? 'text-yellow-400' : 'text-gray-400'}`}>
          <span>🏠</span><span>Home</span>
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`py-1 flex flex-col items-center text-[11px] font-bold ${activeTab === 'leaderboard' ? 'text-yellow-400' : 'text-gray-400'}`}>
          <span>🏆</span><span>Leaderboard</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`py-1 flex flex-col items-center text-[11px] font-bold ${activeTab === 'wallet' ? 'text-yellow-400' : 'text-gray-400'}`}>
          <span>👛</span><span>Wallet</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`py-1 flex flex-col items-center text-[11px] font-bold ${activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-400'}`}>
          <span>👤</span><span>Profile</span>
        </button>
      </nav>
    </div>
  );
}