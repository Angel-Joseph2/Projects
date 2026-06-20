import React, { useState, useEffect } from 'react';

export const Loader = () => {
  const [isDone, setIsDone] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsDone(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      setIsRemoved(true);
    }, 2000); // 1.5s delay + 0.5s CSS transition fadeout

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div id="loader" className={isDone ? 'done' : ''}>
      <div className="loader-inner">
        <span className="loader-logo">LUXE</span>
        <div className="loader-bar">
          <div className="loader-fill"></div>
        </div>
      </div>
    </div>
  );
};
