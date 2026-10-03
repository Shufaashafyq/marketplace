import { useEffect, useRef } from "react";

const MAIN_IMAGE = "/images/sunset.jpg";
const SECONDARY_IMAGE = "/images/gift.jpg";
const FALLBACK_IMAGE = "/images/sunset.jpg";
const PRODUCTS_ID = "products";

function WelcomeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function handlePointerMove(
    event: React.PointerEvent<HTMLElement>
  ) {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const bounds = section.getBoundingClientRect();

    const x =
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;

    const y =
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      section.style.setProperty("--mouse-x", x.toFixed(3));
      section.style.setProperty("--mouse-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    section.style.setProperty("--mouse-x", "0");
    section.style.setProperty("--mouse-y", "0");
  }

  function handleImageError(
    event: React.SyntheticEvent<HTMLImageElement>
  ) {
    const image = event.currentTarget;

    if (image.src !== FALLBACK_IMAGE) {
      image.src = FALLBACK_IMAGE;
    }
  }

  function handleViewProducts() {
    document
      .getElementById(PRODUCTS_ID)
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        .marketplace-editorial {
          --mouse-x: 0;
          --mouse-y: 0;

          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 480px;

          overflow: hidden;

          background: #F8F8F7;
          color: #560319;

          isolation: isolate;
        }

        /* --------------------------------
           TITLE
        -------------------------------- */

        .marketplace-editorial__title {
          position: absolute;
          top: 4%;
          left: 3.65%;
          z-index: 5;

          margin: 0;

          pointer-events: none;

          font-family: "Estonia", cursive;
          font-size: clamp(82px, 11vw, 170px);
          font-weight: 400;
          line-height: 0.72;
          letter-spacing: -0.045em;

          color: #560319;
        }

        .marketplace-editorial__title-line {
          display: block;

          overflow: hidden;

          padding-right: 0.09em;
          padding-bottom: 0.08em;
        }

        .marketplace-editorial__title-word {
          display: block;

          animation:
            marketplace-title-in
            1.05s
            cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        .marketplace-editorial__title-line:nth-child(2)
        .marketplace-editorial__title-word {
          animation-delay: 100ms;
        }

        /* --------------------------------
           LEFT COPY
        -------------------------------- */

        .marketplace-editorial__intro {
          position: absolute;
          top: 55%;
          left: 3.7%;
          z-index: 4;

          width: min(205px, 19.5vw);
        }

        .marketplace-editorial__eyebrow,
        .marketplace-editorial__detail,
        .marketplace-editorial__description {
          margin: 0;

          font-family:
            "DM Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-size: clamp(10px, 0.83vw, 13px);
          font-weight: 400;
          line-height: 1.43;
          letter-spacing: -0.025em;
        }

        .marketplace-editorial__eyebrow {
          margin-bottom: clamp(28px, 7vh, 55px);
        }

        .marketplace-editorial__detail strong {
          font-weight: 600;
        }

        .marketplace-editorial__intro > * {
          opacity: 0;
          transform: translateY(18px);

          animation:
            marketplace-copy-in
            800ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .marketplace-editorial__eyebrow {
          animation-delay: 720ms;
        }

        .marketplace-editorial__detail {
          animation-delay: 830ms;
        }

        /* --------------------------------
           PRODUCTS BUTTON
        -------------------------------- */

        .marketplace-editorial__products-button {
          position: relative;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 112px;
          height: 112px;

          margin-top: 10px;

          border: 0;
          padding: 0;

          background: transparent;

          cursor: pointer;

          font-family:
            "DM Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-size: 12px;
          font-weight: 700;

          transition:
            transform 200ms ease;
        }

        .marketplace-editorial__products-button img {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          object-fit: contain;

          transition:
            transform 200ms ease;
        }

        .marketplace-editorial__products-button span {
          position: relative;
          z-index: 1;

          pointer-events: none;

          text-align: center;

          color: #FDF4D2;

          -webkit-text-stroke: 1.2px #560319;
          paint-order: stroke fill;
        }

        .marketplace-editorial__products-button:hover {
          transform: scale(1.05);
        }

        .marketplace-editorial__products-button:active {
          transform: scale(0.95);
        }

        .marketplace-editorial__products-button:focus-visible {
          outline: 2px solid #A290B7;
          outline-offset: 4px;
        }

        /* --------------------------------
           MAIN IMAGE
        -------------------------------- */

        .marketplace-editorial__main-image {
          position: absolute;
          top: 24%;
          left: 26.45%;
          z-index: 2;

          width: 43.25%;
          height: 51.4%;

          min-height: 205px;

          margin: 0;

          overflow: hidden;

          border-radius:
            clamp(24px, 3.15vw, 46px);

          background: #E5E3DE;

          clip-path:
            inset(
              0 100% 0 0
              round clamp(24px, 3.15vw, 46px)
            );

          animation:
            marketplace-main-reveal
            1.25s
            280ms
            cubic-bezier(0.77, 0, 0.18, 1)
            forwards;
        }

        .marketplace-editorial__main-image::after,
        .marketplace-editorial__secondary-image::after {
          content: "";

          position: absolute;
          inset: 0;

          z-index: 2;

          pointer-events: none;

          border-radius: inherit;

          background:
            linear-gradient(
              115deg,
              rgba(255, 255, 255, 0.13),
              transparent 38%,
              rgba(0, 0, 0, 0.04)
            );

          mix-blend-mode: soft-light;
        }

        .marketplace-editorial__photo {
          display: block;

          width: 100%;
          height: 100%;

          object-fit: cover;

          will-change: transform;

          transition:
            transform 1.3s
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        .marketplace-editorial__main-photo {
          object-position: center 58%;

          transform:
            translate3d(
              calc(var(--mouse-x) * -8px),
              calc(var(--mouse-y) * -6px),
              0
            )
            scale(1.055);
        }

        .marketplace-editorial__main-image:hover
        .marketplace-editorial__main-photo {
          transform:
            translate3d(
              calc(var(--mouse-x) * -8px),
              calc(var(--mouse-y) * -6px),
              0
            )
            scale(1.095);
        }

        /* --------------------------------
           RIGHT PANEL
        -------------------------------- */

        .marketplace-editorial__side-panel {
          position: absolute;
          top: 16%;
          left: 71%;
          z-index: 10;

          width: 25%;
          max-width: 390px;
        }

        /* --------------------------------
           SECONDARY IMAGE
        -------------------------------- */

        .marketplace-editorial__secondary-image {
          position: relative;

          width: 100%;
          height: clamp(180px, 34vh, 205px);

          margin: 0;

          overflow: hidden;

          border-radius:
            clamp(25px, 3.2vw, 46px);

          background: #DDD9D0;

          clip-path:
            inset(
              0 0 0 100%
              round clamp(25px, 3.2vw, 46px)
            );

          animation:
            marketplace-secondary-reveal
            1.15s
            440ms
            cubic-bezier(0.77, 0, 0.18, 1)
            forwards;
        }

        .marketplace-editorial__secondary-photo {
          object-position: center 57%;

          transform:
            translate3d(
              calc(var(--mouse-x) * 7px),
              calc(var(--mouse-y) * 5px),
              0
            )
            scale(1.075);
        }

        .marketplace-editorial__secondary-image:hover
        .marketplace-editorial__secondary-photo {
          transform:
            translate3d(
              calc(var(--mouse-x) * 7px),
              calc(var(--mouse-y) * 5px),
              0
            )
            scale(1.13);
        }

        /* --------------------------------
           RIGHT TEXT
        -------------------------------- */

        .marketplace-editorial__side-copy {
          padding-top: clamp(14px, 3.2vh, 28px);
        }

        .marketplace-editorial__heading-mask {
          overflow: hidden;

          padding-bottom: 0.08em;
        }

        .marketplace-editorial__heading {
          margin: 0;

          font-family:
            "Estonia",
            cursive;

          font-size: clamp(39px, 4.2vw, 67px);
          font-weight: 400;
          line-height: 0.88;
          letter-spacing: -0.035em;

          color: #560319;

          transform: translateY(115%);

          animation:
            marketplace-heading-in
            900ms
            810ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .marketplace-editorial__description {
          max-width: 355px;

          margin-top: clamp(18px, 3.5vh, 30px);

          color: #8F8585;

          opacity: 0;
          transform: translateY(14px);

          animation:
            marketplace-copy-in
            800ms
            960ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        /* --------------------------------
           INDEX
        -------------------------------- */

        .marketplace-editorial__index {
          position: absolute;

          right: 2.3%;
          bottom: 3%;

          display: flex;
          align-items: center;

          gap: 9px;

          color: rgba(86, 3, 25, 0.43);

          font-family:
            "DM Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.16em;

          text-transform: uppercase;

          opacity: 0;

          animation:
            marketplace-copy-in
            700ms
            1.15s
            forwards;
        }

        .marketplace-editorial__index-line {
          display: block;

          width: 28px;
          height: 1px;

          background: currentColor;
        }

        /* --------------------------------
           ANIMATIONS
        -------------------------------- */

        @keyframes marketplace-title-in {
          from {
            transform: translateY(115%);
          }

          to {
            transform: translateY(0);
          }
        }

        @keyframes marketplace-main-reveal {
          from {
            clip-path:
              inset(
                0 100% 0 0
                round clamp(24px, 3.15vw, 46px)
              );
          }

          to {
            clip-path:
              inset(
                0 0 0 0
                round clamp(24px, 3.15vw, 46px)
              );
          }
        }

        @keyframes marketplace-secondary-reveal {
          from {
            clip-path:
              inset(
                0 0 0 100%
                round clamp(25px, 3.2vw, 46px)
              );
          }

          to {
            clip-path:
              inset(
                0 0 0 0
                round clamp(25px, 3.2vw, 46px)
              );
          }
        }

        @keyframes marketplace-copy-in {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marketplace-heading-in {
          from {
            transform: translateY(115%);
          }

          to {
            transform: translateY(0);
          }
        }

        /* --------------------------------
           TABLET
        -------------------------------- */

        @media (max-width: 900px) {
          .marketplace-editorial {
            height: auto;
            min-height: 100svh;

            padding: 28px 24px 52px;

            overflow: visible;
          }

          .marketplace-editorial__title {
            position: relative;

            top: auto;
            left: auto;

            font-size: clamp(72px, 15vw, 124px);
          }

          .marketplace-editorial__main-image {
            position: relative;

            top: auto;
            left: auto;

            width: 68%;
            height: 390px;

            min-height: 0;

            margin-top: 14px;
            margin-left: auto;
          }

          .marketplace-editorial__intro {
            position: relative;

            top: auto;
            left: auto;

            width: 31%;

            margin-top: -250px;

            padding-right: 20px;
          }

          .marketplace-editorial__eyebrow {
            margin-bottom: 52px;
          }

          .marketplace-editorial__side-panel {
            position: relative;

            top: auto;
            left: auto;

            width: 56%;
            max-width: none;

            margin-top: 140px;
            margin-left: auto;
          }

          .marketplace-editorial__secondary-image {
            height: 210px;
          }

          .marketplace-editorial__index {
            display: none;
          }
        }

        /* --------------------------------
           MOBILE
        -------------------------------- */

        @media (max-width: 620px) {
          .marketplace-editorial {
            padding: 22px 16px 44px;
          }

          .marketplace-editorial__title {
            font-size: clamp(62px, 21vw, 96px);

            letter-spacing: -0.04em;
          }

          .marketplace-editorial__main-image {
            width: 100%;

            height: min(70vw, 330px);

            margin-top: 18px;

            border-radius: 27px;
          }

          .marketplace-editorial__intro {
            width: 100%;

            margin-top: 29px;

            padding: 0;

            display: grid;

            grid-template-columns:
              1fr
              1.25fr;

            gap: 28px;
          }

          .marketplace-editorial__eyebrow {
            margin: 0;
          }

          .marketplace-editorial__products-button {
            margin-top: 0;
          }

          .marketplace-editorial__side-panel {
            width: 100%;

            margin-top: 48px;
          }

          .marketplace-editorial__secondary-image {
            height: min(51vw, 245px);

            border-radius: 27px;
          }

          .marketplace-editorial__side-copy {
            padding-top: 22px;
          }

          .marketplace-editorial__heading {
            font-size: clamp(42px, 11vw, 58px);
          }

          .marketplace-editorial__description {
            max-width: 88%;

            margin-top: 22px;
          }

          .marketplace-editorial__eyebrow,
          .marketplace-editorial__detail,
          .marketplace-editorial__description {
            font-size: 11px;
            line-height: 1.48;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marketplace-editorial__title-word,
          .marketplace-editorial__main-image,
          .marketplace-editorial__secondary-image,
          .marketplace-editorial__intro > *,
          .marketplace-editorial__heading,
          .marketplace-editorial__description,
          .marketplace-editorial__index {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
          }

          .marketplace-editorial__photo {
            transition: none;
          }

          .marketplace-editorial__products-button {
            transition: none;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="marketplace-editorial"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        aria-label="Marketplace"
      >
        {/* Main editorial heading */}
        <h1 className="marketplace-editorial__title">
          <span className="marketplace-editorial__title-line">
            <span className="marketplace-editorial__title-word">
              Marketplace
            </span>
          </span>

          <span className="marketplace-editorial__title-line">
            <span
              className="marketplace-editorial__title-word"
              style={{
                fontSize: "clamp(3.2rem, 6.5vw, 6.5rem)",
              }}
            >
              for curated gifts
            </span>
          </span>
        </h1>

        <div className="marketplace-editorial__intro">
          <p className="marketplace-editorial__eyebrow">
            MARKET PLACE
          </p>

          <button
            type="button"
            className="marketplace-editorial__products-button"
            onClick={handleViewProducts}
            aria-label="View products"
          >
            <img
              src="/images/red-button.png"
              alt=""
              aria-hidden="true"
            />

            <span>
              View
              <br />
              Products 🠇 
            </span>
          </button>
        </div>

        {/* Main marketplace image */}
        <figure className="marketplace-editorial__main-image">
          <img
            className="
              marketplace-editorial__photo
              marketplace-editorial__main-photo
            "
            src={MAIN_IMAGE}
            alt="A selection of thoughtful gifts"
            loading="eager"
            onError={handleImageError}
          />
        </figure>

        {/* Right editorial content */}
        <aside className="marketplace-editorial__side-panel">
          <figure className="marketplace-editorial__secondary-image">
            <img
              className="
                marketplace-editorial__photo
                marketplace-editorial__secondary-photo
              "
              src={SECONDARY_IMAGE}
              alt="A warm and elegant gift setting"
              loading="eager"
              onError={handleImageError}
            />
          </figure>

          <div className="marketplace-editorial__side-copy">
            <div className="marketplace-editorial__heading-mask">
              <h2 className="marketplace-editorial__heading">
                Find something
                <br />
                special for
                <br />
                someone special.
              </h2>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

export default WelcomeSection;

