import React, { useState, useEffect } from 'react';

export default function Admin({ userCoins, setUserCoins }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState('queries'); // 'queries' or 'transactions'
  const [loginError, setLoginError] = useState('');

  // Real-Time Queries State
  const [queries, setQueries] = useState([
    {
      id: 1,
      userName: "Rahul Gamer",
      phone: "+91 9876543210",
      message: "Bhai mera withdrawal pending dikha raha hai, please check karo.",
      time: "10:30 AM",
      status: "Pending"
    },
    {
      id: 2,
      userName: "Amit Esports",
      phone: "+91 9123456789",
      message: "Room ID and Password kab milega match ka?",
      time: "11:15 AM",
      status: "Pending"
    }
  ]);

  const [newQueryNotification, setNewQueryNotification] = useState(null);

  // Simulate Real-time incoming queries every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const mockUsers = ["Viper Gaming", "Soul Mortal Fan", "Pro BGMI Player", "RDX Esports"];
      const mockMsgs = [
        "Bhai cash deposit approve kar do jaldi!",
        "Room password nahi mila abhi tak.",
        "Withdrawal request accept kar lo please.",
        "Match 8:00 PM wala start kab hoga?"
      ];

      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomMsg = mockMsgs[Math.floor(Math.random() * mockMsgs.length)];
      
      const newQuery = {
        id: Date.now(),
        userName: randomUser,
        phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
        message: randomMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "Pending"
      };

      setQueries(prev => [newQuery, ...prev]);
      setNewQueryNotification(`🔔 New Query from ${randomUser}`);

      // Hide popup alert after 3.5 seconds
      setTimeout(() => setNewQueryNotification(null), 3500);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Payments Data
  const [depositRequests, setDepositRequests] = useState([
    { id: 101, user: 'Rahul Gamer', amount: 100, utr: 'UTR9876543210', status: 'Pending', time: '10:30 AM' },
    { id: 102, user: 'Amit Esports', amount: 300, utr: 'UTR1234567890', status: 'Pending', time: '11:15 AM' }
  ]);

  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 201, user: 'Viper Squad', amount: 150, upi: 'viper@paytm', mobile: '9876543210', status: 'Pending', time: '09:00 AM' }
  ]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminId.trim() === 'admin' && adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('गलत Admin ID या Password! (id: admin, pass: admin123)');
    }
  };

  const markQueryResolved = (id) => {
    setQueries(queries.map(q => q.id === id ? { ...q, status: 'Resolved' } : q));
  };

  const approveDeposit = (id, amount) => {
    setDepositRequests(depositRequests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    if (setUserCoins) setUserCoins(prev => prev + amount);
  };

  const pendingQueryCount = queries.filter(q => q.status === 'Pending').length;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      
      {/* Real-time Toast Pop-up Notification */}
      {newQueryNotification && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-black text-xs font-black px-4 py-2 rounded-full shadow-2xl border-2 border-yellow-300 animate-bounce flex items-center space-x-1">
          <span>⚡</span>
          <span>{newQueryNotification}</span>
        </div>
      )}

      {!isAdminAuthenticated ? (
        <div className="bg-gray-900 p-6 rounded-2xl border-2 border-yellow-500/60 shadow-2xl space-y-4 text-center my-8">
          <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/40 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔐
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-yellow-400">ADMIN CONTROL LOGIN</h1>
            <p className="text-xs text-gray-400 mt-1">Queries & Payments Admin Login</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-3 pt-2">
            <input 
              type="text"
              placeholder="Admin ID (admin)"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full p-3 bg-gray-950 text-white rounded-xl text-xs border border-gray-700 outline-none focus:border-yellow-400 font-semibold"
            />
            <input 
              type="password"
              placeholder="Password (admin123)"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-3 bg-gray-950 text-white rounded-xl text-xs border border-gray-700 outline-none focus:border-yellow-400 font-semibold"
            />
            {loginError && <p className="text-red-400 text-xs font-semibold">{loginError}</p>}
            
            <button 
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-lg active:scale-95"
            >
              LOGIN TO ADMIN DASHBOARD
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="bg-gray-900 p-4 rounded-2xl border border-yellow-500/40 flex justify-between items-center shadow-lg">
            <div>
              <h1 className="text-sm font-extrabold text-yellow-400">🛡️ Main Admin Dashboard</h1>
              <p className="text-[10px] text-gray-400">Real-Time Support & Finance</p>
            </div>
            <button 
              onClick={() => setIsAdminAuthenticated(false)}
              className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30 font-bold active:scale-95"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-gray-900 p-1.5 rounded-xl border border-gray-800">
            <button 
              onClick={() => setActiveTab('queries')}
              className={`py-2 rounded-lg text-xs font-bold transition-all relative ${
                activeTab === 'queries' ? 'bg-yellow-500 text-black shadow' : 'text-gray-400'
              }`}
            >
              💬 Queries 
              {pendingQueryCount > 0 && (
                <span className="ml-1.5 bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                  {pendingQueryCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'transactions' ? 'bg-yellow-500 text-black shadow' : 'text-gray-400'
              }`}
            >
              💸 Payments
            </button>
          </div>

          {/* TAB 1: REAL-TIME SUPPORT QUERIES */}
          {activeTab === 'queries' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Live Support Queries</h2>
                <span className="text-[10px] text-green-400 font-mono font-bold animate-pulse">🔴 Live Syncing</span>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
                {queries.map((q) => (
                  <div key={q.id} className="bg-gray-900 p-3.5 rounded-2xl border border-gray-800 space-y-2 relative">
                    <div className="flex justify-between items-center border-b border-gray-800/80 pb-1.5">
                      <div>
                        <span className="text-xs font-bold text-white block">{q.userName}</span>
                        <span className="text-[10px] text-yellow-400 font-mono">{q.phone}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{q.time}</span>
                    </div>

                    <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-300 italic">"{q.message}"</p>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className={`text-[10px] font-bold ${q.status === 'Pending' ? 'text-amber-400' : 'text-green-400'}`}>
                        Status: {q.status}
                      </span>
                      {q.status === 'Pending' && (
                        <button 
                          onClick={() => markQueryResolved(q.id)}
                          className="bg-green-600 hover:bg-green-500 text-white font-bold px-3 py-1 rounded-lg text-[10px]"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-green-400">📥 Cash Add Requests</h3>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {depositRequests.map((req) => (
                    <div key={req.id} className="bg-gray-900 p-3 rounded-xl border border-gray-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-200">{req.user}</span>
                        <span className="text-green-400">+₹{req.amount}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">UTR: {req.utr} | {req.time}</p>
                      {req.status === 'Pending' ? (
                        <button onClick={() => approveDeposit(req.id, req.amount)} className="w-full bg-green-600 text-white font-bold py-1 rounded text-[10px] mt-1">
                          Approve Payment
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-green-400">Status: {req.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}