# 의료기관 지도 프론트 연결

## 현재 백엔드에 맞춘 부분

`src/app/schema/hospital_schema.py`의 `HospitalVO` 필드명을 그대로 사용합니다.
프론트 타입은 `types/facilities/facilities.type.ts`의 `HospitalVO`에 있습니다.
API 응답 검사가 끝나면 `lib/facilities.ts`의 `toMapFacility`가 지도용 이름·주소·좌표를 꺼냅니다.
상세 카드는 원본 VO의 종별·전화번호·야간 여부를 읽습니다.

현재 VO에는 응급기관 ID, 분만 가능 여부, 병상 수, 원천 갱신 시각, 자료 기준일이 없습니다.
병원을 자동으로 분만 가능 기관으로 분류하거나 다른 기관과 병합하지 않습니다.
마커는 현재 병원 목록의 기본 마커이며 종별 문자열은 상세 화면에 그대로 표시합니다.
실시간 응급실 현황은 응답 DTO가 생길 때 연결할 수 있도록 준비 안내를 표시합니다.

## 환경변수

`.env.local.example`을 참고해 `.env.local`을 설정합니다.

- `NEXT_PUBLIC_KAKAO_MAP_KEY`: 카카오 JavaScript 키
- `NEXT_PUBLIC_BACKEND_URL`: FastAPI 기본 주소
- `NEXT_PUBLIC_HOSPITALS_API_PATH`: 구현이 완료된 병원 목록 API의 `/`로 시작하는 상대 경로

현재 백엔드 `map_api.py`에는 조회 함수가 없고 라우터도 등록되지 않았습니다.
병원 목록 경로를 임의로 지정하지 않으며, 주소·경로가 설정되기 전에는 fetch를 실행하지 않습니다.
카카오 개발자 설정에는 실제 프론트 실행 도메인을 등록해야 합니다.
키나 경로를 바꾸면 Next 개발 서버를 재시작합니다.
공공데이터포털 인증키는 추후 백엔드 환경변수에 저장합니다.

## 응답 처리

외형은 백엔드 `common_schema.py`의 `ApiResponseDTO`에 맞춥니다.
`data`가 `HospitalVO[]`이면 배열을 읽고, `PageResponseDTO<HospitalVO>`이면 `items`를 읽습니다.
페이지 응답은 현재 받은 항목만 표시합니다. 다음 페이지 조회 매개변수는 실제 API가 정해진 후 연결해야 합니다.
`data: null`이나 VO와 다른 항목은 오류로 표시합니다.
백엔드에 없는 `fetched_at`·`hpid` 등의 필드를 필수로 요구하지 않습니다.

현재 지도 범위에 해당하는 기관은 받은 목록에서 프론트가 걸러냅니다.
병원 조회 결과는 React Query가 5분 동안 보관하고, 새로고침 버튼은 API를 다시 요청합니다.

## 좌표 관련 확인 필요

현재 백엔드 모델은 좌표를 `Integer`, VO는 `int`로 선언합니다.
프론트에서는 전달받은 좌표를 그대로 사용하며 소수점을 추정하거나 보정하지 않습니다.
좌표가 정수로만 전달되면 위치 정확도 확인 안내를 표시합니다.
정확한 좌표 보존을 위한 백엔드 자료형 변경은 이번 작업에 포함하지 않습니다.
