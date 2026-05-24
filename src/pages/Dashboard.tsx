import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRightLeft,
  History,
  LogOut,
  User,
  AlertTriangle,
  IndianRupee,
} from 'lucide-react';

import api from '../api/axios';
import AlertModal from '../components/AlertModal';

interface Transaction {
  id: number;
  senderEmail: string;
  receiverAccountNumber: string;
  amount: number;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceRequested, setBalanceRequested] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [historyRecords, setHistoryRecords] = useState<Transaction[]>([]);

  const [transferData, setTransferData] = useState({
    receiverAccountNumber: '',
    amount: '',
    otp: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    isError: false,
  });

  const activeUserJson = localStorage.getItem('user') || sessionStorage.getItem('user');
  const userObj = activeUserJson ? JSON.parse(activeUserJson) : null;
  const userEmail = userObj?.email || '';
  const userName = userObj?.name || 'User';

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
    } else {
      loadAuditLedger();
    }
  }, [userEmail]);

  const loadAuditLedger = async () => {
    try {
      // role is no longer sent — backend looks it up from DB now
      const response = await api.get(`/api/auth/ledger?email=${userEmail}`);
      setHistoryRecords(response.data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const triggerSecurityToken = async () => {
    try {
      await api.post('/api/auth/generate-otp', { email: userEmail });
      setBalanceRequested(true);
      setModalConfig({
        title: 'OTP Sent',
        message: 'Verification code sent to your email.',
        isError: false,
      });
      setModalOpen(true);
    } catch (error: any) {
      setModalConfig({
        title: 'Failed',
        message: error.response?.data || 'Unable to send OTP.',
        isError: true,
      });
      setModalOpen(true);
    }
  };

  const triggerTransferToken = async () => {
    try {
      await api.post('/api/auth/generate-otp', { email: userEmail });
      setModalConfig({
        title: 'OTP Sent',
        message: 'OTP sent to your email. Enter it below to confirm transfer.',
        isError: false,
      });
      setModalOpen(true);
    } catch (error: any) {
      setModalConfig({
        title: 'OTP Failed',
        message: error.response?.data || 'Failed to send OTP.',
        isError: true,
      });
      setModalOpen(true);
    }
  };

  const checkBalanceVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/verify-balance-otp', {
        email: userEmail,
        otp: otpCode,
      });
      setBalance(response.data.balance);
      setBalanceRequested(false);
      setOtpCode('');
    } catch (error: any) {
      setModalConfig({
        title: 'Verification Failed',
        message: error.response?.data || 'Invalid OTP.',
        isError: true,
      });
      setModalOpen(true);
    }
  };

  const handleAssetTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(transferData.amount);
    if (amount <= 0) {
      setModalConfig({
        title: 'Invalid Amount',
        message: 'Transfer amount must be greater than 0.',
        isError: true,
      });
      setModalOpen(true);
      return;
    }
    if (amount > 50000) {
      setModalConfig({
        title: 'Limit Exceeded',
        message: 'Maximum single transfer limit is ₹50,000.',
        isError: true,
      });
      setModalOpen(true);
      return;
    }

    try {
      const response = await api.post('/api/auth/transfer', {
        senderEmail: userEmail,
        receiverAccountNumber: transferData.receiverAccountNumber,
        amount: amount,
        otp: transferData.otp,
      });
      setModalConfig({
        title: 'Transfer Successful',
        message: response.data.message || 'Transfer completed.',
        isError: false,
      });
      setModalOpen(true);
      setTransferData({ receiverAccountNumber: '', amount: '', otp: '' });
      loadAuditLedger();
    } catch (error: any) {
      setModalConfig({
        title: 'Transfer Failed',
        message: error.response?.data || 'Transaction failed.',
        isError: true,
      });
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative px-6 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1e3a8a20,transparent_30%),radial-gradient(circle_at_bottom_left,#06b6d420,transparent_30%)]" />

      <AlertModal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        isError={modalConfig.isError}
        onClose={() => setModalOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, {userName}
            </h1>
            <p className="text-slate-400 mt-2">Secure Wallet Dashboard</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="backdrop-blur-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all duration-300 px-5 py-3 rounded-2xl flex items-center gap-2"
            >
              <User size={18} /> Profile
            </button>
            <button
              onClick={() => navigate('/logout')}
              className="bg-red-500/20 border border-red-500/20 hover:bg-red-500/30 transition-all duration-300 px-5 py-3 rounded-2xl flex items-center gap-2 text-red-300"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Balance Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Wallet Balance</p>
                <h2 className="text-3xl font-bold mt-2">
                  {balance !== null ? `₹ ${balance.toLocaleString('en-IN')}` : 'Hidden'}
                </h2>
              </div>
              <div className="bg-emerald-500/20 p-4 rounded-2xl">
                <IndianRupee className="text-emerald-400" />
              </div>
            </div>

            {!balanceRequested && balance === null ? (
              <button
                onClick={triggerSecurityToken}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition-all py-3 rounded-2xl font-semibold"
              >
                Reveal Balance
              </button>
            ) : balanceRequested ? (
              <form onSubmit={checkBalanceVerification} className="space-y-3 mt-4">
                <input
                  type="text"
                  inputMode="numeric"
                  id="balanceOtp"
                  name="balanceOtp"
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-center tracking-widest text-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all py-3 rounded-2xl font-semibold"
                >
                  Verify OTP
                </button>
              </form>
            ) : (
              <button
                onClick={() => setBalance(null)}
                className="w-full mt-4 bg-slate-700 hover:bg-slate-600 transition-all py-3 rounded-2xl font-semibold text-sm"
              >
                Hide Balance
              </button>
            )}
          </motion.div>

          {/* Fraud Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Fraud Monitoring</p>
                <h2 className="text-2xl font-bold mt-2">AI Active</h2>
              </div>
              <div className="bg-orange-500/20 p-4 rounded-2xl">
                <AlertTriangle className="text-orange-400" />
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mt-4">
              Real-time transaction pattern analysis enabled.
            </p>
          </motion.div>

          {/* Security Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Account Security</p>
                <h2 className="text-2xl font-bold mt-2">Protected</h2>
              </div>
              <div className="bg-cyan-500/20 p-4 rounded-2xl">
                <ShieldCheck className="text-cyan-400" />
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mt-4">
              OTP verification and encrypted access enabled.
            </p>
          </motion.div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">

          {/* TRANSFER CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500/20 p-3 rounded-2xl">
                <ArrowRightLeft className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Send Money</h2>
                <p className="text-slate-400 text-sm">Fast and secure wallet transfer</p>
              </div>
            </div>

            <form onSubmit={handleAssetTransfer} className="space-y-5">
              <input
                type="text"
                id="receiverAccountNumber"
                name="receiverAccountNumber"
                placeholder="Receiver Account Number"
                value={transferData.receiverAccountNumber}
                onChange={(e) => setTransferData({ ...transferData, receiverAccountNumber: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                required
              />

              <input
                type="number"
                id="transferAmount"
                name="transferAmount"
                placeholder="Transfer Amount (max ₹50,000)"
                value={transferData.amount}
                min="1"
                max="50000"
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                required
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  id="transferOtp"
                  name="transferOtp"
                  placeholder="Enter OTP"
                  maxLength={4}
                  value={transferData.otp}
                  onChange={(e) => setTransferData({ ...transferData, otp: e.target.value })}
                  className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 tracking-widest text-center"
                  required
                />
                <button
                  type="button"
                  onClick={triggerTransferToken}
                  className="bg-slate-700 hover:bg-slate-600 transition-all px-5 rounded-2xl text-sm font-semibold"
                >
                  Send OTP
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:scale-[1.01] transition-all py-4 rounded-2xl text-lg font-semibold shadow-lg"
              >
                Transfer Funds
              </button>
            </form>
          </motion.div>

          {/* HISTORY */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500/20 p-3 rounded-2xl">
                <History className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <p className="text-slate-400 text-sm">Recent wallet activity</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
              {historyRecords.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  No transactions yet.
                </div>
              ) : (
                historyRecords.map((tx) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={tx.id}
                    className="bg-black/20 border border-white/5 rounded-2xl p-5 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {tx.senderEmail === userEmail
                          ? `To: ${tx.receiverAccountNumber}`
                          : `From: ${tx.senderEmail}`}
                      </p>
                      <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {tx.status}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${
                      tx.senderEmail === userEmail ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {tx.senderEmail === userEmail ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;