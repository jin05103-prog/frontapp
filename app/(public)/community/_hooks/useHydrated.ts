import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// persist 로 복원되는 로그인 상태를 서버 렌더와 맞추기 위해, 클라이언트 하이드레이션이 끝났는지 알려 줍니다.
export default function useHydrated() {
    return useSyncExternalStore(subscribe, () => true, () => false);
}
