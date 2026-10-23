"use client";

import { useRouter } from "next/navigation";

export default function TermsPage() {
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
          이용약관
        </span>
      </h1>

      <div className="space-y-4">
        <Section title="제1조 (목적)">
          이 약관은 너는내운멍(이하 &quot;서비스&quot;)이 제공하는 반려견 성향 테스트
          및 관련 서비스의 이용 조건과 절차에 관한 사항을 규정함을 목적으로
          합니다.
        </Section>

        <Section title="제2조 (용어의 정의)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              &quot;서비스&quot;란 너는내운멍이 제공하는 반려견 성향 분석 테스트, 결과
              리포트, 프리미엄 심층 리포트 등 일체의 서비스를 말합니다.
            </li>
            <li>
              &quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 자를 말합니다.
            </li>
            <li>
              &quot;너는내운멍 맞춤 심층 리포트&quot;란 반려견의 테스트 결과를
              바탕으로 유료 제공되는 맞춤형 상세 분석 콘텐츠를 말합니다.
            </li>
          </ol>
        </Section>

        <Section title="제3조 (서비스의 내용)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              무료 서비스: 반려견 성향 테스트(20문항), 기본 결과 타입 제공, 결과
              카드 저장 및 공유
            </li>
            <li>
              유료 서비스: 너는내운멍 맞춤 심층 리포트(축별 상세 분석, 상황별
              행동 예측, 맞춤 훈련 팁, 추천 놀이법, 다른 강아지와의 궁합,
              스트레스 시그널, 산책·생활환경 가이드 및 보호자 궁합 분석 등)
            </li>
            <li>
              서비스는 보호자의 관찰을 기반으로 한 재미 해석이며, 수의학적·행동학적 전문 진단이 아닙니다.
            </li>
          </ol>
        </Section>

        <Section title="제4조 (유료 서비스)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              상품명은 &quot;너는내운멍 맞춤 심층 리포트&quot;이며, 판매 가격은
              990원입니다.
            </li>
            <li>
              본 상품은 한 번 구매하면 서비스에서 생성한 맞춤 심층 리포트를
              계속 열람할 수 있는 일회성 비소모성 인앱 상품입니다.
            </li>
            <li>
              결제는 앱인토스 인앱 결제를 통해 이루어지며, 결제 완료 후
              콘텐츠가 즉시 제공됩니다.
            </li>
            <li>
              기기 변경이나 앱 재설치 후에도 구매 내역 확인 및 복원 절차를 통해
              이용 권한을 복구할 수 있습니다.
            </li>
          </ol>
        </Section>

        <Section title="제5조 (결제 및 환불)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              결제 및 환불은 이용자의 운영체제에 따라 Apple App Store 또는
              Google Play와 앱인토스의 인앱 결제 정책을 따릅니다.
            </li>
            <li>
              Android 이용자는 토스 앱의 구매 내역에서 환불을 요청할 수 있으며,
              운영자와 Google Play의 정책 및 판단에 따라 처리됩니다.
            </li>
            <li>
              iOS 이용자의 환불 요청과 승인 여부는 Apple이 정한 절차와 정책에
              따라 Apple에서 처리합니다.
            </li>
            <li>
              결제가 완료되었으나 상품이 지급되지 않은 경우 미결 주문 복원
              절차를 통해 상품을 다시 지급하며, 중복 결제 또는 복원 실패는
              고객센터를 통해 확인할 수 있습니다.
            </li>
            <li>
              환불이 완료되면 해당 구매로 제공된 콘텐츠 이용 권한이 회수될 수
              있습니다.
            </li>
          </ol>
        </Section>

        <Section title="제6조 (면책)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              본 서비스의 결과는 보호자의 주관적 관찰을 기반으로 한 재미
              해석이며, 의학적·훈련적 진단을 대체하지 않습니다.
            </li>
            <li>
              서비스 결과를 근거로 한 반려견 관련 의사결정에 대해 서비스
              제공자는 책임을 지지 않습니다.
            </li>
            <li>
              반려견의 건강이나 행동 문제는 반드시 전문 수의사 또는 행동
              전문가와 상담하시기 바랍니다.
            </li>
          </ol>
        </Section>

        <Section title="제7조 (저작권)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              서비스에서 제공하는 모든 콘텐츠(텍스트, 이미지, 디자인 등)의
              저작권은 서비스 제공자에게 있습니다.
            </li>
            <li>
              이용자는 개인적 용도로 결과를 공유할 수 있으나, 상업적 이용은
              금지됩니다.
            </li>
          </ol>
        </Section>

        <Section title="제8조 (약관의 변경)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              본 약관은 서비스 개선 등을 위해 변경될 수 있으며, 변경 시 서비스
              내 공지합니다.
            </li>
            <li>
              변경된 약관은 공지한 날로부터 효력이 발생합니다.
            </li>
          </ol>
        </Section>

        <Section title="제9조 (사업자 정보)">
          <ul className="list-disc pl-4 space-y-1">
            <li>상호: 안단테 랩스(Andante Labs)</li>
            <li>사업자등록번호: 775-12-03327</li>
            <li>고객문의: fogtemplar@gmail.com</li>
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
