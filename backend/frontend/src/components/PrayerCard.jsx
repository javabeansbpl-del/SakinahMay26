import { useState, useEffect, useMemo } from "react";
import "../css/Home.css";
import { useLocation } from "../hooks/useLocation"; 
import { usePrayerTimes } from "../hooks/usePrayerTimes";

function PrayerCard({ selectedDate }) {
  const { coords } = useLocation();

  const [manualCoords, setManualCoords] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [countdown, setCountdown] = useState("");
  const [nextPrayerName, setNextPrayerName] = useState(null);

  const activeCoords = manualCoords || coords;

  const { data, loading, error } = usePrayerTimes(
    selectedDate,
    activeCoords
  );

  /* ---------------- NEXT PRAYER LOGIC ---------------- */

  const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const nextPrayer = useMemo(() => {
    if (!data) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let name of prayerOrder) {
      const [h, m] = data.timings[name]
        .split(":")
        .map(Number);

      const minutes = h * 60 + m;

      if (minutes > currentMinutes) {
        return { name, time: data.timings[name] };
      }
    }

    return null;
  }, [data]);

  useEffect(() => {
    if (!nextPrayer) return;

    setNextPrayerName(nextPrayer.name);

    let interval;

    const updateCountdown = () => {
      const now = new Date();
      const [h, m] = nextPrayer.time
        .split(":")
        .map(Number);

      const target = new Date();
      target.setHours(h, m, 0, 0);

      let diff = target - now;

      if (diff <= 0) {
        setCountdown("It's time!");
        clearInterval(interval);
        return;
      }

      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setCountdown(`in ${hrs}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer]);

  /* ---------------- MANUAL CITY SEARCH ---------------- */

  const searchLocation = async () => {
    if (!locationInput.trim()) return;

    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${locationInput}&country=India&method=2`
      );

      const result = await res.json();

      const lat = result.data.meta.latitude;
      const lng = result.data.meta.longitude;

      setManualCoords({ lat, lng });
    } catch (err) {
      console.log("City search failed:", err);
    }
  };

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return (
      <section className="prayer-card-container">
        <div className="container">Loading prayer times...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="prayer-card-container">
        <div className="container">Error: {error}</div>
      </section>
    );
  }

  if (!data) return null;

  const { timings, date, meta } = data;

  return (
    <section className="prayer-card-container">
      <div className="container">
        <div className="topcontainer">
          <div className="leftside">
            <p className="miniheading">Prayer Times in</p>
            <h1>
              {meta?.timezone || "Detected Location"}
            </h1>
          </div>

          <div className="rightside">
            <div id="gregorianDate">
              {date.gregorian.weekday.en},{" "}
              {date.gregorian.date}{" "}
              {date.gregorian.month.en}{" "}
              {date.gregorian.year}
            </div>

            <div id="hijriDate">
              {date.hijri.date}{" "}
              {date.hijri.month.en}{" "}
              {date.hijri.year}
            </div>
          </div>
        </div>

        <div className="bottomcontainer">
          <div className="search-box">
            <input
              type="text"
              placeholder="Type your city"
              value={locationInput}
              onChange={(e) =>
                setLocationInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && searchLocation()
              }
            />
            <button onClick={searchLocation}>
              Search
            </button>
          </div>

          <div className="top-info">
            <div className="badge">
              {meta.method.name}
            </div>
            <div className="badge">
              Imsak {timings.Imsak} | Sunrise{" "}
              {timings.Sunrise}
            </div>
          </div>
        </div>

        <div className="times-grid">
          {prayerOrder.map((name) => (
            <div
              key={name}
              className={`card ${
                name === nextPrayerName ? "next" : ""
              }`}
            >
              {name === nextPrayerName && (
                <div className="next-label">
                  Next
                </div>
              )}

              <div>{name}</div>

              <div
                style={{
                  fontSize: "35px",
                  marginTop: "10px",
                }}
              >
                {timings[name]}
              </div>

              {name === nextPrayerName && (
                <div className="countdown">
                  {countdown}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PrayerCard;
