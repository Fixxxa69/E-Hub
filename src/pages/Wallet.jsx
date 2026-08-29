import React, { useState } from 'react';

export default function Wallet({ userCoins = 250, setUserCoins }) {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Form States
  const [depositAmount, setDepositAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });

  // Admin Request Lists
  const [depositRequests, setDepositRequests] = useState([
    { id: 101, user: 'Rahul Gamer', amount: 100, utr: 'UTR9876543210', status: 'Pending', time: '10:30 AM' },
    { id: 102, user: 'Amit Esports', amount: 300, utr: 'UTR1234567890', status: 'Pending', time: '11:15 AM' }
  ]);

  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 201, user: 'Viper Squad', amount: 150, upi: 'viper@paytm', mobile: '9876543210', status: 'Pending', time: '09:00 AM' },
    { id: 202, user: 'Dark Knight', amount: 80, upi: 'dark@ybl', mobile: '9123456789', status: 'Pending', time: '09:45 AM' }
  ]);

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositAmount || !utrNumber) {
      setMessage({ type: 'error', text: 'Please enter both Amount and UTR Transaction ID!' });
      return;
    }

    const newReq = {
      id: Date.now(),
      user: 'Current Player',
      amount: Number(depositAmount),
      utr: utrNumber,
      status: 'Pending',
      time: 'Just now'
    };

    setDepositRequests([newReq, ...depositRequests]);
    setDepositAmount('');
    setUtrNumber('');
    setMessage({ type: 'success', text: 'Cash add request submitted to Admin!' });
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);

    if (!amt || amt < 50) {
      setMessage({ type: 'error', text: 'Minimum withdrawal amount is ₹50!' });
      return;
    }

    if (amt > userCoins) {
      setMessage({ type: 'error', text: 'Insufficient Wallet Coins!' });
      return;
    }

    if (!upiId.trim() || !mobileNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter valid UPI ID & Mobile Number!' });
      return;
    }

    if (mobileNumber.trim().length !== 10) {
      setMessage({ type: 'error', text: 'Mobile Number must be 10 digits!' });
      return;
    }

    const newReq = {
      id: Date.now(),
      user: 'Current Player',
      amount: amt,
      upi: upiId,
      mobile: mobileNumber,
      status: 'Pending',
      time: 'Just now'
    };

    setWithdrawRequests([newReq, ...withdrawRequests]);
    if (setUserCoins) setUserCoins(userCoins - amt);
    setWithdrawAmount('');
    setUpiId('');
    setMobileNumber('');
    setMessage({ type: 'success', text: 'Withdrawal request submitted to Admin!' });
  };

  const handleVerifyAdminPass = () => {
    if (adminPasscode === '1234') {
      setIsAdminAuthenticated(true);
      setMessage({ type: 'success', text: 'Admin Access Granted!' });
    } else {
      setMessage({ type: 'error', text: 'Invalid Admin PIN!' });
    }
  };

  const approveDeposit = (id, amount) => {
    setDepositRequests(depositRequests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    if (setUserCoins) setUserCoins(prev => prev + amount);
  };

  const rejectDeposit = (id) => {
    setDepositRequests(depositRequests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  const approveWithdraw = (id) => {
    setWithdrawRequests(withdrawRequests.map(r => r.id === id ? { ...r, status: 'Completed' } : r));
  };

  const rejectWithdraw = (id, amount) => {
    setWithdrawRequests(withdrawRequests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    if (setUserCoins) setUserCoins(prev => prev + amount);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-2xl border border-yellow-500/40 shadow-xl flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold">Total Wallet Balance</p>
          <h1 className="text-3xl font-extrabold text-yellow-400 mt-1">₹{userCoins}</h1>
        </div>
        <button 
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/30 font-bold"
        >
          {showAdminPanel ? 'User View' : '🔑 Admin View'}
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded-xl text-xs flex justify-between items-center ${
          message.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-green-500/20 text-green-300 border border-green-500/40'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* ADMIN PANEL DASHBOARD SEPARATE SECTION */}
      {showAdminPanel ? (
        <div className="bg-gray-900 p-4 rounded-2xl border-2 border-yellow-500 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-sm font-bold text-yellow-400">🛡️ Admin Verification Hub</h2>
          </div>

          {!isAdminAuthenticated ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-300">Enter Admin Passcode to view private transactions:</p>
              <input 
                type="password"
                placeholder="Enter Admin PIN (Default: 1234)"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full p-2.5 bg-gray-950 text-white rounded-lg text-xs border border-gray-700 outline-none focus:border-yellow-400"
              />
              <button 
                onClick={handleVerifyAdminPass}
                className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg text-xs"
              >
                UNLOCK ADMIN PANEL
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* SECTION 1: DEPOSIT REQUESTS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-green-400 flex justify-between">
                  <span>📥 Cash Add Requests (Deposit)</span>
                  <span>{depositRequests.filter(r => r.status === 'Pending').length} Pending</span>
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {depositRequests.map((req) => (
                    <div key={req.id} className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-gray-200">
                        <span>{req.user}</span>
                        <span className="text-green-400">+₹{req.amount}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">UTR: {req.utr} | {req.time}</p>
                      
                      {req.status === 'Pending' ? (
                        <div className="flex space-x-2 pt-1">
                          <button 
                            onClick={() => approveDeposit(req.id, req.amount)}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-1 rounded text-[10px]"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => rejectDeposit(req.id)}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-1 rounded text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${req.status === 'Approved' ? 'text-green-400' : 'text-red-400'}`}>
                          Status: {req.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: WITHDRAWAL REQUESTS */}
              <div className="space-y-3 border-t border-gray-800 pt-3">
                <h3 className="text-xs font-bold text-amber-400 flex justify-between">
                  <span>📤 Withdrawal Requests</span>
                  <span>{withdrawRequests.filter(r => r.status === 'Pending').length} Pending</span>
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {withdrawRequests.map((req) => (
                    <div key={req.id} className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-gray-200">
                        <span>{req.user}</span>
                        <span className="text-amber-400">₹{req.amount}</span>
                      </div>
                      <p className="text-[10px] text-yellow-300 font-mono">UPI ID: {req.upi}</p>
                      <p className="text-[10px] text-gray-400 font-mono">Mobile: {req.mobile} | {req.time}</p>
                      
                      {req.status === 'Pending' ? (
                        <div className="flex space-x-2 pt-1">
                          <button 
                            onClick={() => approveWithdraw(req.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 rounded text-[10px]"
                          >
                            Mark Paid
                          </button>
                          <button 
                            onClick={() => rejectWithdraw(req.id, req.amount)}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-1 rounded text-[10px]"
                          >
                            Reject & Refund
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${req.status === 'Completed' ? 'text-green-400' : 'text-red-400'}`}>
                          Status: {req.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      ) : (
        /* REGULAR USER VIEW */
        <div className="space-y-4">
          {/* USER SECTION: ADD CASH FORM */}
          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-3">
            <h2 className="text-xs font-bold text-green-400 uppercase tracking-wider">➕ Add Cash (Deposit)</h2>
            <form onSubmit={handleDepositSubmit} className="space-y-2.5">
              <input 
                type="number"
                placeholder="Enter Amount to Add (₹)..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full p-2.5 bg-gray-950 rounded-xl text-white text-xs border border-gray-700 outline-none focus:border-green-400"
              />
              <input 
                type="text"
                placeholder="Enter UPI UTR / Ref Transaction ID..."
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full p-2.5 bg-gray-950 rounded-xl text-white text-xs border border-gray-700 outline-none focus:border-green-400"
              />
              <button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                REQUEST CASH ADDITION
              </button>
            </form>
          </div>

          {/* USER SECTION: WITHDRAWAL FORM */}
          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">💸 Withdraw Money</h2>
              <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">Min ₹50</span>
            </div>
            
            <form onSubmit={handleWithdrawSubmit} className="space-y-2.5">
              <input 
                type="number"
                placeholder="Enter Withdrawal Amount (Min ₹50)..."
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-2.5 bg-gray-950 rounded-xl text-white text-xs border border-gray-700 outline-none focus:border-yellow-400"
              />
              <input 
                type="text"
                placeholder="Enter your UPI ID (e.g., name@upi)..."
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2.5 bg-gray-950 rounded-xl text-white text-xs border border-gray-700 outline-none focus:border-yellow-400"
              />
              <input 
                type="tel"
                placeholder="Enter 10-digit Mobile Number..."
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full p-2.5 bg-gray-950 rounded-xl text-white text-xs border border-gray-700 outline-none focus:border-yellow-400"
              />
              <button 
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                SUBMIT WITHDRAWAL REQUEST
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}