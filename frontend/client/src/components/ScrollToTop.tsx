/**
 * ScrollToTop Component
 * Automatically scrolls to top of page on route changes
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Use instant for immediate scroll, or "smooth" for animated
    });
  }, [location]);

  return null;
}
