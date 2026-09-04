import React, { useState } from 'react';

export default function Admin({ matches = [], setMatches, onClose }) {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPassInput, setRoomPassInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePublishCredentials = (e) => {
    e.preventDefault();
    if (!selectedMatchId || !roomIdInput.trim() || !roomPassInput.trim()) {
      alert('Please select a match and enter both Room ID and Password.');
      return;
    }

    setMatches(prevMatches => 
      prevMatches.map(m => 
        m.id === selectedMatchId 
          ? { ...m, roomId: roomIdInput.trim(), roomPass: roomPassInput.trim() } 
          : m
      )
    );

    setSuccessMsg('Room ID & Password published successfully to player profiles!');
    setRoomIdInput('');
    setRoomPassInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl relative">
        
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold text-xs bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center"
        >
          ✕
        </button>

        <div className="text-center space-y-1">
          <span className="text-2xl">⚙️</span>
          <h3 className="text-sm font-extrabold text-yellow-400">ADMIN CONTROL PANEL</h3>
          <p className="text-[10px] text-gray-400">Publish Room Credentials to Registered Players</p>
        </div>

        {successMsg && (
          <p className="text-green-400 text-[10px] font-bold text-center bg-green-500/10 p-2 rounded-lg border border-green-500/20">
            ✅ {successMsg}
          </p>
        )}

        <form onSubmit={handlePublishCredentials} className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">Select Active Match</label>
            <select 
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs focus:outline-none focus:border-yellow-500"
            >
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.game}] {m.title} ({m.time})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">Room ID</label>
            <input 
              type="text" 
              placeholder="Enter Room ID..."
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs font-mono focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">Room Password</label>
            <input 
              type="text" 
              placeholder="Enter Password..."
              value={roomPassInput}
              onChange={(e) => setRoomPassInput(e.target.value)}
              className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs font-mono focus:outline-none focus:border-yellow-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
          >
            Publish Credentials
          </button>
        </form>

      </div>
    </div>
  );
}