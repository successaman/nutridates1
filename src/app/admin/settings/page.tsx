'use client';

import { useEffect, useState } from 'react';

interface DiagnosticsResult {
  supabaseConnected: boolean;
  selectOk: boolean;
  insertOk: boolean;
  updateOk: boolean;
  deleteOk: boolean;
  errorMsg?: string;
}

export default function AdminSettingsPage() {
  const [whatsappPhone, setWhatsappPhone] = useState('917970574329');
  const [supportEmail, setSupportEmail] = useState('hello@nutridates.in');
  const [dbStatus, setDbStatus] = useState<'checking' | 'supabase' | 'fallback'>('checking');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'diagnostics'>('config');

  // Diagnostics states
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<DiagnosticsResult | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        setWhatsappPhone(data.settings.whatsapp_phone || '917970574329');
        setSupportEmail(data.settings.support_email || 'hello@nutridates.in');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const runConnectionDiagnostics = async (silent = false) => {
    if (!silent) setDiagnosticsRunning(true);
    try {
      const res = await fetch('/api/admin/diagnostics');
      const data = await res.json();
      if (res.ok && data.success) {
        setDiagnosticsResult({
          supabaseConnected: data.supabaseConnected,
          selectOk: data.selectOk,
          insertOk: data.insertOk,
          updateOk: data.updateOk,
          deleteOk: data.deleteOk,
          errorMsg: data.errorMsg
        });
        setDbStatus(data.supabaseConnected ? 'supabase' : 'fallback');
      } else {
        if (!silent) {
          alert('Diagnostics check failed: ' + (data.error || 'Unknown error'));
        }
      }
    } catch (err: any) {
      console.error(err);
      if (!silent) alert('Error running diagnostics.');
    } finally {
      if (!silent) setDiagnosticsRunning(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    runConnectionDiagnostics(true); // run initial silent diagnostics check
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_phone: whatsappPhone,
          support_email: supportEmail
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Store settings successfully updated!');
        await fetchSettings();
      } else {
        alert('Failed to save settings: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 text-[#111111] min-h-screen pb-16">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Admin Settings & Status
        </h2>
        <p className="text-sm font-semibold text-[#4E3A2E] mt-1 uppercase tracking-wider">
          Configure store parameters & inspect database nodes
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b-4 border-black gap-2">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-5 py-3 border-2 border-black border-b-0 rounded-t-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'config'
              ? 'bg-[#FF5000] text-white shadow-[2px_0px_0px_0px_#111111] translate-y-[4px]'
              : 'bg-white text-stone-600 hover:text-black'
          }`}
        >
          ⚙️ Store Config
        </button>
        <button
          onClick={() => {
            setActiveTab('diagnostics');
            runConnectionDiagnostics(true);
          }}
          className={`px-5 py-3 border-2 border-black border-b-0 rounded-t-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'diagnostics'
              ? 'bg-[#FF5000] text-white shadow-[2px_0px_0px_0px_#111111] translate-y-[4px]'
              : 'bg-white text-stone-600 hover:text-black'
          }`}
        >
          🔍 Database Diagnostics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Left Column (Content Panel - 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'config' ? (
            <div className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] p-6 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000] border-b-2 border-black pb-3">
                ⚙️ Store Settings
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-2">
                    Active WhatsApp Phone Number
                  </label>
                  <input 
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-2.5 text-xs bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
                    required
                  />
                  <p className="text-[10px] text-stone-500 font-bold uppercase mt-1">
                    Must include country code without "+" or spaces (e.g. 917970574329)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-2">
                    Store Support Email
                  </label>
                  <input 
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-2.5 text-xs bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-[#FF5000] text-white border-2 border-black rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_#111111] disabled:opacity-75"
                >
                  {updating ? 'Saving...' : '💾 Save Settings'}
                </button>
              </form>
            </div>
          ) : (
            <div className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] p-6 space-y-6">
              <div className="flex justify-between items-center border-b-2 border-black pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000]">
                  🔍 Supabase Connection Diagnostics
                </h3>
                <button
                  onClick={() => runConnectionDiagnostics(false)}
                  disabled={diagnosticsRunning}
                  className="bg-black hover:bg-[#FF5000] text-white border-2 border-black rounded px-3 py-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors disabled:opacity-75"
                >
                  {diagnosticsRunning ? 'Testing...' : '🔄 Run Full Self-Test'}
                </button>
              </div>

              {diagnosticsResult ? (
                <div className="space-y-6">
                  {/* Status checklist grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-black rounded-lg p-4 bg-stone-50 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-black">SELECT Permissions</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase border rounded ${
                        diagnosticsResult.selectOk ? 'bg-emerald-500 text-white border-black' : 'bg-red-500 text-white border-black'
                      }`}>
                        {diagnosticsResult.selectOk ? 'PASS ✅' : 'FAIL ❌'}
                      </span>
                    </div>
                    
                    <div className="border-2 border-black rounded-lg p-4 bg-stone-50 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-black">INSERT Permissions</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase border rounded ${
                        diagnosticsResult.insertOk ? 'bg-emerald-500 text-white border-black' : 'bg-red-500 text-white border-black'
                      }`}>
                        {diagnosticsResult.insertOk ? 'PASS ✅' : 'FAIL ❌'}
                      </span>
                    </div>

                    <div className="border-2 border-black rounded-lg p-4 bg-stone-50 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-black">UPDATE Permissions</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase border rounded ${
                        diagnosticsResult.updateOk ? 'bg-emerald-500 text-white border-black' : 'bg-red-500 text-white border-black'
                      }`}>
                        {diagnosticsResult.updateOk ? 'PASS ✅' : 'FAIL ❌'}
                      </span>
                    </div>

                    <div className="border-2 border-black rounded-lg p-4 bg-stone-50 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-black">DELETE Permissions</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase border rounded ${
                        diagnosticsResult.deleteOk ? 'bg-emerald-500 text-white border-black' : 'bg-red-500 text-white border-black'
                      }`}>
                        {diagnosticsResult.deleteOk ? 'PASS ✅' : 'FAIL ❌'}
                      </span>
                    </div>
                  </div>

                  {/* Warning panel if delete fails (RLS policy check) */}
                  {!diagnosticsResult.deleteOk && diagnosticsResult.supabaseConnected && (
                    <div className="border-2 border-red-500 bg-red-50 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-black uppercase text-red-800 flex items-center gap-1.5">
                        ⚠️ Row-Level Security (RLS) Policy Missing
                      </h4>
                      <p className="text-[11px] font-semibold text-red-700 leading-relaxed">
                        Your Supabase database connected successfully, but the public client is blocked from deleting orders. 
                        To fix the order reset feature, go to your <strong>Supabase Dashboard SQL Editor</strong> and run:
                      </p>
                      <div className="bg-[#2B1D14] border-2 border-black text-amber-100 p-3 rounded-lg font-mono text-[10px] overflow-x-auto select-all">
                        <pre>CREATE POLICY "Allow public delete to orders" ON public.orders FOR DELETE TO anon USING (true);</pre>
                      </div>
                      <p className="text-[10px] text-red-600 font-bold uppercase">
                        * Note: Make sure to select your orders table and run the script in your Supabase project query runner.
                      </p>
                    </div>
                  )}

                  {/* Diagnostic logs */}
                  <div className="border-2 border-black rounded-xl p-4 bg-[#FBF9F6] space-y-2">
                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Diagnostic Log Detail</span>
                    <p className="text-xs font-mono font-semibold text-stone-700 leading-relaxed">
                      {diagnosticsResult.errorMsg 
                        ? `⚠️ Diagnostics Check Warning: ${diagnosticsResult.errorMsg}` 
                        : '🎉 Diagnostics Check Success: All CRUD capabilities are operating optimally on the active database node.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-xl">
                  <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-[#FF5000] rounded-full mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-400 uppercase">Fetching live database details...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Sidecards - 1/3 width) */}
        <div className="space-y-6">
          {/* Connection Status Card */}
          <div className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000] border-b-2 border-black pb-3">
              💾 Database Node
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="uppercase text-stone-400 font-black">Connection Node</span>
                <span className="text-black font-extrabold uppercase">Supabase Cloud</span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="uppercase text-stone-400 font-black">Active Status</span>
                <span className={`inline-block border px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  dbStatus === 'supabase' ? 'bg-emerald-500 text-white border-black shadow-[1px_1px_0px_0px_#111111]' : dbStatus === 'checking' ? 'bg-stone-500 text-white border-black animate-pulse' : 'bg-amber-500 text-white border-black'
                }`}>
                  {dbStatus === 'supabase' ? 'Supabase Connected' : dbStatus === 'checking' ? 'Checking Node...' : 'Fallback JSON DB'}
                </span>
              </div>
            </div>

            <p className="text-[10px] font-semibold text-[#4E3A2E] leading-relaxed bg-[#F9F7F5] border-2 border-black p-3 rounded-lg">
              {dbStatus === 'supabase'
                ? 'Your website is communicating directly with the Supabase PostgreSQL database. Updates to orders are synced instantly!'
                : dbStatus === 'fallback' 
                ? 'Your database is falling back to a local JSON file store (data/db.json). Check your environment variables to link Supabase.'
                : 'Inspecting active database configuration...'}
            </p>
          </div>

          {/* Danger Zone Card */}
          <div className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] p-6 space-y-4 border-red-500 shadow-[6px_6px_0px_0px_#EF4444]">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-600 border-b-2 border-red-200 pb-3">
              ⚠️ Danger Zone
            </h3>
            <p className="text-xs font-semibold text-stone-500 leading-tight">
              Delete all orders in the database to clear test records and begin fresh with live store orders.
            </p>
            <button
              onClick={async () => {
                const confirmReset = window.confirm('WARNING: Are you sure you want to delete all orders? This will wipe out all mock/test orders and cannot be undone!');
                if (!confirmReset) return;
                try {
                  const res = await fetch('/api/orders/reset', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    alert('All orders have been successfully cleared from the database.');
                    window.location.reload();
                  } else {
                    alert('Failed to reset orders: ' + data.error);
                  }
                } catch (err: any) {
                  alert('Error resetting database: ' + err.message);
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded-lg py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#111111] transition-transform active:translate-y-0"
            >
              🗑️ Reset All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
