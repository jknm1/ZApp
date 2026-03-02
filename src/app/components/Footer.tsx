export function Footer() {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-black text-white">Z</span>
              </div>
              <span className="text-lg font-bold text-white">ZYNX Capital</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Elite prop trading firm providing free funding to qualified traders worldwide.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/zynxcapital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors"
              >
                <div className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-sm">@zynxcapital</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/risk-disclosure" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                  Risk Disclosure
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-slate-400 text-sm mb-2">
              Email: hello@zynxcorp.com
            </p>
            <p className="text-slate-400 text-sm">
              Response time: 24-48 hours
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">
              Powered by{" "}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                Zynx Corporation
              </span>
            </p>
            <p className="text-slate-500 text-xs">
              © 2026 Zynx Capital. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}