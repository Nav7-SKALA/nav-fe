import { useCallback, useEffect, useRef } from 'react';

type Props = {
  observerRef: HTMLDivElement | null;
  fetchMore: () => void;
  hasMore: boolean;
};

const options: IntersectionObserverInit = {
  threshold: 0.1, // threshold를 낮춰서 더 안정적으로
  rootMargin: '50px', // 50px 여유분을 두어 미리 로딩
};

/*
 * 무한 스크롤링 적용 훅
 * @param observerRef 감시할 element ref
 * @param fetchMore 추가 패치를 실행할 함수
 * @param hasMore 더 패치할 수 있는지 여부
 * @returns
 */

const useInfiniteScrolling = ({ observerRef, fetchMore, hasMore }: Props) => {
  const isFetchingRef = useRef(false);

  // 뷰포트 내에 감시하는 태그가 들어왔다면 패치
  const onScroll: IntersectionObserverCallback = useCallback(
    async (entries) => {
      const entry = entries[0];

      // 교집합이 없거나, 이미 fetching 중이거나, hasMore가 false면 return
      if (!entry.isIntersecting || isFetchingRef.current || !hasMore) {
        return;
      }

      isFetchingRef.current = true;

      try {
        await fetchMore();
      } catch (error) {
        console.error('Error in infinite scroll fetch:', error);
      } finally {
        // 데이터 로딩 완료 후 지연시간을 두어 스크롤 위치와 DOM이 안정화되도록 함
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 300);
      }
    },
    [fetchMore, hasMore]
  );

  useEffect(() => {
    if (!observerRef || !hasMore) return;

    const observer = new IntersectionObserver(onScroll, options);
    observer.observe(observerRef);

    return () => {
      observer.disconnect();
    };
  }, [observerRef, onScroll, hasMore]);

  return;
};

export default useInfiniteScrolling;
