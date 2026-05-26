import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaMapMarkerAlt, FaClock, FaMap, FaMosque } from "react-icons/fa";
import "../css/MasajidTimings.css";

const masajid = [
  {
    name: "Mohammadi Masjid",
    image: "/images/mosque6.jpg",
    tagline: "Historic masjid in the heart of old Bhopal",
    address:
      "Barah, Noor Mahal Rd, Khwaspura, Niyamatpura, Shahjahanabad, Bhopal, Madhya Pradesh 462001",
    timings: {
      Fajr: "6:40 am",
      Zuhr: "2:00 pm",
      Asr: "4:30 pm",
      Maghrib: "5:50 pm",
      Isha: "7:30 pm",
      "Juma'ah": "1:30 pm",
    },
  },
  {
    name: "Masjid Jaan Bi Sahiba",
    image: "/images/mosque4.jpg",
    tagline: "Community-centered masjid with serene ambience",
    address:
      "37, Thana Rd, Kali Basti, Peer Gate Area, Bhopal, Madhya Pradesh 462001",
    timings: {
      Fajr: "6:00 am",
      Zuhr: "12:50 pm",
      Asr: "4:15 pm",
      Maghrib: "5:50 pm",
      Isha: "7:20 pm",
      "Juma'ah": "1:30 pm",
    },
  },
];

function MasajidTimings() {
  return (
    <>
      <Navbar />

      <section className="masajid-page">
        <div className="masajid-hero">
          <p className="hero-eyebrow">
            <FaMosque aria-hidden="true" /> Prayer Times
          </p>
          <h1 className="page-title">Masajid Timings — Bhopal</h1>
          <p className="hero-subtitle">
            Stay connected to every salah with a calm, elegant prayer schedule
            designed in Sakinah&apos;s dark-gold theme.
          </p>
        </div>

        <div className="masajid-grid">
          {masajid.map((masjid) => (
            <article className="masjid-card" key={masjid.name}>
              <div className="masjid-image-wrap">
                <img src={masjid.image} alt={masjid.name} className="masjid-image" />
                <div className="masjid-image-overlay">
                  <h2>{masjid.name}</h2>
                  <p>{masjid.tagline}</p>
                </div>
              </div>

              <div className="masjid-content">
                <div className="address-container">
                  <div className="address">
                    <FaMapMarkerAlt />
                    <span>{masjid.address}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      masjid.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                    aria-label={`Open ${masjid.name} on Google Maps`}
                  >
                    <FaMap className="map-icon" title="Open in Google Maps" />
                  </a>
                </div>

                <div className="timings">
                  <h3>
                    <FaClock /> Salah Times
                  </h3>

                  <ul>
                    {Object.entries(masjid.timings).map(([name, time]) => (
                      <li key={name} className={name.includes("Juma") ? "is-jumah" : ""}>
                        <span className="salah-name">{name}</span>
                        <span className="salah-time">{time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default MasajidTimings;