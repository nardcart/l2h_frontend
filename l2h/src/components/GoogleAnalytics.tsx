import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = "G-LGQ7RS5LN2";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };

    const scriptId = `google-tag-${measurementId}`;

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!window.gtag) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_location: window.location.href,
        page_path: `${location.pathname}${location.search}${location.hash}`,
        page_title: document.title,
      });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;
