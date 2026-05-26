import { useState, useEffect } from "react";
import { getPrayerTimesByCoords } from "../services/aladhanService";

export function usePrayerTimes(date, coords) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords) return;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await getPrayerTimesByCoords(
          date,
          coords.lat,
          coords.lng
        );
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [date, coords]);

  return { data, loading, error };
}
