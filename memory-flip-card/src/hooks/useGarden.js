import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchGardenItems, updateGardenItemPosition } from '../api/gardenApi';
import debounce from 'lodash.debounce';

export const useGarden = (userId) => {
  const [gardenItems, setGardenItems] = useState([]);

  // 디바운스된 API 호출 함수를 useRef에 저장
  const debouncedUpdateRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchGardenItems(userId).then(setGardenItems);
    }
  }, [userId]);

  // 컴포넌트 마운트 시 디바운스 함수 생성
  useEffect(() => {
    debouncedUpdateRef.current = debounce((id, left, top, type) => {
      const itemToUpdate = gardenItems.find(item => item.id === id && item.type === type);
      if (itemToUpdate) {
        updateGardenItemPosition(userId, itemToUpdate.id, itemToUpdate.type, { left, top });
      }
    }, 500); // 500ms 디바운스

    // 컴포넌트 언마운트 시 디바운스 함수 취소
    return () => {
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current.cancel();
      }
    };
  }, [userId, gardenItems]); // gardenItems가 변경될 때마다 debouncedUpdateRef.current를 재생성

  const moveItem = useCallback((id, left, top, type) => {
    setGardenItems((items) =>
      items.map((item) => (item.id === id && item.type === type ? { ...item, left, top } : item))
    );
    
    // 디바운스된 함수 호출
    if (debouncedUpdateRef.current) {
      debouncedUpdateRef.current(id, left, top, type);
    }
  }, []); // 빈 의존성 배열로 useCallback을 사용하여 moveItem 함수가 한 번만 생성되도록 함

  return { gardenItems, moveItem };
};