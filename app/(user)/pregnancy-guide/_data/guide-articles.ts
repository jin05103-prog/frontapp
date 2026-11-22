import type { GuideArticle } from "@/types/pregnancy-guide/pregnancy-guide.type";

// 첨부 엑셀에서 선별·요약한 초기 화면용 자료입니다. 전체 자료를 수록한 목록은 아닙니다.
// TODO: 백엔드 정보 조회 API 확정 후 page.tsx에서 가져온 응답으로 교체합니다.
export const guideArticles: GuideArticle[] = [
    {
        "id": "benefit-medical-cost",
        "category": "지원 혜택",
        "title": "건강보험 임신·출산 진료비 지원",
        "summary": "임신·출산 관련 진료비를 바우처로 지원하는 제도예요.",
        "sections": [
            {
                "title": "어떤 지원인가요?",
                "content": [
                    "임신·출산 관련 진료 등에 드는 비용을 바우처로 지원합니다."
                ]
            },
            {
                "title": "누가 신청하나요?",
                "content": [
                    "임신·출산이 확인된 건강보험 가입자 또는 피부양자 등이 대상입니다.",
                    "건강보험 자격과 제외 대상 등 세부 조건을 신청 전에 확인해 주세요."
                ]
            },
            {
                "title": "어떻게 신청하나요?",
                "content": [
                    "온라인 또는 방문 신청이 가능합니다.",
                    "국민건강보험공단 1577-1000에서 관련 안내를 받을 수 있습니다."
                ]
            },
            {
                "title": "확인해 주세요",
                "content": [
                    "지원 금액·사용 범위·신청 기간은 담당 기관의 최신 안내를 확인해 주세요."
                ]
            }
        ],
        "source": {
            "name": "보건복지부",
            "url": "https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=999124&bnefType=all&svcId=SD0000007672",
            "file": "임신출산_지원혜택_모음.xlsx",
            "sheet": "혜택목록",
            "rows": "8",
            "collectedAt": "2026.11.16"
        }
    },
    {
        "id": "preparation-nutrition",
        "category": "임신 준비",
        "title": "임신을 준비할 때 알아두면 좋은 영양과 식습관",
        "summary": "임신 전 영양과 식습관, 엽산에 관한 정보를 살펴보세요.",
        "sections": [
            {
                "title": "어떤 내용인가요?",
                "content": [
                    "임신 전 영양과 식습관을 다루는 자료입니다. 비타민과 엽산 관련 내용도 함께 소개합니다."
                ]
            },
            {
                "title": "읽기 전에",
                "content": [
                    "개인별 영양 상태와 복용 중인 제품에 따라 확인할 내용이 달라질 수 있습니다.",
                    "구체적인 복용량과 제품 선택에 관한 내용은 원문과 전문가 상담을 통해 확인해 주세요."
                ]
            }
        ],
        "source": {
            "name": "아이사랑",
            "url": "https://www.childcare.go.kr/?menuno=349",
            "file": "임신준비2.xlsx",
            "sheet": "본문",
            "rows": "14–20"
        }
    },
    {
        "id": "preparation-medication",
        "category": "임신 준비",
        "title": "복용 중인 약이 있다면, 임신 전에 확인하세요",
        "summary": "임신 전 여성과 남성의 약물복용 관련 정보를 모았어요.",
        "sections": [
            {
                "title": "어떤 내용인가요?",
                "content": [
                    "임신 준비 중 약물복용과 만성질환 관련 내용을 다룹니다. 고혈압·당뇨병·갑상샘질환 등으로 치료 중인 경우 확인할 사항도 소개합니다."
                ]
            },
            {
                "title": "상담할 때 확인할 내용",
                "content": [
                    "복용 중인 약과 치료받는 질환을 함께 확인하고, 임신 계획과 관련해 상담할 수 있습니다.",
                    "약의 변경이나 중단 여부는 담당 의료진과 상의해 주세요."
                ]
            }
        ],
        "source": {
            "name": "아이사랑",
            "url": "https://www.childcare.go.kr/?menuno=348",
            "file": "임신준비2.xlsx",
            "sheet": "본문",
            "rows": "9–13"
        }
    },
    {
        "id": "benefit-happy-birth",
        "category": "지원 혜택",
        "title": "출산 관련 서비스 통합 신청, 행복출산",
        "summary": "출산 후 신청할 수 있는 서비스를 한 번에 알아보세요.",
        "sections": [
            {
                "title": "어떤 지원인가요?",
                "content": [
                    "출산 가정에 전국 및 지자체의 출산·양육 서비스를 통합 안내하고 신청을 돕는 서비스입니다."
                ]
            },
            {
                "title": "어떤 서비스가 있나요?",
                "content": [
                    "수집 자료에는 첫만남이용권, 부모급여, 아동수당, 양육수당 등과 관련된 안내가 포함되어 있습니다.",
                    "각 서비스마다 지원 조건과 신청 기한이 다르며, 통합 신청으로 모든 혜택이 자동 지급되는 것은 아닙니다."
                ]
            },
            {
                "title": "신청 전 확인",
                "content": [
                    "출생 신고 후 신청 절차와 거주 지역에서 제공하는 서비스를 공식 안내에서 확인해 주세요."
                ]
            }
        ],
        "source": {
            "name": "행정안전부",
            "url": "https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=593069&bnefType=all&svcId=174000000029",
            "file": "임신출산_지원혜택_모음.xlsx",
            "sheet": "혜택목록",
            "rows": "7",
            "collectedAt": "2026.11.16"
        }
    },
    {
        "id": "pregnancy-weeks",
        "category": "임신 생활",
        "title": "은근히 헷갈리는 임신 주수 계산",
        "summary": "임신 주수와 출산 예정일에 관한 기초 정보를 알아보세요.",
        "sections": [
            {
                "title": "어떤 내용인가요?",
                "content": [
                    "임신 주수를 이해하는 데 도움이 되는 소개 글입니다. 임신 주수 계산에 관한 궁금증을 다룹니다."
                ]
            },
            {
                "title": "기록할 때 참고하세요",
                "content": [
                    "앱에 기록한 주수와 병원에서 안내받은 주수가 다르다면 검진 시 확인한 정보를 함께 살펴보세요.",
                    "이 페이지는 임신 주수나 출산 예정일을 계산·예측하는 기능을 제공하지 않습니다."
                ]
            }
        ],
        "source": {
            "name": "베이비빌리",
            "url": "https://babybilly.app/ko/post/2928",
            "file": "임신준비.xlsx",
            "sheet": "목록",
            "rows": "10"
        }
    },
    {
        "id": "birth-leave",
        "category": "출산 준비",
        "title": "출산전후휴가 기간의 급여 지원",
        "summary": "출산전후휴가와 유산·사산휴가 관련 급여 지원을 알아보세요.",
        "sections": [
            {
                "title": "어떤 지원인가요?",
                "content": [
                    "출산전후휴가 및 유산·사산휴가 기간에 대한 급여 지원입니다."
                ]
            },
            {
                "title": "어떻게 신청하나요?",
                "content": [
                    "온라인 또는 방문 신청으로 안내되어 있습니다. 고용노동부 고객상담센터 1350에서 문의할 수 있습니다."
                ]
            },
            {
                "title": "확인해 주세요",
                "content": [
                    "고용보험 자격, 휴가 기간, 신청 시기와 지급 요건은 공식 안내에서 확인해 주세요."
                ]
            }
        ],
        "source": {
            "name": "고용노동부",
            "url": "https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=758582&bnefType=all&svcId=WII000001460",
            "file": "임신출산_지원혜택_모음.xlsx",
            "sheet": "혜택목록",
            "rows": "5",
            "collectedAt": "2026.11.16"
        }
    },
    {
        "id": "preparation-exercise",
        "category": "임신 준비",
        "title": "임신 전 운동과 체중 관리",
        "summary": "건강한 임신 준비를 위한 운동과 체중 관련 정보를 살펴보세요.",
        "sections": [
            {
                "title": "어떤 내용인가요?",
                "content": [
                    "임신 전 운동과 체중, 비만에 관한 정보를 다룹니다. 임신 준비 과정에서 생활 습관을 살펴볼 때 참고할 수 있습니다."
                ]
            },
            {
                "title": "개인 상태에 맞게 확인하세요",
                "content": [
                    "질환이나 치료 이력이 있는 경우 운동과 체중 관리 계획을 상담할 때 함께 알려주세요.",
                    "구체적인 운동 강도와 체중 목표는 개인 상태에 맞춰 확인해야 합니다."
                ]
            }
        ],
        "source": {
            "name": "아이사랑",
            "url": "https://www.childcare.go.kr/?menuno=350",
            "file": "임신준비2.xlsx",
            "sheet": "본문",
            "rows": "21–23"
        }
    },
    {
        "id": "benefit-parental-leave",
        "category": "지원 혜택",
        "title": "일과 육아를 함께, 육아휴직급여",
        "summary": "육아휴직 중 급여 지원과 신청 방법을 알아보세요.",
        "sections": [
            {
                "title": "어떤 지원인가요?",
                "content": [
                    "임신·양육기에 육아휴직을 사용하는 근로자의 급여를 지원하는 제도입니다."
                ]
            },
            {
                "title": "어떻게 신청하나요?",
                "content": [
                    "온라인 또는 방문 신청으로 안내되어 있습니다. 고용노동부 고객상담센터 1350에서 문의할 수 있습니다."
                ]
            },
            {
                "title": "확인해 주세요",
                "content": [
                    "고용보험 가입 이력과 자녀 요건, 신청 기간에 따라 대상 여부가 달라집니다.",
                    "지급 금액과 지원 기간은 최신 공식 안내에서 확인해 주세요."
                ]
            }
        ],
        "source": {
            "name": "고용노동부",
            "url": "https://plus.gov.kr/portal/benefitV2/benefitTotalSrvcList/benefitSrvcDtl?svcSeq=999029&bnefType=all&svcId=999000000008",
            "file": "임신출산_지원혜택_모음.xlsx",
            "sheet": "혜택목록",
            "rows": "2",
            "collectedAt": "2026.11.16"
        }
    }
];
