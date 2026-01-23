import { useState, useEffect } from 'react';

export const useScroll = (threshold = 50) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > threshold);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return scrolled;
};

//valor de offset 'e usado como uma margem no scroll
export const scrollToElement = (id: string, offset = 25) => {
  const el = document.querySelector(id);
  if (!el) return;

  const y =
    el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};

