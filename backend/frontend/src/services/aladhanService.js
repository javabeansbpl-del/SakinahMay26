const BASE_URL = "https://api.aladhan.com/v1";

export async function getPrayerTimesByCoords(date, lat, lng, method = 2) {
  const formattedDate = formatDateForAPI(date);

  const res = await fetch(
    `${BASE_URL}/timings/${formattedDate}?latitude=${lat}&longitude=${lng}&method=${method}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch prayer times");
  }

  const data = await res.json();
  return data.data;
}

function formatDateForAPI(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
