import { useEffect, useRef } from "react";
import "../css/Home.css";

function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const scrolled = window.pageYOffset;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrolled > sectionTop - window.innerHeight &&
        scrolled < sectionTop + sectionHeight
      ) {
        const offset = (scrolled - sectionTop) * 0.3;
        section.style.backgroundPosition = `center ${offset}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    const paragraphs = sectionRef.current?.querySelectorAll(".paragraph-block");

    paragraphs?.forEach((para) => {
      para.style.transition = "transform 0.3s ease-in-out";
      para.style.willChange = "transform";

      para.addEventListener("mouseenter", () => {
        para.style.transform = "translateX(5px)";
      });

      para.addEventListener("mouseleave", () => {
        para.style.transform = "translateX(0)";
      });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="team-section" ref={sectionRef}>
      <div className="inner-wrapper">
        <div className="grid-layout">
          <div className="text-block">
            <h2 className="title-primary">About Our Team</h2>
            <p className="paragraph-block">
              We are a dedicated team focused on providing accurate Islamic
              guidance and essential calculations. From prayer times to zakat,
              fitra, inheritance, and iddah, we aim to make these services
              easily accessible to everyone.
            </p>
            <p className="paragraph-block">
              Our expertise combines deep understanding of Islamic principles
              with modern tools, ensuring that our users receive precise and
              reliable information in a simple and convenient way.
            </p>
            <p className="paragraph-block">
              We believe in serving our community with integrity and
              transparency, continuously improving our platform to meet the
              evolving needs of Muslims around the world.
            </p>

            <div className="stat-boxes">
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Accurate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Trusted</div>
                <div className="stat-label">Platform</div>
              </div>
            </div>
          </div>

          <div className="visual-block">
            <div className="image-wrapper"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
