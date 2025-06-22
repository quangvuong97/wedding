import { useState, useEffect, useRef, useCallback } from "react";

export interface ApiResponse<T> {
  code: number;
  statusCode: number;
  message: string;
  data: T;
  totalElements?: number;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Simple in-memory cache
const fetchCache = new Map<string, any>();

const getCacheKey = (url: string, options?: RequestInit) => {
  return JSON.stringify({ url, options });
};

const useFetch = <T = any>(path: string, options?: RequestInit) => {
  const [response, setResponse] = useState<ApiResponse<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const cacheKey = getCacheKey(new URL(path, API_URL).toString(), options);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const url = new URL(path, API_URL).toString();
    try {
      if (fetchCache.has(cacheKey)) {
        setResponse(fetchCache.get(cacheKey));
        setLoading(false);
        return;
      }
      const res = await fetch(url, { ...options, signal: controller.signal });
      const json = await res.json();
      if (json.error || json.statusCode < 200 || json.statusCode > 200) {
        setError(json);
        return;
      }
      setResponse(json);
      setLoading(false);
      fetchCache.set(cacheKey, json);
    } catch (err: any) {
      // Nếu lỗi mạng, wrap lại object lỗi mặc định
      const errorRes: ApiResponse<T> = {
        code: 500,
        statusCode: 500,
        message: err?.message || "Unknown error",
        data: null as any,
        totalElements: 0,
      };
      setResponse(errorRes);
      setError(err);
    }
  }, [cacheKey, path, options]);

  useEffect(() => {
    fetchData();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchCache.delete(cacheKey);
    fetchData();
  }, [cacheKey, fetchData]);

  return { response, loading, error, refetch };
};

export default useFetch;
