import { useCallback, useEffect, useRef, useState } from 'react';

import { AlertStack } from '@/core/components/ui/alert-stack';
import { subscribeToAlerts } from '@/core/services/alertService';

const MAX_VISIBLE_ALERTS = 4;

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAlerts((alert) => {
      setAlerts((current) => {
        const duplicate = current.find(
          (item) =>
            item.type === alert.type &&
            item.title === alert.title &&
            item.message === alert.message
        );
        if (duplicate) return current;
        const next = [...current, alert];
        const removed = next.slice(0, Math.max(0, next.length - MAX_VISIBLE_ALERTS));
        removed.forEach((item) => {
          const timer = timers.current.get(item.id);
          if (timer) window.clearTimeout(timer);
          timers.current.delete(item.id);
        });
        return next.slice(-MAX_VISIBLE_ALERTS);
      });

      if (alert.duration > 0) {
        const timer = window.setTimeout(() => dismiss(alert.id), alert.duration);
        timers.current.set(alert.id, timer);
      }
    });

    const activeTimers = timers.current;
    return () => {
      unsubscribe();
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      activeTimers.clear();
    };
  }, [dismiss]);

  return (
    <>
      {children}
      <AlertStack alerts={alerts} onDismiss={dismiss} />
    </>
  );
}
