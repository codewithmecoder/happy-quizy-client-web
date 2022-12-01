import { useEffect, useRef } from 'react';

const useCheckBackBtn = (fn: any) => {
  const cb = useRef(fn); // init with fn, so that type checkers won't assume that current might be undefined

  useEffect(() => {
    cb.current = fn;
  }, [fn]);

  useEffect(() => {
    const onUnload = (...args: any[]) => cb.current?.(...args);

    window.addEventListener('hashchange', onUnload);

    return () => window.removeEventListener('hashchange', onUnload);
  }, []);
};

export default useCheckBackBtn;
