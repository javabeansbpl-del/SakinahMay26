import { useState, useEffect } from "react";
import "../css/Home.css";

function Calendar({
  selectedDate,
  onDateChange,
  highlightDates = [],
  highlightRange = null,
}) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  const today = new Date();

  /* ---------------- SYNC MONTH WITH SELECTED DATE ---------------- */
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    }
  }, [selectedDate]);

  /* ---------------- HIJRI CONVERSION ---------------- */

  const hijriMonths = [
    "Muharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Jumada al-Awwal",
    "Jumada al-Thani",
    "Rajab",
    "Shaban",
    "Ramadan",
    "Shawwal",
    "Dhul Qadah",
    "Dhul Hijjah",
  ];

  const gregorianMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const gregorianToHijri = (date) => {
    const formatter = new Intl.DateTimeFormat(
      "en-TN-u-ca-islamic",
      {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }
    );

    const parts = formatter.formatToParts(date);

    const hDay = parseInt(
      parts.find((p) => p.type === "day").value
    );
    const hMonth = parseInt(
      parts.find((p) => p.type === "month").value
    );
    const hYear = parseInt(
      parts.find((p) => p.type === "year").value
    );

    return { day: hDay, month: hMonth, year: hYear };
  };

  const formatDate = (date, isHijri = false) => {
    if (isHijri) {
      const hijri = gregorianToHijri(date);
      return `${hijri.day} ${
        hijriMonths[hijri.month - 1]
      } ${hijri.year}`;
    } else {
      return `${date.getDate()} ${
        gregorianMonths[date.getMonth()]
      } ${date.getFullYear()}`;
    }
  };

  /* ---------------- GENERATE CALENDAR GRID ---------------- */

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();
    const prevMonthDays = new Date(
      year,
      month,
      0
    ).getDate();

    const days = [];

    // Previous month filler
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      days.push({ date, isOtherMonth: true });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isOtherMonth: false });
    }

    // Next month filler
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isOtherMonth: true });
    }

    setCalendarDays(days);
  };

  /* ---------------- NAVIGATION ---------------- */

  const prevMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const goToToday = () => {
    const today = new Date();
    onDateChange(today);
  };

  /* ---------------- RENDER ---------------- */

  const hijriMonthPreview = gregorianToHijri(
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      15
    )
  );

  const isTodaySelected =
    selectedDate.toDateString() ===
    today.toDateString();

  return (
    <section className="calender-container">
      <div className="calendar-container">
        <div className="header">
          <div className="month-nav">
            <button
              className="nav-btn"
              onClick={prevMonth}
            >
              ‹
            </button>

            <div className="month-display">
              <div className="gregorian-month">
                {
                  gregorianMonths[
                    currentDate.getMonth()
                  ]
                }{" "}
                {currentDate.getFullYear()}
              </div>
              <div className="hijri-month">
                {
                  hijriMonths[
                    hijriMonthPreview.month - 1
                  ]
                }{" "}
                {hijriMonthPreview.year}
              </div>
            </div>

            <button
              className="nav-btn"
              onClick={nextMonth}
            >
              ›
            </button>
          </div>

          <div className="selected-date-box">
            <div className="selected-label">
              Selected Date
            </div>
            <div className="selected-gregorian">
              {formatDate(selectedDate)}
            </div>
            <div className="selected-hijri">
              {formatDate(selectedDate, true)}
            </div>
          </div>
        </div>

        <div className="calendar-body">
          <div className="day-headers">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((d) => (
              <div key={d} className="day-header">
                {d}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((dayObj, index) => {
              const date = dayObj.date;

              const hijriDate =
                gregorianToHijri(date);

              const isTodayDate =
                date.toDateString() ===
                today.toDateString();

              const isSelected =
                date.toDateString() ===
                selectedDate.toDateString();

              const isHighlighted =
                highlightDates.some(
                  (d) =>
                    d.toDateString() ===
                    date.toDateString()
                );

              const isInRange =
                highlightRange &&
                date >= highlightRange.start &&
                date <= highlightRange.end;

              return (
                <div
                  key={index}
                  className={`calendar-day
                    ${
                      dayObj.isOtherMonth
                        ? "other-month"
                        : ""
                    }
                    ${
                      isTodayDate
                        ? "today"
                        : ""
                    }
                    ${
                      isSelected
                        ? "selected"
                        : ""
                    }
                    ${
                      isHighlighted
                        ? "highlighted"
                        : ""
                    }
                    ${
                      isInRange
                        ? "range-highlight"
                        : ""
                    }
                  `}
                  onClick={() =>
                    onDateChange(date)
                  }
                >
                  <div className="gregorian-date">
                    {date.getDate()}
                  </div>
                  <div className="hijri-date">
                    {hijriDate.day}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="footer">
            <button
              className={`today-btn ${
                !isTodaySelected
                  ? "active"
                  : ""
              }`}
              onClick={goToToday}
            >
              Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Calendar;
