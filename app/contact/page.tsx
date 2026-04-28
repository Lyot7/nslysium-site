import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — NSLysium',
  description:
    'Contactez l\'équipe NSLysium pour toute question sur nos produits, abonnements ou partenariats.',
}

export default function ContactPage() {
  return (
    <>
      <section
        className="pt-32 pb-16 text-center"
        style={{ background: '#16120E' }}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <span
            className="text-xs font-semibold uppercase tracking-widest mb-6 block"
            style={{ color: '#C4622D' }}
          >
            Contact
          </span>
          <h1
            className="font-display text-5xl lg:text-6xl font-light mb-6"
            style={{ color: '#FAF7F2' }}
          >
            Parlons de votre <span className="text-gradient">Elysium</span>
          </h1>
          <p
            className="text-xl leading-relaxed"
            style={{ color: 'rgba(250, 247, 242, 0.65)' }}
          >
            Une question, une suggestion, ou envie de collaborer ?
            Notre équipe est là pour vous répondre.
          </p>
        </div>
      </section>

      <section style={{ background: '#16120E' }} className="pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div>
                <h2
                  className="font-display text-2xl font-light mb-8"
                  style={{ color: '#FAF7F2' }}
                >
                  Nous trouver
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(196, 98, 45, 0.15)' }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                          fill="#C4622D"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#FAF7F2' }}>
                        Email
                      </p>
                      <a
                        href="mailto:contact@nslysium.com"
                        className="text-base transition-colors duration-200 hover:text-[#FAF7F2]"
                        style={{ color: '#7A6A58' }}
                      >
                        contact@nslysium.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(196, 98, 45, 0.15)' }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                          fill="#C4622D"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#FAF7F2' }}>
                        Instagram
                      </p>
                      <a
                        href="https://instagram.com/nslysium"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base transition-colors duration-200 hover:text-[#FAF7F2]"
                        style={{ color: '#7A6A58' }}
                      >
                        @nslysium
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(196, 98, 45, 0.15)' }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                          fill="#C4622D"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#FAF7F2' }}>
                        LinkedIn
                      </p>
                      <a
                        href="https://linkedin.com/company/nslysium"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base transition-colors duration-200 hover:text-[#FAF7F2]"
                        style={{ color: '#7A6A58' }}
                      >
                        NSLysium
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl"
                style={{
                  background: '#221E18',
                  border: '1px solid rgba(196, 98, 45, 0.12)',
                }}
              >
                <p
                  className="text-sm font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#C4622D' }}
                >
                  Temps de réponse
                </p>
                <p className="text-base" style={{ color: 'rgba(250, 247, 242, 0.65)' }}>
                  Nous répondons à toutes les demandes sous{' '}
                  <strong style={{ color: '#FAF7F2' }}>48h ouvrées</strong>.
                  Pour les abonnés Pro, support prioritaire sous{' '}
                  <strong style={{ color: '#FAF7F2' }}>4h</strong>.
                </p>
              </div>
            </div>

            <div
              className="rounded-3xl p-8 lg:p-10"
              style={{
                background: '#221E18',
                border: '1px solid rgba(196, 98, 45, 0.15)',
              }}
            >
              <h2
                className="font-display text-2xl font-light mb-8"
                style={{ color: '#FAF7F2' }}
              >
                Envoyer un message
              </h2>
              <form
                action="mailto:contact@nslysium.com"
                method="post"
                encType="text/plain"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'rgba(250, 247, 242, 0.7)' }}
                    >
                      Nom
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                      style={{
                        background: '#16120E',
                        border: '1px solid rgba(196, 98, 45, 0.2)',
                        color: '#FAF7F2',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'rgba(250, 247, 242, 0.7)' }}
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                      style={{
                        background: '#16120E',
                        border: '1px solid rgba(196, 98, 45, 0.2)',
                        color: '#FAF7F2',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgba(250, 247, 242, 0.7)' }}
                  >
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200 appearance-none"
                    style={{
                      background: '#16120E',
                      border: '1px solid rgba(196, 98, 45, 0.2)',
                      color: '#FAF7F2',
                    }}
                  >
                    <option value="">Choisir un sujet</option>
                    <option value="produit">Question produit</option>
                    <option value="abonnement">Abonnement</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="presse">Presse</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgba(250, 247, 242, 0.7)' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Votre message..."
                    className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200 resize-none"
                    style={{
                      background: '#16120E',
                      border: '1px solid rgba(196, 98, 45, 0.2)',
                      color: '#FAF7F2',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: '#C4622D', color: '#FAF7F2' }}
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#221E18' }} className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/6' }}>
            <video
              src="/videos/ia-animation.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}
