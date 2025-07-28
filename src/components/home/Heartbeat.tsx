import React, { useEffect, useRef, useState } from "react";
import { WeddingPageApi } from "../../services/weddingPage.api";
import { useHomeData } from "../../contexts/HomeDataContext";

const HEARTBEAT_INTERVAL = 15000;
const INACTIVITY_TIMEOUT = 60000;

const Heartbeat: React.FC = () => {
  const homeData = useHomeData();
  const [sessionId, setSessionId] = useState<string | undefined>(() =>
    localStorage.getItem("sessionId") || undefined
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveSessionIdToStorage = (id: string) =>
    localStorage.setItem("sessionId", id);

  const sendHeartbeat = async () => {
    try {
      const data = await WeddingPageApi.heartbeat({ guestId: homeData?.guestSlug, sessionId,  });
      if (data && data !== sessionId) {
        setSessionId(data);
        saveSessionIdToStorage(data);
      }
    } catch (e) {
      console.error("Heartbeat error:", e);
    }
  };

  const startHeartbeatInterval = () => {
    if (!intervalRef.current) {
      sendHeartbeat(); // Gửi ngay khi bắt đầu hoạt động
      intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    }
  };

  const stopHeartbeatInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetInactivityTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      stopHeartbeatInterval();
    }, INACTIVITY_TIMEOUT);
  };

  const handleUserActivity = () => {
    if (!intervalRef.current) {
      startHeartbeatInterval();
    }
    resetInactivityTimeout();
  };

  useEffect(() => {
    // Tạo event listener cho các hành động user tương tác
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    // Khi component unmount, clear interval và timeout
    return () => {
      stopHeartbeatInterval();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return null;
};

export default Heartbeat;
