import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const useLoadingIndicator = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      NProgress.start();
    };
    const handleStop = () => {
      setLoading(false);
      NProgress.done();
    };

    handleStart();

    const handleComplete = () => {
      handleStop();
    };

    const timer = setTimeout(handleComplete, 300);

    return () => {
      clearTimeout(timer);
      handleStop();
    };
  }, [pathname, searchParams]);

  return loading;
};

export default useLoadingIndicator;
