import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Mendaftar" />

            <div className="min-h-[85vh] flex items-center justify-center p-4 py-12 relative overflow-hidden">
                {/* Decorative Background Blobs */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

                <div className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-[2rem] card-glass border border-white/40 shadow-2xl relative z-10">
                    
                    {/* Left Side: Branding / Marketing */}
                    <div className="w-full md:w-5/12 bg-gradient-to-br from-primary-600 to-primary-900 p-10 flex flex-col justify-between relative text-white shadow-inner overflow-hidden">
                        {/* Inner decorative rings */}
                        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full border border-white/10"></div>
                        <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full border border-white/5"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md mb-8 shadow-glow border border-white/20">
                                <span className="text-3xl">📢</span>
                            </div>
                            <h2 className="heading-2 text-white mb-4">Bergabung dengan LAPOR!<br/>STKIP Andi Matappa</h2>
                            <p className="text-primary-100 text-sm leading-relaxed mb-10">
                                Suarakan aspirasi dan laporan Anda dengan mudah. Bersama kita wujudkan pelayanan publik yang lebih transparan dan responsif.
                            </p>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-secondary-400/20 flex items-center justify-center text-secondary-300 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-white/90">Laporan Aman & Rahasia</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-secondary-400/20 flex items-center justify-center text-secondary-300 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-white/90">Terhubung Langsung Instansi</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-secondary-400/20 flex items-center justify-center text-secondary-300 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-white/90">Pantau Status Real-Time</span>
                            </div>
                        </div>
                        
                        <div className="mt-12 opacity-50 text-xs font-medium relative z-10">
                            © {new Date().getFullYear()} LAPOR! STKIP Andi Matappa
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="w-full md:w-7/12 bg-white/70 backdrop-blur-2xl p-10 md:p-14 relative z-10 flex flex-col justify-center">
                        <div className="mb-8">
                            <h3 className="heading-3 mb-2 text-gray-900">Buat Akun Baru</h3>
                            <p className="text-gray-500 text-sm font-medium">Lengkapi data diri Anda di bawah ini untuk memulai.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" className="font-bold text-gray-700" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full bg-white/90 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all px-4 py-3 shadow-sm"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Alamat Email" className="font-bold text-gray-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full bg-white/90 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all px-4 py-3 shadow-sm"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    placeholder="contoh@email.com"
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="password" value="Kata Sandi" className="font-bold text-gray-700" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-2 block w-full bg-white/90 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all px-4 py-3 shadow-sm"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        placeholder="Minimal 8 karakter"
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Ulangi Kata Sandi"
                                        className="font-bold text-gray-700"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-2 block w-full bg-white/90 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all px-4 py-3 shadow-sm"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        required
                                        placeholder="Ulangi kata sandi"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 border-t border-gray-100">
                                <Link
                                    href={route('login')}
                                    className="text-sm font-semibold text-primary hover:text-primary-800 transition-colors text-center md:text-left"
                                >
                                    Sudah punya akun? Masuk
                                </Link>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className={`inline-flex justify-center items-center px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-700 border border-transparent rounded-xl font-bold text-white tracking-wide hover:from-primary-600 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all shadow-lg hover:shadow-xl ${processing ? 'opacity-75 cursor-not-allowed' : 'transform hover:-translate-y-1'}`}
                                >
                                    {processing ? 'Memproses...' : 'Daftar Sekarang'}
                                    {!processing && (
                                        <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
