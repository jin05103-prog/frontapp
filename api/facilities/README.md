# 분만 가능 의료기관 지도

## 병원 종별

원본 CSV의 `종별`을 DB `hospital_type`과 API 응답에 그대로 사용합니다.

- 상급종합병원
- 종합병원
- 병원
- 의원
- 조산원

백엔드 `HospitalTypeEnum`과 프론트 `HOSPITAL_TYPES`가 같은 값을 사용합니다.
SQLAlchemy Enum은 `values_callable`로 영문 멤버 이름 대신 원본 한글 값을 저장합니다.
기존 `OBSTETRICS` / `EMERGENCYROOM` 서비스 구분은 사용하지 않습니다.

## 조회 API

`GET /maps/hospitals` → `ApiResponseDTO<HospitalVO[]>`

종별을 지정하지 않으면 등록된 분만 가능 기관 전체를 반환합니다.
필요한 경우 `hospital_type=의원`처럼 원본 종별로 조회할 수 있습니다.
빈 목록도 `success: true, data: []`로 반환하며 알 수 없는 종별은 HTTP 422입니다.
로그인 없이 공개 의료기관 정보만 조회합니다.

처리 순서는 `map_api.py → HospitalService → HospitalRepository → hospitals`입니다.
응답에는 `id`, 위도·경도, `hospital_type`, 기관명, 주소, 전화번호, 야간 여부가 있습니다.
위도·경도는 JSON 숫자, 야간 여부는 boolean입니다.

## 프론트

`/facilities`에서 목록 전체를 받은 뒤 현재 지도 범위에 있는 기관을 표시합니다.
핀은 32×40 크기이며 아래 꼭짓점을 실제 좌표에 맞춥니다.
지도 확대·축소 중에도 남아 있는 기관의 핀을 재사용합니다.
선택한 기관의 종별·주소·전화번호·야간 여부를 하단에 표시합니다.
위치를 확인할 수 없으면 강남역을 기준으로 표시합니다.

목록 새로고침 버튼, 기관 수 문구, 응급실 현황 기능은 제외했습니다.
API 응답의 로딩·실패·빈 목록 안내는 유지합니다.
응급 상황의 119 안내와 방문 전 기관 확인 안내는 유지합니다.
목록은 React Query에 5분간 보관하며 주기적인 자동 조회는 하지 않습니다.

## 환경변수

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://localhost:10000
NEXT_PUBLIC_HOSPITALS_API_PATH=/maps/hospitals
NEXT_PUBLIC_KAKAO_MAP_KEY=카카오_JavaScript_키
```

카카오 개발자 설정에는 프론트 실행 도메인을 등록합니다.
환경변수 변경이 반영되지 않으면 Next 개발 서버를 재시작합니다.

## 데이터와 테스트

`지도 조인/update_hospital_types.py`는 기존 레코드의 종별만 변경합니다.
기존 ID와 좌표·주소 등 다른 필드를 유지하며 실행 전 CSV 백업을 남깁니다.
`지도 조인/import_hospitals.py`도 원본 종별을 사용합니다.

backapp 환경의 `src` 폴더에서 아래 검사를 실행할 수 있습니다. DB는 수정하지 않습니다.

```powershell
python -m unittest discover -s ../tests -p test_map_api.py -v
```
