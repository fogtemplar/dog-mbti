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
            <li>보호자 이름, MBTI (선택)</li>
            <li>테스트 응답 결과</li>
          </ul>
          <p className="mt-2 text-[#E879A4] font-medium">
            위 정보는 서버에 전송·저장되지 않으며, 이용자의 브라우저
            (localStorage)에만 보관됩니다.
          </p>
        </Section>

        <Section title="제2조 (수집 목적)">
          <ul className="list-disc pl-4 space-y-1">
            <li>반려견 성향 분석 결과 제공</li>
            <li>결과 카드 생성 및 공유 기능 지원</li>
            <li>프리미엄 심층 리포트 콘텐츠 제공</li>
            <li>테스트 히스토리 관리</li>
          </ul>
        </Section>

        <Section title="제3조 (보유 및 이용 기간)">
          <ol className="list-decimal pl-4 space-y-1">
            <li>
              모든 데이터는 이용자의 브라우저 localStorage에만 저장되며,
              서비스 서버에는 저장되지 않습니다.
            </li>
            <li>
              이용자가 브라우저 데이터를 삭제하거나, 서비스 내 &quot;기록 삭제&quot;
              기능을 사용하면 즉시 삭제됩니다.
            </li>
            <li>
              공유 링크에 포함된 정보(강아지 이름, 타입, 퍼센트 등)는 URL
              자체에 인코딩되며, 별도의 서버 저장은 없습니다.
            </li>
          </ol>
        </Section>

        <Section title="제4조 (제3자 제공)">
          서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만,
          결제 서비스 이용 시 결제 대행사(PG사)에 결제에 필요한 최소한의
          정보가 전달될 수 있으며, 이는 해당 PG사의 개인정보처리방침에
          따릅니다.
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
              서비스 이용 중단 시 별도의 탈퇴 절차 없이 브라우저 데이터
              삭제만으로 모든 정보가 제거됩니다.
            </li>
          </ol>
        </Section>

        <Section title="제7조 (문의처)">
          <p>
            개인정보 관련 문의사항은 아래 연락처로 문의해 주세요.
          </p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>이메일: [email@example.com]</li>
          </ul>
        </Section>

        <p className="text-[11px] text-gray-400 mt-6">
          시행일: 2025년 2월 15일
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
