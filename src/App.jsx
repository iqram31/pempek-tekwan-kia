import { useEffect, useMemo, useState } from 'react';

// ====== Data toko — ubah di sini kalau harga / nomor berubah ======
const WHATSAPP = '628988671476'; // 0898-8671-476 dalam format internasional
const WHATSAPP_DISPLAY = '0898-8671-476';
const PROMO_MIN = 3; // beli kelipatan 3 dapat harga promo

const PRODUCTS = [
  {
    id: 'pempek',
    name: 'Pempek',
    tagline: 'Satu paket lengkap dengan kuah cuko.',
    image: './images/pempek.webp',
    price: 23000,
    promoPrice: 20000,
    contents: ['1 kapal selam', '2 adaan', '1 lenjer', '1 kulit', '1 kuah cuko'],
  },
  {
    id: 'tekwan',
    name: 'Tekwan',
    tagline: 'Tinggal rebus, kuah gurih siap disantap.',
    image: './images/tekwan.webp',
    price: 25000,
    promoPrice: 23000,
    contents: ['Tekwan', 'Soun', 'Sedap malam', 'Jamur kuping', 'Bengkoang', 'Bumbu kuah', 'Sambal'],
  },
];

const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID');
const shortPrice = (n) => n / 1000 + 'K';

// Potongan harga berlaku kelipatan: setiap 3 pcs dihitung harga promo, sisanya harga normal.
function lineTotal(product, qty) {
  const promoQty = Math.floor(qty / PROMO_MIN) * PROMO_MIN;
  return promoQty * product.promoPrice + (qty - promoQty) * product.price;
}

