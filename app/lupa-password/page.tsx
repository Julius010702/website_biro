"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

@keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
@keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes popIn    { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}

.lp-root{width:100vw;min-height:100dvh;display:flex;align-items:center;justify-content:center;position:relative;background-image:url('/bacground_login.png');background-size:cover;background-position:center;background-repeat:no-repeat;padding:24px 16px;}
.lp-root::before{content:'';position:absolute;inset:0;z-index:0;background:linear-gradient(135deg,rgba(4,10,28,0.88) 0%,rgba(5,16,45,0.75) 35%,rgba(7,21,48,0.55) 65%,rgba(4,10,28,0.72) 100%);}
.lp-root::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;z-index:5;background:linear-gradient(90deg,#d4a017,#f0c84a 50%,#d4a017);background-size:200% auto;animation:shimmer 4s linear infinite;}

.lp-back{position:absolute;top:18px;left:22px;display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:99px;border:1px solid rgba(255,255,255,0.22);background:rgba(255,255,255,0.12);backdrop-filter:blur(12px);color:rgba(255,255,255,0.9);font-size:11px;font-weight:600;text-decoration:none;transition:all 0.2s;z-index:10;}
.lp-back:hover{background:rgba(255,255,255,0.22);border-color:rgba(255,255,255,0.4);color:#fff;}

.lp-card{position:relative;z-index:1;width:100%;max-width:400px;background:#fff;border-radius:22px;border:1px solid rgba(255,255,255,0.5);box-shadow:0 2px 8px rgba(0,0,0,0.15),0 16px 48px rgba(0,0,0,0.35),0 48px 96px rgba(0,0,0,0.25);padding:32px 28px 26px;animation:fadeInUp 0.55s ease both;overflow:hidden;}
.lp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#071530 0%,#d4a017 40%,#f0c84a 60%,#071530 100%);background-size:200% auto;animation:shimmer 4s linear infinite;}

.lp-steps{display:flex;align-items:center;gap:6px;margin-bottom:20px;}
.lp-step-dot{flex:1;height:4px;border-radius:99px;background:#e2e8f0;transition:background 0.3s;}
.lp-step-dot.active{background:linear-gradient(90deg,#0a1f4e,#1a6fd8);}
.lp-step-dot.done{background:#15803d;}

.lp-icon-wrap{width:52px;height:52px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:#0a1f4e;}
.lp-icon-wrap.success{background:#f0fdf4;border-color:#bbf7d0;color:#15803d;}

.lp-title{font-size:21px;font-weight:800;color:#0a1f4e;letter-spacing:-0.4px;line-height:1.15;margin-bottom:6px;}
.lp-sub{font-size:12.5px;color:#64748b;line-height:1.6;margin-bottom:20px;}
.lp-sub strong{color:#0a1f4e;}

.lp-alert{display:flex;align-items:flex-start;gap:8px;background:#fef2f2;border:1px solid #fecaca;color:#dc2626;font-size:12px;font-weight:500;border-radius:10px;padding:10px 12px;margin-bottom:16px;animation:shake 0.35s ease;}
.lp-alert-ok{display:flex;align-items:flex-start;gap:8px;background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;font-size:12px;font-weight:500;border-radius:10px;padding:10px 12px;margin-bottom:16px;}

.lp-form{display:flex;flex-direction:column;gap:14px;}
.lp-field{display:flex;flex-direction:column;gap:5px;}
.lp-label{font-size:11.5px;font-weight:700;color:#1e293b;}
.lp-input-wrap{display:flex;align-items:center;border:1.5px solid #e2e8f0;border-radius:11px;background:#f8fafc;transition:all 0.2s;overflow:hidden;}
.lp-input-wrap:focus-within{border-color:#0a1f4e;background:#fff;box-shadow:0 0 0 3px rgba(10,31,78,0.07);}
.lp-input-ico{width:42px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#94a3b8;}
.lp-input{flex:1;height:44px;border:none;background:transparent;font-size:13.5px;color:#0f172a;font-family:'Plus Jakarta Sans',sans-serif;outline:none;padding-right:10px;}
.lp-input::placeholder{color:#cbd5e1;font-size:12.5px;font-weight:300;}
.lp-otp-input{width:100%;height:56px;border:1.5px solid #e2e8f0;border-radius:12px;background:#f8fafc;font-size:26px;font-weight:800;letter-spacing:10px;text-align:center;color:#0a1f4e;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all 0.2s;}
.lp-otp-input:focus{border-color:#0a1f4e;background:#fff;box-shadow:0 0 0 3px rgba(10,31,78,0.07);}
.lp-eye{width:40px;height:44px;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#c0c0c0;padding:0;}
.lp-eye:hover{color:#0a1f4e;}

.lp-submit{width:100%;height:48px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,#071530 0%,#1558c0 60%,#1a6fd8 100%);color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.25s;box-shadow:0 4px 16px rgba(10,31,78,0.28);margin-top:4px;}
.lp-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(10,31,78,0.35);}
.lp-submit:disabled{opacity:0.5;cursor:not-allowed;}
.lp-spin{animation:spin 0.8s linear infinite;}

.lp-resend{text-align:center;margin-top:14px;font-size:11.5px;color:#94a3b8;}
.lp-resend-btn{background:none;border:none;cursor:pointer;color:#0a1f4e;font-weight:700;font-size:11.5px;font-family:'Plus Jakarta Sans',sans-serif;padding:0;}
.lp-resend-btn:disabled{color:#cbd5e1;cursor:not-allowed;}

.lp-foot{text-align:center;margin-top:18px;font-size:11.5px;color:#94a3b8;}
.lp-foot a{color:#0a1f4e;font-weight:700;text-decoration:none;}
.lp-foot a:hover{color:#d4a017;}

.lp-success-icon{animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;}

@media(max-width:480px){
  .lp-card{border-radius:18px;padding:24px 18px 20px;}
  .lp-input,.lp-submit{height:44px;}
  .lp-input{font-size:16px!important;}
}
`;

type Step = "email" | "otp" | "password" | "success";

function IcoMail() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}
function IcoShield() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
function IcoLock() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function IcoCheck() {
  return <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}

export default function LupaPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => firstInputRef.current?.focus(), 250); }, [step]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gagal mengirim kode OTP.");
        setLoading(false);
        return;
      }
      setStep("otp");
      setOtp("");
      setCooldown(60);
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Kode OTP harus 6 digit.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Kode OTP tidak valid.");
        setLoading(false);
        return;
      }
      setResetToken(data.resetToken);
      setStep("password");
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gagal mengubah kata sandi.");
        setLoading(false);
        return;
      }
      setStep("success");
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = { email: 0, otp: 1, password: 2, success: 3 }[step];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="lp-root">
        <Link href="/login" className="lp-back">
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Login
        </Link>

        <div className="lp-card">
          {step !== "success" && (
            <div className="lp-steps">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`lp-step-dot ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`} />
              ))}
            </div>
          )}

          {error && (
            <div className="lp-alert">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <>
              <div className="lp-icon-wrap"><IcoMail /></div>
              <h2 className="lp-title">Lupa Kata Sandi</h2>
              <p className="lp-sub">Masukkan email admin yang terdaftar. Kami akan mengirimkan kode OTP 6 digit untuk verifikasi.</p>
              <form onSubmit={handleSendOtp} className="lp-form">
                <div className="lp-field">
                  <label className="lp-label">Alamat Email</label>
                  <div className="lp-input-wrap">
                    <div className="lp-input-ico"><IcoMail /></div>
                    <input
                      ref={firstInputRef}
                      type="email"
                      className="lp-input"
                      placeholder="admin@biroorganisasi.nttprov.go.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="lp-submit">
                  {loading ? (
                    <><svg className="lp-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Mengirim...</>
                  ) : "Kirim Kode OTP"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <>
              <div className="lp-icon-wrap"><IcoShield /></div>
              <h2 className="lp-title">Masukkan Kode OTP</h2>
              <p className="lp-sub">Kode 6 digit telah dikirim ke <strong>{email}</strong>. Berlaku selama 10 menit.</p>
              <form onSubmit={handleVerifyOtp} className="lp-form">
                <div className="lp-field">
                  <label className="lp-label">Kode OTP</label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="lp-otp-input"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6} className="lp-submit">
                  {loading ? (
                    <><svg className="lp-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Memverifikasi...</>
                  ) : "Verifikasi Kode"}
                </button>
              </form>
              <div className="lp-resend">
                Tidak menerima kode?{" "}
                <button className="lp-resend-btn" disabled={cooldown > 0 || loading} onClick={() => handleSendOtp()}>
                  {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang"}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: PASSWORD BARU */}
          {step === "password" && (
            <>
              <div className="lp-icon-wrap"><IcoLock /></div>
              <h2 className="lp-title">Buat Kata Sandi Baru</h2>
              <p className="lp-sub">Kode OTP terverifikasi. Silakan masukkan kata sandi baru Anda.</p>
              <form onSubmit={handleResetPassword} className="lp-form">
                <div className="lp-field">
                  <label className="lp-label">Kata Sandi Baru</label>
                  <div className="lp-input-wrap">
                    <div className="lp-input-ico"><IcoLock /></div>
                    <input
                      ref={firstInputRef}
                      type={showPass ? "text" : "password"}
                      className="lp-input"
                      placeholder="Minimal 6 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="lp-eye" onClick={() => setShowPass((v) => !v)} tabIndex={-1}>
                      {showPass
                        ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                </div>
                <div className="lp-field">
                  <label className="lp-label">Konfirmasi Kata Sandi</label>
                  <div className="lp-input-wrap">
                    <div className="lp-input-ico"><IcoLock /></div>
                    <input
                      type={showPass ? "text" : "password"}
                      className="lp-input"
                      placeholder="Ulangi kata sandi baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="lp-submit">
                  {loading ? (
                    <><svg className="lp-spin" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Menyimpan...</>
                  ) : "Simpan Kata Sandi Baru"}
                </button>
              </form>
            </>
          )}

          {/* STEP 4: SUKSES */}
          {step === "success" && (
            <>
              <div className="lp-icon-wrap success lp-success-icon"><IcoCheck /></div>
              <h2 className="lp-title">Kata Sandi Berhasil Diubah</h2>
              <p className="lp-sub">Kata sandi Anda telah berhasil diperbarui. Silakan login menggunakan kata sandi baru Anda.</p>
              <button type="button" className="lp-submit" onClick={() => router.push("/login")}>
                Kembali ke Halaman Login
              </button>
            </>
          )}

          <p className="lp-foot">
            Butuh bantuan lain? <Link href="/login">Kembali ke Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}