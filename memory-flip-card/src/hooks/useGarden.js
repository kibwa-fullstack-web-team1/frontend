import { useState, useEffect, useCallback } from 'react';
import { fetchGardenItems, updateGardenItemPosition } from '../api/gardenApi';

export const useGarden = (userId) => {
  const [placedItems, setPlacedItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // 초기 데이터 로드
  useEffect(() => {
    if (userId) {
      fetchGardenItems(userId).then(({ placedItems, inventoryItems }) => {
        setPlacedItems(placedItems);
        setInventoryItems(inventoryItems);
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [userId]);

  // --- 상태 변경 함수 (API 호출 없음) ---

  const moveItem = useCallback((id, left, top, type) => {
    const itemFromInventory = inventoryItems.find(item => item.id === id && item.type === type);

    if (itemFromInventory) {
      // Case 1: 인벤토리 -> 정원
      setInventoryItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
      setPlacedItems(prev => [...prev, { ...itemFromInventory, left, top }]);
    } else {
      // Case 2: 정원 -> 정원
      setPlacedItems(prev =>
        prev.map(item =>
          item.id === id && item.type === type ? { ...item, left, top } : item
        )
      );
    }
  }, [inventoryItems]);

  const returnItemToInventory = useCallback((id, type) => {
    const itemToReturn = placedItems.find(item => item.id === id && item.type === type);
    if (!itemToReturn) return;

    setPlacedItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
    setInventoryItems(prev => [...prev, { ...itemToReturn, left: null, top: null }]);
  }, [placedItems]);

  // --- 서버 저장 함수 ---

  const saveGardenState = useCallback(async () => {
    console.log('Saving garden state to server...');

    const placedPromises = placedItems.map(item => 
      updateGardenItemPosition(userId, item.id, item.type, { left: item.left, top: item.top })
    );

    const inventoryPromises = inventoryItems.map(item =>
      // 모든 인벤토리 아이템의 위치를 null로 업데이트 (이전에 배치되었든 아니든)
      updateGardenItemPosition(userId, item.id, item.type, { left: null, top: null })
    );

    const allPromises = [...placedPromises, ...inventoryPromises];

    try {
      const results = await Promise.allSettled(allPromises);
      console.log('Save results:', results);
      
      let successCount = 0;
      let failureCount = 0;
      let failedItems = [];

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          failureCount++;
          // 실패한 아이템의 ID나 정보를 여기에 추가할 수 있습니다.
          // result.reason에서 에러 상세 정보를 얻을 수 있습니다.
          failedItems.push(result.reason ? result.reason.message : 'Unknown error');
        }
      });

      if (failureCount === 0) {
        alert('정원 상태가 성공적으로 저장되었습니다!');
      } else if (successCount === 0) {
        alert(`모든 아이템 저장에 실패했습니다.\n오류: ${failedItems.join(', ')}`);
      } else {
        alert(`일부 아이템 저장에 성공했지만, ${failureCount}개의 아이템 저장에 실패했습니다.\n오류: ${failedItems.join(', ')}`);
      }

    } catch (error) {
      console.error('An unexpected error occurred during save:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [placedItems, inventoryItems, userId]);

  const resetGardenLayout = useCallback(async () => {
    if (placedItems.length === 0) {
      alert('정원에 배치된 아이템이 없습니다.');
      return;
    }

    if (!confirm('정원의 모든 아이템을 인벤토리로 되돌리시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    // 모든 배치된 아이템을 인벤토리로 되돌리는 로컬 상태 업데이트
    placedItems.forEach(item => {
      // returnItemToInventory는 이미 로컬 상태를 업데이트하고 API 호출은 하지 않음
      returnItemToInventory(item.id, item.type);
    });

    // 변경된 상태를 서버에 저장
    await saveGardenState();

    alert('정원 레이아웃이 초기화되었습니다.');

  }, [placedItems, returnItemToInventory, saveGardenState]);

  return { placedItems, inventoryItems, moveItem, returnItemToInventory, saveGardenState, resetGardenLayout };
};
