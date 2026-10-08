// Landing page BERESIN, jasa cleaning service di Jakarta.
// Halaman ini TIDAK memakai AuthenticatedLayout, header/nav + footer inline, self-contained.
// Tidak menerima props.
import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import {
    BadgeCheck,
    CalendarCheck,
    CheckCircle2,
    ChevronRight,
    Clock,
    Home,
    MapPin,
    Menu,
    MessageCircle,
    Phone,
    ShieldCheck,
    ShowerHead,
    Sofa,
    Sparkles,
    SprayCan,
    Star,
    Wind,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia: 150000 -> "Rp150.000"
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

// ---------- Data ----------

interface Layanan {
    id: string;
    nama: string;
    harga: number;
    satuan: string;
    deskripsi: string;
    icon: LucideIcon;
    art: string;
    butuhJumlahUnit?: boolean; // mis. cuci AC dihitung per unit
}

const LAYANAN: Layanan[] = [
    { id: 'general', nama: 'General Cleaning', harga: 150000, satuan: 'sesi', deskripsi: 'Bersih menyeluruh rumah/kantor: sapu, pel, lap debu, kamar mandi, dan buang sampah.', icon: SprayCan, art: 'from-sky-500 via-blue-600 to-indigo-700' },
    { id: 'deep', nama: 'Deep Cleaning', harga: 350000, satuan: 'sesi', deskripsi: 'General cleaning + kerak kamar mandi, noda membandel, area dapur detail, dan fogging ringan.', icon: Sparkles, art: 'from-violet-500 via-purple-600 to-indigo-700' },
    { id: 'ac', nama: 'Cuci AC', harga: 75000, satuan: 'unit', deskripsi: 'Cuci indoor & outdoor, cek freon, dan pastikan AC dingin kembali seperti baru.', icon: Wind, art: 'from-cyan-500 via-sky-600 to-blue-700', butuhJumlahUnit: true },
    { id: 'sofa', nama: 'Cuci Sofa & Kasur', harga: 250000, satuan: 'set', deskripsi: 'Vacuum tungau + shampoo khusus kain untuk sofa, kasur, dan karpet.', icon: Sofa, art: 'from-teal-500 via-emerald-600 to-green-700' },
    { id: 'kamar-mandi', nama: 'Deep Clean Kamar Mandi', harga: 120000, satuan: 'ruang', deskripsi: 'Sikat kerak keramik, kloset, wastafel, dan kaca hingga kinclong.', icon: ShowerHead, art: 'from-blue-500 via-cyan-600 to-teal-600' },
    { id: 'pindahan', nama: 'Bersih Pindahan', harga: 500000, satuan: 'sesi', deskripsi: 'Pembersihan total rumah kosong sebelum dihuni atau setelah pindahan.', icon: Home, art: 'from-amber-500 via-orange-600 to-red-600' },
];

const CARA_KERJA = [
    { judul: 'Pilih layanan & jadwal', teks: 'Isi form booking di bawah, pilih layanan, tanggal, dan alamat. Dapat estimasi harga langsung.', icon: CalendarCheck, foto: '/images/landing-jasa/cara-booking.jpg' },
    { judul: 'Tim datang tepat waktu', teks: 'Cleaner terverifikasi datang membawa peralatan dan cairan pembersih sendiri.', icon: Clock, foto: '/images/landing-jasa/cara-tim.jpg' },
    { judul: 'Cek hasil, baru bayar', teks: 'Periksa hasilnya dulu. Bayar via QRIS/transfer setelah kamu puas. Garansi bersih 24 jam.', icon: BadgeCheck, foto: '/images/landing-jasa/cara-bayar.jpg' },
];

const TIM = [
    { nama: 'Dedi Supriadi', peran: 'Lead Cleaner', pengalaman: '6 tahun', inisial: 'DS', art: 'from-sky-600 to-blue-800' },
    { nama: 'Siti Rahayu', peran: 'Spesialis Deep Cleaning', pengalaman: '4 tahun', inisial: 'SR', art: 'from-violet-600 to-purple-800' },
    { nama: 'Agus Wijaya', peran: 'Teknisi AC', pengalaman: '7 tahun', inisial: 'AW', art: 'from-teal-600 to-emerald-800' },
    { nama: 'Maya Putri', peran: 'Spesialis Sofa & Karpet', pengalaman: '3 tahun', inisial: 'MP', art: 'from-rose-500 to-pink-700' },
];

const AREA_LAYANAN = ['Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara', 'Jakarta Pusat', 'Depok', 'Bekasi', 'Tangerang', 'Bogor'];

const FAQ = [
    { q: 'Apakah saya harus menyediakan peralatan kebersihan?', a: 'Tidak perlu. Tim kami membawa seluruh peralatan dan cairan pembersih food-grade yang aman untuk anak dan hewan peliharaan.' },
    { q: 'Bagaimana jika saya tidak puas dengan hasilnya?', a: 'Ada garansi bersih 24 jam: laporkan bagian yang kurang bersih, tim kami datang kembali tanpa biaya tambahan.' },
    { q: 'Apakah cleaner-nya terpercaya?', a: 'Semua cleaner melewati verifikasi KTP, paklaring, dan pelatihan 40 jam. Kamu menerima profil cleaner sebelum jadwal kunjungan.' },
    { q: 'Bisakah reschedule atau batal?', a: 'Bisa, gratis, maksimal H-1 sebelum jadwal via WhatsApp. Pembatalan di hari-H dikenakan biaya Rp50.000.' },
    { q: 'Metode pembayaran apa saja?', a: 'QRIS, transfer bank (BCA/BRI/Mandiri), dan tunai setelah pekerjaan selesai. Tanpa DP untuk booking di bawah Rp500.000.' },
];

// ---------- Komponen kecil ----------

// Slider sebelum/sesudah: geser pembatas untuk membandingkan kondisi kotor vs bersih.
function BeforeAfter() {
    const [pos, setPos] = useState(50);
    const ref = useRef<HTMLDivElement>(null);
    const menggeser = useRef(false);

    const aturDariPointer = (clientX: number) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const pct = ((clientX - r.left) / r.width) * 100;
        setPos(Math.min(96, Math.max(4, pct)));
    };

    return (
        <div
            ref={ref}
            className="relative h-64 cursor-ew-resize touch-none overflow-hidden rounded-2xl select-none sm:h-80"
            onPointerDown={(e) => { menggeser.current = true; (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId); aturDariPointer(e.clientX); }}
            onPointerMove={(e) => { if (menggeser.current) aturDariPointer(e.clientX); }}
            onPointerUp={() => { menggeser.current = false; }}
            onPointerCancel={() => { menggeser.current = false; }}
            role="slider"
            aria-label="Perbandingan sebelum dan sesudah"
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            {/* Lapisan bawah: SESUDAH (bersih) */}
            <div className="absolute inset-0">
                <img
                    src="/images/landing-jasa/hasil-sesudah.jpg"
                    alt="Ruang tamu bersih sesudah deep cleaning"
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
                <Badge className="absolute right-3 bottom-3 bg-sky-600 hover:bg-sky-600">Sesudah</Badge>
            </div>
            {/* Lapisan atas: SEBELUM (kotor), terpotong sesuai posisi slider */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <img
                    src="/images/landing-jasa/hasil-sebelum.jpg"
                    alt="Ruang tamu berantakan sebelum dibersihkan"
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
                <Badge className="absolute bottom-3 left-3 bg-stone-700 hover:bg-stone-700">Sebelum</Badge>
            </div>
            {/* Garis pembatas + gagang */}
            <div className="absolute inset-y-0 w-1 bg-white shadow-lg" style={{ left: `calc(${pos}% - 2px)` }}>
                <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl">
                    <ChevronRight className="h-5 w-5 rotate-180 text-sky-700" />
                    <ChevronRight className="-ml-3 h-5 w-5 text-sky-700" />
                </span>
            </div>
        </div>
    );
}

// ---------- Halaman ----------

export default function JasaLanding() {
    const [menuBuka, setMenuBuka] = useState(false);

    // Form booking, ringkasan harga dihitung langsung (client-side).
    const [layananId, setLayananId] = useState('general');
    const [tanggal, setTanggal] = useState('');
    const [alamat, setAlamat] = useState('');
    const [jumlahUnit, setJumlahUnit] = useState('1');

    const layananDipilih = useMemo(() => LAYANAN.find((l) => l.id === layananId) ?? LAYANAN[0], [layananId]);
    const totalHarga = useMemo(() => {
        const unit = layananDipilih.butuhJumlahUnit ? Math.max(1, parseInt(jumlahUnit, 10) || 1) : 1;
        return layananDipilih.harga * unit;
    }, [layananDipilih, jumlahUnit]);

    const hariIni = useMemo(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);

    const [bookingOk, setBookingOk] = useState(false);
    function kirimBooking(e: FormEvent) {
        e.preventDefault();
        if (!tanggal || !alamat.trim()) return;
        setBookingOk(true);
    }

    const navLinks = [
        { href: '#layanan', label: 'Layanan' },
        { href: '#cara-kerja', label: 'Cara Kerja' },
        { href: '#hasil', label: 'Hasil' },
        { href: '#tim', label: 'Tim Kami' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700">
                            <Sparkles className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-xl font-extrabold tracking-tight text-sky-700">BERESIN</span>
                    </a>
                    <nav className="ml-6 hidden items-center gap-1 md:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-sky-600 hover:bg-sky-700 sm:inline-flex" asChild>
                        <a href="#booking">Booking Sekarang</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t px-4 py-2 md:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero + form booking */}
            <section id="beranda" className="relative overflow-hidden bg-sky-700 text-white">
                <img
                    src="/images/landing-jasa/hero.jpg"
                    alt="Petugas cleaning service sedang membersihkan jendela"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/90 via-blue-700/85 to-indigo-800/90" aria-hidden />
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.15) 0, transparent 40%), radial-gradient(circle at 85% 80%, rgba(255,255,255,.1) 0, transparent 45%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
                            <MapPin className="mr-1 h-3.5 w-3.5" /> Melayani Jabodetabek
                        </Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Rumah 2 Lantai Bersih <span className="text-sky-200">dalam 3 Jam.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-sky-100">
                            Tim 2 cleaner terverifikasi, bawa peralatan sendiri, garansi bersih 24 jam.
                            Isi form di samping, harga langsung keluar, tanpa telepon-teleponan.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-300 text-yellow-300" /> 4.9/5 (8.400+ ulasan)</span>
                            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Cleaner terverifikasi</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> 15.000+ sesi selesai</span>
                        </div>
                    </div>

                    {/* Kartu form booking */}
                    <Card id="booking" className="text-foreground shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarCheck className="h-5 w-5 text-sky-600" /> Booking Cepat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookingOk ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Booking diterima!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        {layananDipilih.nama}, {rupiah(totalHarga)} pada {tanggal}.
                                        Tim kami akan menghubungimu via WhatsApp untuk konfirmasi jadwal.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => setBookingOk(false)}>Booking lagi</Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimBooking} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bk-layanan">Pilih layanan</Label>
                                        <Select value={layananId} onValueChange={setLayananId}>
                                            <SelectTrigger id="bk-layanan"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {LAYANAN.map((l) => (
                                                    <SelectItem key={l.id} value={l.id}>{l.nama}, {rupiah(l.harga)}/{l.satuan}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bk-tanggal">Tanggal</Label>
                                            <Input id="bk-tanggal" type="date" min={hariIni} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                                        </div>
                                        {layananDipilih.butuhJumlahUnit ? (
                                            <div className="space-y-1.5">
                                                <Label htmlFor="bk-unit">Jumlah unit AC</Label>
                                                <Input id="bk-unit" type="number" min={1} max={20} value={jumlahUnit} onChange={(e) => setJumlahUnit(e.target.value)} />
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5">
                                                <Label>Estimasi durasi</Label>
                                                <Input value={layananDipilih.id === 'deep' || layananDipilih.id === 'pindahan' ? '3–5 jam' : '2–3 jam'} readOnly className="bg-muted" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bk-alamat">Alamat lengkap</Label>
                                        <Textarea id="bk-alamat" placeholder="cth: Jl. Bangka Raya No. 12, Kemang, Jakarta Selatan" value={alamat} onChange={(e) => setAlamat(e.target.value)} required rows={2} />
                                    </div>
                                    {/* Ringkasan harga live */}
                                    <div className="rounded-lg bg-sky-50 p-3 text-sm">
                                        <div className="flex justify-between text-sky-900"><span>{layananDipilih.nama}{layananDipilih.butuhJumlahUnit ? ` × ${Math.max(1, parseInt(jumlahUnit, 10) || 1)} unit` : ''}</span><span className="font-semibold">{rupiah(totalHarga)}</span></div>
                                        <p className="mt-1 text-xs text-sky-700">Sudah termasuk peralatan, cairan pembersih & garansi 24 jam.</p>
                                    </div>
                                    <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">Booking via WhatsApp</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Grid layanan */}
            <section id="layanan" className="mx-auto max-w-6xl px-4 py-14">
                <div className="text-center">
                    <Badge variant="outline">Layanan Kami</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Harga Jelas, Tanpa Biaya Siluman</h2>
                    <p className="mx-auto mt-2 max-w-lg text-muted-foreground">Semua harga flat per sesi. Tidak ada biaya tambahan tersembunyi.</p>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {LAYANAN.map((l) => (
                        <Card key={l.id} className="overflow-hidden transition-shadow hover:shadow-md">
                            <div className={cn('flex h-28 items-center justify-center bg-gradient-to-br', l.art)}>
                                <l.icon className="h-11 w-11 text-white/90" strokeWidth={1.5} />
                            </div>
                            <CardContent className="p-5">
                                <p className="font-semibold">{l.nama}</p>
                                <p className="mt-1 text-xl font-extrabold text-sky-700">{rupiah(l.harga)}<span className="text-sm font-normal text-muted-foreground">/{l.satuan}</span></p>
                                <p className="mt-2 text-sm text-muted-foreground">{l.deskripsi}</p>
                                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => { setLayananId(l.id); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                    Pilih layanan ini
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Buat siapa Beresin */}
            <section className="mx-auto max-w-6xl px-4 pt-14">
                <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Paling Sering Dipesan Oleh</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                        { judul: 'Keluarga sibuk', teks: 'Ayah-ibu kerja, anak 2. Deep cleaning 2 minggu sekali, rumah selalu siap terima tamu.' },
                        { judul: 'Anak kos & apartemen', teks: 'General cleaning 2–3 jam sebelum pindah atau setelah renovasi kecil. Bawa koper, sisanya kami.' },
                        { judul: 'Kantor & ruko kecil', teks: 'Kontrak mingguan untuk 5–20 orang. Cleaner datang di luar jam kerja, Senin–Sabtu.' },
                    ].map((p) => (
                        <div key={p.judul} className="rounded-2xl border bg-card p-5">
                            <p className="font-bold">{p.judul}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{p.teks}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Cara kerja */}
            <section id="cara-kerja" className="bg-muted/50 py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-center text-3xl font-extrabold tracking-tight">Cara Kerja Beresin</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {CARA_KERJA.map((c, i) => (
                            <Card key={c.judul} className="overflow-hidden">
                                <img src={c.foto} alt={c.judul} className="h-40 w-full object-cover" loading="lazy" />
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-lg font-extrabold text-white">{i + 1}</span>
                                        <c.icon className="h-6 w-6 text-sky-600" />
                                    </div>
                                    <p className="mt-4 font-semibold">{c.judul}</p>
                                    <p className="mt-1.5 text-sm text-muted-foreground">{c.teks}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Before-after interaktif */}
            <section id="hasil" className="mx-auto max-w-6xl px-4 py-14">
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
                    <div>
                        <Badge variant="outline">Bukti Nyata</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Geser & Lihat Bedanya</h2>
                        <p className="mt-2 text-muted-foreground">
                            Contoh hasil Deep Cleaning ruang tamu 3×4 m di daerah Pejaten.
                            Selesai dalam 4 jam oleh 2 cleaner.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                            {['Noda kopi di sofa hilang total', 'Kerak kamar mandi bersih 100%', 'Lantai mengkilap tanpa lengket'].map((x) => (
                                <li key={x} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{x}</li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-sky-600 bg-card p-4 shadow-sm">
                            <blockquote className="text-sm italic text-muted-foreground">
                                “AC 4 unit di rumah selesai 2 jam, semuanya dingin lagi. Cleaner-nya rapi,
                                bawa tangga dan vacuum sendiri.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-muted-foreground">
                                Bu Rina Wulandari, Kemang, langganan service AC 6 bulan
                            </figcaption>
                        </figure>
                    </div>
                    <BeforeAfter />
                </div>
            </section>

            {/* Tim */}
            <section id="tim" className="bg-muted/50 py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-center text-3xl font-extrabold tracking-tight">Tim yang Datang ke Rumahmu</h2>
                    <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">Semua cleaner terverifikasi identitas dan terlatih. Kenali mereka sebelum jadwal kunjungan.</p>
                    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {TIM.map((t) => (
                            <Card key={t.nama} className="text-center">
                                <CardContent className="p-5">
                                    <span className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white', t.art)}>
                                        {t.inisial}
                                    </span>
                                    <p className="mt-3 font-semibold">{t.nama}</p>
                                    <p className="text-sm text-sky-700">{t.peran}</p>
                                    <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {t.pengalaman} pengalaman</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Area layanan */}
            <section className="mx-auto max-w-6xl px-4 py-14">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Wilayah Layanan</h2>
                    <p className="mt-2 text-muted-foreground">Kami menjangkau seluruh Jabodetabek. Di luar daftar? Chat kami dulu.</p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {AREA_LAYANAN.map((a) => (
                        <Badge key={a} variant="secondary" className="px-4 py-2 text-sm">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 text-sky-600" />{a}
                        </Badge>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-3xl px-4 pb-16">
                <h2 className="text-center text-3xl font-extrabold tracking-tight">Pertanyaan Umum</h2>
                <Accordion type="single" collapsible className="mt-6">
                    {FAQ.map((f, i) => (
                        <AccordionItem key={f.q} value={`faq-${i}`}>
                            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-300">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700">
                                <Sparkles className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">BERESIN</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-400">Jasa cleaning profesional Jabodetabek. Rumah bersih, kamu santai.</p>
                        <p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><Phone className="h-4 w-4" /> 0812-8888-1234</p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MessageCircle className="h-4 w-4" /> CS WhatsApp 07.00–21.00</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Layanan Populer</p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-400">
                            {LAYANAN.slice(0, 4).map((l) => (
                                <li key={l.id}><a href="#layanan" className="hover:text-white">{l.nama}, {rupiah(l.harga)}/{l.satuan}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Jam Operasional</p>
                        <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                            <li>Senin, Sabtu: 07.00, 19.00</li>
                            <li>Minggu: 08.00, 17.00</li>
                            <li className="pt-2">Jl. Pejaten Raya No. 45, Jakarta Selatan</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">© 2026 Beresin. Beres bersih, beres hati.</div>
            </footer>

            {/* CTA sticky mobile: WhatsApp */}
            <StickyMobileCta
                variant="whatsapp"
                title="Beresin Cleaning"
                subtitle={`Mulai ${rupiah(75000)} • garansi 24 jam`}
                actionLabel="Booking via WA"
            />
        </div>
    );
}
