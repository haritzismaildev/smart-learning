'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Lock, Phone, MapPin, Users, 
  Plus, Trash2, AlertCircle, CheckCircle, ArrowLeft 
} from 'lucide-react';

interface ChildData {
  full_name: string;
  age: number;
  grade_level: number;
}

export default function RegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Parent Info, 2: Children Info, 3: Verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Parent Data
  const [parentData, setParentData] = useState({
    nik: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
    address: '',
  });

  // Children Data
  const [children, setChildren] = useState<ChildData[]>([
    { full_name: '', age: 6, grade_level: 1 }
  ]);

  // Validation states
  const [nikValid, setNikValid] = useState<boolean | null>(null);
  const [nikChecking, setNikChecking] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  // Check NIK availability
  const checkNIK = async (nik: string) => {
    if (nik.length !== 16) {
      setNikValid(false);
      return;
    }

    setNikChecking(true);
    try {
      const response = await fetch(`/api/auth/check-nik?nik=${nik}`);
      const data = await response.json();
      setNikValid(!data.exists);
    } catch (err) {
      console.error('Error checking NIK:', err);
    } finally {
      setNikChecking(false);
    }
  };

  // Add child
  const addChild = () => {
    if (children.length < 5) {
      setChildren([...children, { full_name: '', age: 6, grade_level: 1 }]);
    }
  };

  // Remove child
  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  // Update child data
  const updateChild = (index: number, field: keyof ChildData, value: string | number) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  // Validate parent form
  const validateParentForm = () => {
    if (!parentData.nik || parentData.nik.length !== 16) {
      setError('NIK harus 16 digit');
      return false;
    }
    if (!nikValid) {
      setError('NIK sudah terdaftar atau tidak valid');
      return false;
    }
    if (!parentData.full_name || parentData.full_name.length < 3) {
      setError('Nama lengkap minimal 3 karakter');
      return false;
    }
    if (!parentData.email || !parentData.email.includes('@')) {
      setError('Email tidak valid');
      return false;
    }
    if (!parentData.password || parentData.password.length < 8) {
      setError('Password minimal 8 karakter');
      return false;
    }
    if (parentData.password !== parentData.confirmPassword) {
      setError('Password tidak cocok');
      return false;
    }
    if (!parentData.phone || parentData.phone.length < 10) {
      setError('Nomor telepon tidak valid');
      return false;
    }
    if (!parentData.whatsapp || parentData.whatsapp.length < 10) {
      setError('Nomor WhatsApp tidak valid');
      return false;
    }
    if (!parentData.address || parentData.address.length < 10) {
      setError('Alamat minimal 10 karakter');
      return false;
    }
    return true;
  };

  // Validate children form
  const validateChildrenForm = () => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child.full_name || child.full_name.length < 3) {
        setError(`Nama anak ke-${i + 1} minimal 3 karakter`);
        return false;
      }
      if (child.age < 6 || child.age > 12) {
        setError(`Umur anak ke-${i + 1} harus antara 6-12 tahun`);
        return false;
      }
      if (child.grade_level < 1 || child.grade_level > 6) {
        setError(`Kelas anak ke-${i + 1} harus antara 1-6`);
        return false;
      }
    }
    return true;
  };

  // Go to next step
  const nextStep = () => {
    setError('');
    
    if (step === 1) {
      if (validateParentForm()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateChildrenForm()) {
        setStep(3);
      }
    }
  };

  // Submit registration
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent: parentData,
          children: children,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Pendaftaran gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Pendaftaran Berhasil!
            </h2>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-800 mb-2">📧 Cek Email Anda</h3>
            <p className="text-sm text-gray-700 mb-3">
              Kami telah mengirim email verifikasi ke:
            </p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-blue-200 mb-3">
              {parentData.email}
            </p>
            <p className="text-sm text-gray-600">
              Klik link verifikasi dalam email untuk mengaktifkan akun Anda.
            </p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-800 mb-2">⏳ Menunggu Approval</h3>
            <p className="text-sm text-gray-700 mb-2">
              Pendaftaran Anda akan diverifikasi oleh admin dalam 1-2 hari kerja.
            </p>
            <p className="text-sm text-gray-600">
              Anda akan menerima email notifikasi setelah akun disetujui.
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-800 mb-2">👶 Akun Anak</h3>
            <p className="text-sm text-gray-700 mb-2">
              Setelah approval, kami akan mengirimkan:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Username untuk setiap anak</li>
              <li>• Password sementara</li>
              <li>• Petunjuk login</li>
            </ul>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📚 Daftar Smart Learning
          </h1>
          <p className="text-white/90">
            Daftarkan diri Anda dan anak-anak untuk bergabung
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${
              step >= 1 ? 'bg-white text-blue-600' : 'bg-white/30 text-white'
            }`}>
              <User className="w-5 h-5" />
              <span className="font-semibold">Data Orang Tua</span>
            </div>
            <div className="w-12 h-1 bg-white/30" />
            <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${
              step >= 2 ? 'bg-white text-blue-600' : 'bg-white/30 text-white'
            }`}>
              <Users className="w-5 h-5" />
              <span className="font-semibold">Data Anak</span>
            </div>
            <div className="w-12 h-1 bg-white/30" />
            <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${
              step >= 3 ? 'bg-white text-blue-600' : 'bg-white/30 text-white'
            }`}>
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Verifikasi</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800">Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Parent Data */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Data Identitas Orang Tua
              </h2>

              {/* NIK */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NIK (Nomor Induk Kependudukan) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={16}
                    value={parentData.nik}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setParentData({ ...parentData, nik: value });
                      if (value.length === 16) {
                        checkNIK(value);
                      } else {
                        setNikValid(null);
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      nikValid === true ? 'border-green-500 bg-green-50' :
                      nikValid === false ? 'border-red-500 bg-red-50' :
                      'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Masukkan 16 digit NIK"
                  />
                  {nikChecking && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                  {nikValid === true && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                  {nikValid === false && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {parentData.nik.length}/16 digit
                  {nikValid === false && (
                    <span className="text-red-600 ml-2">
                      NIK sudah terdaftar atau tidak valid
                    </span>
                  )}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={parentData.full_name}
                  onChange={(e) => setParentData({ ...parentData, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama sesuai KTP"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={parentData.email}
                    onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Email akan digunakan untuk verifikasi dan notifikasi
                </p>
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={parentData.password}
                      onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={parentData.confirmPassword}
                      onChange={(e) => setParentData({ ...parentData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ulangi password"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={parentData.phone}
                      onChange={(e) => setParentData({ ...parentData, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={parentData.whatsapp}
                      onChange={(e) => setParentData({ ...parentData, whatsapp: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat Lengkap *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    value={parentData.address}
                    onChange={(e) => setParentData({ ...parentData, address: e.target.value })}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alamat sesuai KTP"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Children Data */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Data Anak-Anak
                </h2>
                <button
                  onClick={addChild}
                  disabled={children.length >= 5}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Anak
                </button>
              </div>

              {children.map((child, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">
                      Anak ke-{index + 1}
                    </h3>
                    {children.length > 1 && (
                      <button
                        onClick={() => removeChild(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap Anak *
                      </label>
                      <input
                        type="text"
                        value={child.full_name}
                        onChange={(e) => updateChild(index, 'full_name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nama lengkap anak"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Umur *
                        </label>
                        <input
                          type="number"
                          min={6}
                          max={12}
                          value={child.age}
                          onChange={(e) => updateChild(index, 'age', parseInt(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-600 mt-1">6-12 tahun</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Kelas SD *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={child.grade_level}
                          onChange={(e) => updateChild(index, 'grade_level', parseInt(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-600 mt-1">Kelas 1-6</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-700">
                <p className="font-semibold mb-1">ℹ️ Informasi:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Anda bisa mendaftarkan maksimal 5 anak</li>
                  <li>• Username dan password untuk anak akan dikirim via email setelah approval</li>
                  <li>• Setiap anak dapat login dengan akun masing-masing</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Verifikasi Data
              </h2>

              {/* Parent Summary */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Orang Tua
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">NIK:</span>
                    <p className="font-semibold">{parentData.nik}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nama:</span>
                    <p className="font-semibold">{parentData.full_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-semibold">{parentData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Telepon:</span>
                    <p className="font-semibold">{parentData.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Alamat:</span>
                    <p className="font-semibold">{parentData.address}</p>
                  </div>
                </div>
              </div>

              {/* Children Summary */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Data Anak ({children.length})
                </h3>
                <div className="space-y-3">
                  {children.map((child, index) => (
                    <div key={index} className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-gray-800">{index + 1}. {child.full_name}</p>
                      <p className="text-sm text-gray-600">
                        Umur: {child.age} tahun • Kelas: {child.grade_level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-3">⚠️ Perhatian</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✓ Pastikan semua data yang diisi sudah benar</li>
                  <li>✓ Email verifikasi akan dikirim ke: <strong>{parentData.email}</strong></li>
                  <li>✓ Pendaftaran akan diverifikasi admin dalam 1-2 hari kerja</li>
                  <li>✓ Setelah approval, kredensial login anak akan dikirim via email</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition"
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sudah punya akun? Login di sini
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white text-sm">
          <p>© 2025 CreativeJawiProduction.prod • Made with ❤️ by Haritz</p>
        </div>
      </div>
    </div>
  );
}