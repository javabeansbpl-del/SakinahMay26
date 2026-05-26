  import { FaHandsHelping, FaMosque, FaRegHeart, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../css/AboutUs.css";

const values = [
  {
    icon: <FaRegHeart aria-hidden="true" />,
    title: "Compassion",
    text: "Every initiative is designed to uplift families with dignity and sincere care.",
  },
  {
    icon: <FaMosque aria-hidden="true" />,
    title: "Faith-Centered",
    text: "Our work is guided by Islamic principles, adab, and community responsibility.",
  },
  {
    icon: <FaHandsHelping aria-hidden="true" />,
    title: "Service",
    text: "From guidance to support, we focus on practical help that creates impact.",
  },
  {
    icon: <FaUsers aria-hidden="true" />,
    title: "Unity",
    text: "We bring people together to build a stronger and spiritually grounded ummah.",
  },
];

function AboutUs() {
  return (
    <>
      <Navbar />

      <main className="about-us-page">
        <section className="about-hero">
          <div className="about-hero-overlay" />
          <div className="about-shell about-hero-content">
            <p className="about-badge">Our Story</p>
            <h1>About Sakinah</h1>
            <p>
              Sakinah is a community-first platform helping Muslims access prayer
              times, charitable calculators, and practical Islamic resources in
              one calm, beautiful space.
            </p>
          </div>
        </section>

        <section className="about-intro about-shell">
          <article className="about-intro-card">
            <h2>Who We Are</h2>
            <p>
              We are a dedicated team of builders, educators, and volunteers who
              care deeply about making everyday Islamic needs simple and
              accessible. Our focus is to create digital experiences that are
              spiritually respectful and genuinely useful.
            </p>
          </article>

          <article className="about-intro-card">
            <h2>Our Mission</h2>
            <p>
              To serve the ummah through tools that support ibadah, knowledge,
              and responsible giving. We believe technology should strengthen
              connection—to Allah, to family, and to community.
            </p>
          </article>
        </section>

        <section className="about-values">
          <div className="about-shell">
            <div className="about-heading">
              <h2>Our Core Values</h2>
              <p>
                Principles that shape every feature, every design decision, and
                every step of service.
              </p>
            </div>

            <div className="about-values-grid">
              {values.map((value) => (
                <article key={value.title} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta about-shell">
          <div className="about-cta-card">
            <h2>Let&apos;s Build Benefit Together</h2>
            <p>
              Whether you want to collaborate, support our mission, or share
              feedback—your contribution helps us improve and serve better.
            </p>
            <a href="/joinus" className="about-cta-btn">
              Join Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutUs;