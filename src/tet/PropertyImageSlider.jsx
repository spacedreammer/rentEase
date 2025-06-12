import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";



const PropertyImageSlider = ({ images }) => { // <--- ACCEPT THE 'images' PROP HERE
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add a console.log here to confirm images are received
  useEffect(() => {
    console.log("PropertyImageSlider received images:", images);
    // Reset index if images change (e.g., loading a new house)
    setCurrentIndex(0);
  }, [images]); // Run this effect when the 'images' prop changes

  const goToPrevious = () => {
    // Check if images array is empty to prevent errors
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    // Check if images array is empty to prevent errors
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    // Check if images array is empty to prevent errors
    if (images.length === 0) return;
    setCurrentIndex(index);
  };

  // Auto-slide every 5 seconds - only if images exist
  useEffect(() => {
    let timer;
    if (images && images.length > 1) { // Only auto-slide if there's more than one image
      timer = setInterval(() => {
        goToNext();
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [images, goToNext]); // Depend on images and goToNext to restart timer when images change

  // Add a check for no images to render a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[300px] rounded-md overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500">
        No images available for this property.
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] rounded-md overflow-hidden">
      {/* Background Image */}
      <div
        className="w-full h-full bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}></div> {/* <--- USING THE PROP HERE */}

      {/* Left Arrow */}
      {images.length > 1 && ( // Only show arrows if there's more than one image
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow">
          <FaChevronLeft />
        </button>
      )}

      {/* Right Arrow */}
      {images.length > 1 && ( // Only show arrows if there's more than one image
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow">
          <FaChevronRight />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && ( // Only show dots if there's more than one image
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === i ? "bg-white" : "bg-white/50"
              }`}></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageSlider;