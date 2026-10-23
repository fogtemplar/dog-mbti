"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 mb-4"
      >
        ← 돌아가기
      </button>

      <h1 className="text-xl font-black mb-6">
        <span className="bg-gradient-to-r from-[#E879A4] to-[#C084FC] bg-clip-text text-transparent">
          개인정보처리방침
        </span>
      </h1>

      <div className="space-y-4">
        <Section title="제1조 (수집하는 개인정보)">
          <p className="mb-2">
            너는내운멍(이하 &quot;서비스&quot;)은 다음과 같은 정보를 수집합니다.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>반려견 이름, 견종</li>
            <li>반려견 사진 (선택)</li>
            <li>토스 로그인 사용자 이름, 서비스별 사용자 식별키(userKey)</li>
            <li>보호자 MBTI (선택)</li>
            <li>테스트 응답 결과</li>
            <li>인앱결제 주문번호, 상품 SKU, 결제·지급·환불 상태</li>
          </ul>
          <p className="mt-2 text-[#E879A4] font-medium">
            반려견 정보와 테스트 기록은 이용자의 기기에 저장됩니다. 토스 로그인
            정보는 암호화된 보안 쿠키와 이 기기의 암호화·서명된 로그인 세션으로 처리하며, 결제 정보는 상품 지급과 구매
            복원을 위해 토스 주문 조회 API로 확인합니다.
          </p>
        </Section>

        <Section title="제2조 (수집 목적)">
          <ul className="list-disc pl-4 space-y-1">
            <li>반려견 성향 분석 결과 제공</li>
            <li>결과 카드 생성 및 공유 기능 지원</li>
            <li>프리미엄 심층 리포트 콘텐츠 제공</li>
            <li>테스트 히스토리 관리</li>
            <li>토스 로그인 유지 및 동일 사용자 확인</li>
            <li>유료 콘텐츠 지급, 구매 복원, 중복 지급 및 환불 확인</li>
          </ul>
        </Section>

        <Section title="제3조 (보유 및 이용 기간)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              토스 로그인 세션은 암호화된 HttpOnly 쿠키와 브라우저 저장소에
              암호화·서명된 인증 토큰 형태로 최대 30일간 보관됩니다. 로그아웃,
              연결 해제 또는 기기 데이터 삭제 시 이 기기에서 즉시 삭제됩니다.
            </li>
            <li>
              이용자가 브라우저 데이터를 삭제하거나, 서비스 내 &quot;기록 삭제&quot;
              기능을 사용하면 즉시 삭제됩니다.
            </li>
            <li>
              공유 링크에 포함된 정보(강아지 이름, 타입, 퍼센트 등)는 URL
              자체에 인코딩되며, 별도의 서버 저장은 없습니다.
            </li>
            <li>
              AccessToken과 RefreshToken은 로그인 처리 중에만 사용하고 별도로
              저장하지 않습니다. 결제 주문 정보는 토스의 보관 정책과 관련 법령상
              의무 보존기간을 따릅니다.
            </li>
          </ol>
        </Section>

        <Section title="제4조 (제3자 제공)">
          서비스는 토스 로그인과 앱인토스 인앱결제를 제공하기 위해 주식회사
          비바리퍼블리카와 필요한 정보를 주고받습니다. 로그인 시 이름과 userKey,
          결제 시 주문번호·상품·상태 정보가 처리되며, 그 밖의 목적으로 제3자에게
          판매하거나 제공하지 않습니다.
        </Section>

        <Section title="제5조 (쿠키 및 분석 도구)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              서비스는 이용 통계 분석을 위해 웹 분석 도구를 사용할 수
              있습니다.
            </li>
            <li>
              수집되는 정보는 익명 처리된 방문 통계(페이지뷰, 체류시간 등)이며,
              개인을 식별할 수 있는 정보는 포함되지 않습니다.
            </li>
          </ol>
        </Section>

        <Section title="제6조 (이용자의 권리)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              이용자는 언제든지 브라우저 설정 또는 서비스 내 기능을 통해
              저장된 데이터를 삭제할 수 있습니다.
            </li>
            <li>
              계정 관리 화면에서 로그아웃, 토스 로그인 연결 해제, 기기 저장 데이터
              삭제를 각각 요청할 수 있습니다.
            </li>
            <li>토스 로그인 연결 해제 시 로그인 세션과 동의 정보가 삭제됩니다.</li>
          </ol>
        </Section>

        <Section title="제7조 (문의처)">
          <p>개인정보 관련 문의사항은 서비스 운영자에게 문의해 주세요.</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>상호: 안단테 랩스(Andante Labs)</li>
            <li>사업자등록번호: 775-12-03327</li>
            <li>이메일: fogtemplar@gmail.com</li>
          </ul>
        </Section>

        <p className="text-[11px] text-gray-400 mt-6">
          시행일: 2026년 8월 1일
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5">
      <h2 className="text-sm font-bold text-[#E879A4] mb-3">{title}</h2>
      <div className="text-xs text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