function buildMessage({ name, address, note, lines, total }) {
  const items = lines.map((l) => `• ${l.product.name} x${l.qty} = ${rupiah(l.subtotal)}`).join('\n');
  return [
    'Halo Pempek Kia, saya mau pesan:',
    '',
    '*Pesanan*',
    items,
    '',
    `*Total: ${rupiah(total)}* (belum termasuk ongkir)`,
    '',
    `*Nama:* ${name}`,
    `*Alamat:* ${address}`,
    note ? `*Catatan:* ${note}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.34-.2-3.58.93.96-3.48-.23-.36a9.42 9.42 0 0 1-1.45-5.03c0-5.22 4.25-9.46 9.48-9.46 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.22-4.25 9.45-9.47 9.45zm8.06-17.5A11.33 11.33 0 0 0 12.04.67C5.77.67.66 5.77.66 12.04c0 2 .52 3.96 1.52 5.68L.57 23.6l6.03-1.58a11.4 11.4 0 0 0 5.43 1.38h.01c6.27 0 11.38-5.1 11.38-11.37 0-3.04-1.18-5.9-3.32-8.04z" />
    </svg>
  );
}

function Stepper({ qty, onChange, label }) {
  return (
    <div className="stepper" role="group" aria-label={`Jumlah ${label}`}>
      <button type="button" onClick={() => onChange(qty - 1)} disabled={qty === 0} aria-label={`Kurangi ${label}`}>
        −
      </button>
      <span aria-live="polite">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)} aria-label={`Tambah ${label}`}>
        +
      </button>
    </div>
  );
}

function ProductCard({ product, qty, onChange }) {
  const toPromo = PROMO_MIN - (qty % PROMO_MIN);
  return (
    <article className="card">
      <div className="card-photo">
        <img src={product.image} alt={`Paket ${product.name} frozen dalam kemasan vakum`} loading="lazy" />
        <span className="price-badge">{shortPrice(product.price)}</span>
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="muted">{product.tagline}</p>
        <p className="contents-title">Isi per paket</p>
        <ul className="contents">
          {product.contents.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="promo-pill">
          Beli {PROMO_MIN} pcs, harga satuan jadi {shortPrice(product.promoPrice)}
        </p>
        <div className="card-buy">
          <div>
            <span className="price">{rupiah(product.price)}</span>
            <span className="muted"> / paket</span>
          </div>
          {qty === 0 ? (
            <button type="button" className="btn btn-primary" onClick={() => onChange(1)}>
              + Tambah
            </button>
          ) : (
            <Stepper qty={qty} onChange={onChange} label={product.name} />
          )}
        </div>
        {qty > 0 && (
          <p className="hint">
            {qty % PROMO_MIN === 0
              ? `Harga promo aktif: ${rupiah(lineTotal(product, qty))}`
              : `Tambah ${toPromo} lagi untuk harga promo ${shortPrice(product.promoPrice)}/pcs`}
          </p>
        )}
      </div>
    </article>
  );
}

export default function App() {
  const [cart, setCart] = useState({ pempek: 0, tekwan: 0 });
  const [form, setForm] = useState({ name: '', address: '', note: '' });
  const [errors, setErrors] = useState({});

  const setQty = (id, qty) => setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(99, qty)) }));
  const setField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const lines = useMemo(
    () =>
      PRODUCTS.filter((p) => cart[p.id] > 0).map((p) => ({
        product: p,
        qty: cart[p.id],
        subtotal: lineTotal(p, cart[p.id]),
        saved: p.price * cart[p.id] - lineTotal(p, cart[p.id]),
      })),
    [cart]
  );
  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  const saved = lines.reduce((s, l) => s + l.saved, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  useEffect(() => {
    if (count > 0) setErrors((er) => ({ ...er, cart: undefined }));
  }, [count]);

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const address = form.address.trim();
    const note = form.note.trim();
    const er = {};
    if (count === 0) er.cart = 'Pilih minimal 1 produk dulu, ya.';
    if (!name) er.name = 'Nama wajib diisi.';
    if (!address) er.address = 'Alamat wajib diisi.';
    setErrors(er);
    if (Object.keys(er).length > 0) {
      const first = er.cart ? 'menu' : er.name ? 'field-name' : 'field-address';
      const el = document.getElementById(first);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!er.cart) el?.focus({ preventScroll: true });
      return;
    }
    const text = buildMessage({ name, address, note, lines, total });
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand">
            <img src="./images/logo.webp" alt="" width="44" height="44" />
            <span>
              Pempek <b>Kia</b>
            </span>
          </a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a href="#menu">Menu</a>
            <a href="#cara-pesan">Cara Pesan</a>
          </nav>
          <a href="#pesan" className="btn btn-primary nav-cta">
            Pesan{count > 0 && <span className="count">{count}</span>}
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-text">
              <span className="chip chip-frozen">❄ Frozen Product</span>
              <h1>
                Pempek &amp; Tekwan
                <span className="script">asli ikan tenggiri</span>
              </h1>
              <p className="lead">
                Dikemas vakum dan dibekukan, lengkap dengan kuah dan bumbunya. Simpan di freezer, sajikan kapan saja
                rasa Palembang dirindukan.
              </p>
              <div className="hero-actions">
                <a href="#menu" className="btn btn-primary btn-lg">
                  Lihat Menu
                </a>
                <a href="#pesan" className="btn btn-ghost btn-lg">
                  Pesan via WhatsApp
                </a>
              </div>
              <ul className="hero-points">
                <li>Mulai {rupiah(PRODUCTS[0].price)}</li>
                <li>Beli {PROMO_MIN} lebih hemat</li>
                <li>Kemasan vakum</li>
              </ul>
            </div>
            <div className="hero-logo">
              <img src="./images/logo.webp" alt="Logo Pempek Kia" width="900" height="900" />
            </div>
          </div>
        </section>

        <section id="menu" className="section">
          <div className="container">
            <p className="eyebrow">Menu</p>
            <h2>Pilih paket favoritmu</h2>
            <p className="section-sub">
              Potongan harga berlaku kelipatan {PROMO_MIN} pcs untuk tiap produk.
            </p>
            {errors.cart && (
              <p className="error error-banner" role="alert">
                {errors.cart}
              </p>
            )}
            <div className="grid">
              {PRODUCTS.map((p) => (
                <ProductCard key={p.id} product={p} qty={cart[p.id]} onChange={(q) => setQty(p.id, q)} />
              ))}
            </div>
          </div>
        </section>

        <section id="cara-pesan" className="section section-tint">
          <div className="container">
            <p className="eyebrow">Cara Pesan</p>
            <h2>Tiga langkah, pesanan sampai</h2>
            <ol className="steps">
              <li>
                <span className="step-num">1</span>
                <h3>Pilih produk</h3>
                <p>Tentukan jumlah pempek dan tekwan yang kamu mau.</p>
              </li>
              <li>
                <span className="step-num">2</span>
                <h3>Isi nama &amp; alamat</h3>
                <p>Lengkapi data pengiriman di formulir pemesanan.</p>
              </li>
              <li>
                <span className="step-num">3</span>
                <h3>Kirim via WhatsApp</h3>
                <p>Pesananmu otomatis tertulis rapi, tinggal tekan kirim.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="pesan" className="section">
          <div className="container">
            <p className="eyebrow">Pemesanan</p>
            <h2>Lengkapi pesananmu</h2>
            <form className="order" onSubmit={submit} noValidate>
              <div className="panel">
                <h3>Data pemesan</h3>
                <label htmlFor="field-name">Nama</label>
                <input
                  id="field-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Nama lengkap"
                  value={form.name}
                  onChange={setField}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="error">{errors.name}</p>}

                <label htmlFor="field-address">Alamat pengiriman</label>
                <textarea
                  id="field-address"
                  name="address"
                  rows="3"
                  autoComplete="street-address"
                  placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kota"
                  value={form.address}
                  onChange={setField}
                  aria-invalid={!!errors.address}
                />
                {errors.address && <p className="error">{errors.address}</p>}

                <label htmlFor="field-note">
                  Catatan <span className="muted">(opsional)</span>
                </label>
                <textarea
                  id="field-note"
                  name="note"
                  rows="2"
                  placeholder="Contoh: kirim sore, patokan rumah pagar hijau"
                  value={form.note}
                  onChange={setField}
                />
              </div>

              <div className="panel summary">
                <h3>Ringkasan pesanan</h3>
                {PRODUCTS.map((p) => (
                  <div className="summary-row" key={p.id}>
                    <img src={p.image} alt="" width="52" height="52" loading="lazy" />
                    <div className="summary-name">
                      <b>{p.name}</b>
                      <span className="muted">
                        {cart[p.id] > 0 ? rupiah(lineTotal(p, cart[p.id])) : rupiah(p.price) + ' / paket'}
                      </span>
                    </div>
                    <Stepper qty={cart[p.id]} onChange={(q) => setQty(p.id, q)} label={p.name} />
                  </div>
                ))}
                {errors.cart && (
                  <p className="error" role="alert">
                    {errors.cart}
                  </p>
                )}
                {saved > 0 && (
                  <div className="total-row saved">
                    <span>Hemat promo</span>
                    <span>−{rupiah(saved)}</span>
                  </div>
                )}
                <div className="total-row total">
                  <span>Total</span>
                  <span>{rupiah(total)}</span>
                </div>
                <p className="muted small">Belum termasuk ongkos kirim. Ongkir dikonfirmasi lewat WhatsApp.</p>
                <button type="submit" className="btn btn-wa btn-lg btn-block">
                  <WhatsAppIcon /> Pesan via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <img src="./images/logo-alt.webp" alt="Pempek dan Tekwan Kia" width="150" height="150" loading="lazy" />
          <div>
            <p className="footer-brand">Pempek &amp; Tekwan Kia</p>
            <p>Frozen product, asli ikan tenggiri.</p>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="footer-wa">
              <WhatsAppIcon /> {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Pempek Kia</p>
      </footer>

      {count > 0 && (
        <a href="#pesan" className="cart-bar">
          <span>
            {count} paket · <b>{rupiah(total)}</b>
          </span>
          <span className="cart-bar-cta">Lanjut pesan →</span>
        </a>
      )}
    </>
  );
}
