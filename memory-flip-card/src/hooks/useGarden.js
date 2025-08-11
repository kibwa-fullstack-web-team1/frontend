import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchGardenItems, updateGardenItemPosition } from '../api/gardenApi';
import debounce from 'lodash.debounce';

export const useGarden = (userId) => {
  const [placedItems, setPlacedItems] = useState([]); // 배치된 아이템
  const [inventoryItems, setInventoryItems] = useState([]); // 인벤토리 아이템

  // 디바운스된 API 호출 함수를 useRef에 저장
  const debouncedUpdateRef = useRef(null);

  // 초기 데이터 로드
  useEffect(() => {
    if (userId) {
      fetchGardenItems(userId).then(({ placedItems, inventoryItems }) => {
        setPlacedItems(placedItems);
        setInventoryItems(inventoryItems);
      });
    }
  }, [userId]);

  // 컴포넌트 마운트 시 디바운스 함수 생성
  useEffect(() => {
    // placedItems와 inventoryItems 모두를 참조할 수 있도록 수정
    const allItems = [...placedItems, ...inventoryItems]; 
    debouncedUpdateRef.current = debounce((id, left, top, type) => {
      const itemToUpdate = allItems.find(item => item.id === id && item.type === type);
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
  }, [userId, placedItems, inventoryItems]); // placedItems 또는 inventoryItems가 변경될 때마다 재생성

  const moveItem = useCallback((id, left, top, type) => {
    let itemMoved = false;

    // 배치된 아이템 목록에서 이동
    setPlacedItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id && item.type === type) {
          itemMoved = true;
          return { ...item, left, top };
        }
        return item;
      });
      return updatedItems;
    });

    // 인벤토리 아이템 목록에서 이동 (새롭게 배치되는 경우)
    if (!itemMoved) {
      setInventoryItems((prevItems) => {
        const itemToPlace = prevItems.find(item => item.id === id && item.type === type);
        if (itemToPlace) {
          itemMoved = true;
          setPlacedItems((prevPlaced) => [...prevPlaced, { ...itemToPlace, left, top }]);
          return prevItems.filter(item => !(item.id === id && item.type === type));
        }
        return prevItems;
      });
    }
    
    // 디바운스된 함수 호출
    if (debouncedUpdateRef.current && itemMoved) {
      debouncedUpdateRef.current(id, left, top, type);
    }
  }, [userId]); // userId 의존성 추가

  return { placedItems, inventoryItems, moveItem };
};