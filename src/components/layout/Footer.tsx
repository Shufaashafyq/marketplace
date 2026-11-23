import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#560319] text-white">
      <img
        src="/images/illustrations/candle.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-25 z-10 hidden w-32 object-contain opacity-90 md:block lg:right-22 lg:w-28"
      />
      <img
      src="/images/illustrations/envelope.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute right-40 top-25 hidden w-32 object-contain opacity-90 md:block lg:right-5 lg:w-32"
      />

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">

          {/* Brand and Description */}
          <div className="space-y-10 -mt-5">
            <Link
              to="/"
              className="text-7xl font-bold tracking-tight"
              style={{ fontFamily: "'Estonia', cursive" }}
            >
              Marketplace
            </Link>

            <p className="max-w-sm text-sm leading-7 text-white/75">
              Every gift tells a story, and every little gesture holds meaning.
              At Marketplace, we bring you thoughtful finds and lovely treasures
              to help you celebrate the people who make your life special.
              Because the best gifts are the ones that come from the heart.
            </p>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">About Us</h3>

            <ul className="space-y-3 text-sm text-white/75">
              {/*<li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>*/}

              <li>
                <Link
                  to="/products"
                  className="transition-colors hover:text-white"
                >
                  Our Products
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="transition-colors hover:text-white"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="transition-colors hover:text-white"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact and Social Media */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Contact Us</h3>

            <div className="space-y-3 text-sm text-white/75">
              <div className="flex items-center gap-3">
                <Mail size={17} />
                <span>Get in touch with us</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={17} />
                <span>Maldives</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="mb-3 text-sm font-medium">Follow Us</p>

              <div className="flex items-center gap-5 text-sm text-white/75">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Instagram
                </a>

                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-6 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Marketplace. All rights reserved.
          </p>

          <p>Gifts- Made with care</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
