import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard.jsx';

const ProductSlider = ({ title, products, autoSlideInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(2);
  const scrollContainerRef = useRef(null);
  const autoSlideRef = useRef(null);

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(2);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || products.length <= itemsPerView) return;

    autoSlideRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, autoSlideInterval);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isAutoPlaying, maxIndex, autoSlideInterval, products.length, itemsPerView]);

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.offsetWidth || 0;
      const gap = 16; // gap-4 = 16px
      scrollContainerRef.current.scrollTo({
        left: currentIndex * (cardWidth + gap),
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">{title}</h2>
        {products.length > itemsPerView && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="h-8 w-8 rounded-full bg-white border border-pink-200 text-[hsl(340,82%,45%)] flex items-center justify-center shadow-sm hover:bg-pink-50 transition"
              aria-label="Previous products"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="h-8 w-8 rounded-full bg-white border border-pink-200 text-[hsl(340,82%,45%)] flex items-center justify-center shadow-sm hover:bg-pink-50 transition"
              aria-label="Next products"
            >
              →
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {products.map(product => (
          <div key={product._id || product.id} className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;

