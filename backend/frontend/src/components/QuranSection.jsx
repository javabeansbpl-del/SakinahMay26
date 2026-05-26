import { useState, useEffect } from 'react'
import "../css/Home.css"

function QuranSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const translations = [
    '"The mosques of Allah are only to be maintained by those who believe in Allah and the Last Day, establish prayer, give zakah, and fear none but Allah. It is they who are expected to be on true guidance."',
    '"الله کی مسجدوں کو وہی لوگ آباد کرتے ہیں جو الله پر اور قیامت کے دن پر ایمان لائے اور نماز قائم کی اور زکوٰة دی اور الله کے سوا کسی سے نہ ڈرے، تو یہ لوگ ہیں جن سے امید ہے کہ یہ ہدایت پانے والوں میں سے ہوں گے۔"',
    '"अल्लाह की मस्जिदों को केवल वही लोग आबाद करते हैं, जो अल्लाह और आख़िरत के दिन पर ईमान रखते हैं, नमाज़ क़ायम करते हैं, ज़कात अदा करते हैं और अल्लाह के सिवा किसी से नहीं डरते। यही लोग हैं, जिनसे आशा है कि वे सीधे मार्ग पर होंगे।"'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide(1)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide])

  const changeSlide = (direction) => {
    setCurrentSlide((prev) => {
      const newIndex = prev + direction
      if (newIndex >= translations.length) return 0
      if (newIndex < 0) return translations.length - 1
      return newIndex
    })
  }

  return (
    <section className="quran-section">
      <div className="verse-display-box">
        <p className="verse" dir="rtl">
          اِنَّمَا يَعْمُرُ مَسَاجِدَ اللهِ مَنْ اٰمَنَ بِاللهِ وَالْيَوْمِ
          الْاٰخِرِ وَاَقَامَ الصَّلٰوةَ وَاٰتَى الزَّكٰوةَ وَلَمْ يَخْشَ اِلَّا
          اللهَ فَعَسٰٓى اُولٰٓئِكَ اَنْ يَّكُوْنُوْا مِنَ الْمُهْتَدِيْنَ
        </p>
        <span className="verse-source"> Surah At-Tawbah (9:18) </span>
      </div>

      <div className="text-slider-container">
        <div className="text-slider">
          {translations.map((text, index) => (
            <div 
              key={index}
              className={`text-slide ${index === currentSlide ? 'active-text-slide' : ''}`}
            >
              <p className="translation">{text}</p>
            </div>
          ))}
        </div>

        <button className="text-prev-btn" onClick={() => changeSlide(-1)}>❮</button>
        <button className="text-next-btn" onClick={() => changeSlide(1)}>❯</button>
      </div>
    </section>
  )
}

export default QuranSection
