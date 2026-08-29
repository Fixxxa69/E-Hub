import React, { useState } from 'react';

export default function Wallet({ userCoins, setUserCoins }) {
  const [amountInput, setAmountInput] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!amountInput || Number(amountInput) <= 0) {
      setErrorMsg('Please enter a valid amount to add.');
      return;
    }
    setErrorMsg('');
    setShowQrModal(true);
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!utrInput.trim() || utrInput.length < 6) {
      setErrorMsg('Please enter a valid 12-digit UTR/Transaction ID.');
      return;
    }

    // Submit payment request for admin verification
    setErrorMsg('');
    setSuccessMsg(`Payment request of ₹${amountInput} submitted! UTR: ${utrInput}. Coins will be added after admin verification.`);
    setShowQrModal(false);
    setAmountInput('');
    setUtrInput('');
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto text-white">
      
      {/* WALLET BALANCE CARD */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-5 rounded-2xl shadow-xl text-black space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">Total Wallet Balance</span>
        <div className="flex justify-between items-end">
          <div className="text-3xl font-black">{userCoins} <span className="text-sm font-bold">Coins</span></div>
          <span className="text-xs bg-black/20 px-2.5 py-1 rounded-lg font-bold">1 Coin = ₹1</span>
        </div>
      </div>

      {/* ADD CASH FORM */}
      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-3">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Add Coins to Wallet</h3>
        
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs font-medium">
            ✅ {successMsg}
          </div>
        )}

        {errorMsg && !showQrModal && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleOpenPayment} className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">Enter Amount (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 50, 100, 200"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-yellow-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 200].map((amt) => (
              <button 
                key={amt}
                type="button"
                onClick={() => setAmountInput(amt.toString())}
                className="bg-gray-800 hover:bg-gray-700 text-yellow-400 text-xs font-bold py-2 rounded-xl border border-gray-700 transition-all"
              >
                + ₹{amt}
              </button>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
          >
            Proceed to Pay ₹{amountInput || '0'}
          </button>
        </form>
      </div>

      {/* QR CODE & TRANSACTION VERIFICATION MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl relative">
            
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold text-xs bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-extrabold text-yellow-400">SCAN & PAY ₹{amountInput}</h3>
              <p className="text-[11px] text-gray-400">Scan QR via Paytm, PhonePe, Google Pay or BHIM</p>
            </div>

            {/* DISPLAY QR CODE IMAGE */}
            <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center space-y-2 border-2 border-yellow-400 shadow-inner">
              <img 
                src="/qr-code.png" 
                alt="Paytm UPI QR Code" 
                className="w-48 h-auto rounded-lg object-contain"
              />
              <div className="text-center text-black">
                <div className="text-xs font-black tracking-wide">MOHIT SALOORIA</div>
                <div className="text-[10px] font-mono text-gray-600 font-bold">7807569217@ptyes</div>
              </div>
            </div>

            {/* TRANSACTION ID SUBMISSION FORM */}
            <form onSubmit={handleVerifySubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">
                  Enter UTR / Reference / Transaction ID
                </label>
                <input 
                  type="text" 
                  placeholder="Paste 12-digit UTR number here..."
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="w-full bg-gray-950 text-white p-2.5 rounded-xl border border-gray-700 text-xs focus:outline-none focus:border-yellow-500 font-mono"
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-[10px] font-bold text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  ⚠️ {errorMsg}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="bg-gray-800 text-gray-300 font-bold text-xs py-2.5 rounded-xl hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs py-2.5 rounded-xl active:scale-95 transition-all"
                >
                  Submit UTR
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}