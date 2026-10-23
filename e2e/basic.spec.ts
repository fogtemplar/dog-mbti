import { test, expect } from "@playwright/test";

async function mockLoggedIn(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/api/auth/me")) {
        return Promise.resolve(
          new Response(JSON.stringify({ loggedIn: true, name: "테스트" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
      return originalFetch(input, init);
    };
  });
}

async function mockLoggedOut(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/api/auth/me")) {
        return Promise.resolve(
          new Response(JSON.stringify({ loggedIn: false, name: null }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
      return originalFetch(input, init);
    };
  });
}

async function mockNativeTossLogin(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    let loggedIn = false;
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/api/auth/me")) {
        return Promise.resolve(new Response(JSON.stringify({ loggedIn, name: loggedIn ? "테스트" : null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }));
      }
      if (url.includes("/api/auth/login")) {
        loggedIn = true;
        return Promise.resolve(new Response(JSON.stringify({ ok: true, sessionToken: "test-session-token" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }));
      }
      return originalFetch(input, init);
    };
    Object.defineProperty(window, "ReactNativeWebView", {
      configurable: true,
      value: {
        postMessage(raw: string) {
          const message = JSON.parse(raw) as { bridgeId?: string; body?: { method?: string; eventId?: string } };
          if (message.body?.method !== "appLogin" || !message.body.eventId || !message.bridgeId) return;
          window.setTimeout(() => {
            const emitterMap = (window as unknown as { nativeEmitterMap?: Record<string, { emit: (name: string, value: unknown) => void }> }).nativeEmitterMap;
            emitterMap?.[message.bridgeId!]?.emit(`appLogin-${message.body!.eventId}`, {
              authorizationCode: "test-authorization-code",
              referrer: "SANDBOX",
            });
          }, 0);
        },
      },
    });
  });
}

test("랜딩 페이지가 정상 렌더링된다", async ({ page }) => {
  await mockLoggedOut(page);
  await page.goto("/");
  await expect(page.getByText("우리 강아지 성향 테스트")).toBeVisible();
  await expect(page.getByRole("button", { name: "우리 강아지 성향 알아보기 🐾" })).toHaveCount(1);
  await expect(page.getByText("배너 광고 영역")).toHaveCount(0);
});

test("로그인하지 않으면 보호된 페이지에서 홈으로 돌아간다", async ({ page }) => {
  await mockLoggedOut(page);
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/$/);
});

test("미연동 사용자는 CTA에서 토스 로그인 후 프로필로 이동한다", async ({ page }) => {
  await mockNativeTossLogin(page);
  await page.goto("/");
  await page.getByRole("button", { name: "우리 강아지 성향 알아보기 🐾" }).click();
  await expect(page).toHaveURL(/\/profile\/?$/);
  await expect(page.getByRole("textbox", { name: "예: 홍길동" })).toHaveValue("테스트");
});

test("로그인 사용자는 하나의 CTA로 프로필 페이지에 이동한다", async ({ page }) => {
  await mockLoggedIn(page);
  await page.goto("/");
  await page.getByRole("button", { name: "우리 강아지 성향 알아보기" }).click();
  await expect(page).toHaveURL(/\/profile\/?$/);
  await expect(page.getByText("우리 아이 이름")).toBeVisible();
});

test("이름 입력 후 퀴즈 시작", async ({ page }) => {
  await mockLoggedIn(page);
  await page.goto("/profile");
  await page.getByRole("textbox", { name: "예: 뽀삐, 초코, 콩이" }).fill("콩이");
  await page.getByRole("button", { name: /견종을 선택/ }).click();
  await page.getByRole("button", { name: "말티즈" }).click();
  await page.getByRole("button", { name: /시작하기/ }).click();
  await expect(page).toHaveURL(/\/quiz\/intro\/?$/);
});

test("히스토리 페이지 접근", async ({ page }) => {
  await page.goto("/history");
  await expect(page.getByText("테스트 기록")).toBeVisible();
});

test("sitemap.xml이 존재한다", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
});

test("robots.txt가 존재한다", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
  await expect(page.locator("body")).toContainText("https://dogandme.vercel.app/sitemap.xml");
});

test("20문항 완료 후 서명된 결과 화면으로 이동한다", async ({ page }) => {
  await mockLoggedIn(page);
  await page.goto("/profile");
  await page.getByRole("textbox", { name: "예: 뽀삐, 초코, 콩이" }).fill("콩이");
  await page.getByRole("button", { name: /견종을 선택/ }).click();
  await page.getByRole("button", { name: "말티즈" }).click();
  await page.getByRole("button", { name: /시작하기/ }).click();
  await page.getByRole("button", { name: "시작! 🐶" }).click();

  for (let index = 0; index < 20; index += 1) {
    const choice = page.getByTestId("choice-a");
    await expect(choice).toBeEnabled();
    await choice.click();
  }

  await expect(page).toHaveURL(/\/result\/?\?d=.+&self=1$/, { timeout: 15_000 });
  await expect(page.getByText("분석이 끝났어요!")).toBeVisible();
});

test("약관과 개인정보처리방침에 사업자·결제 정보가 표시된다", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByText("안단테 랩스(Andante Labs)")).toBeVisible();
  await expect(page.getByText("990원입니다.")).toBeVisible();
  await page.goto("/privacy");
  await expect(page.getByText("775-12-03327")).toBeVisible();
  await expect(page.getByText("fogtemplar@gmail.com")).toBeVisible();
});

test("잘못된 공유 결과 링크에 복구 화면을 보여준다", async ({ page }) => {
  await page.goto("/result?d=invalid-payload");
  await expect(page.getByText("유효하지 않은 링크예요")).toBeVisible();
  await expect(page.getByRole("button", { name: "처음부터 다시 하기" })).toBeVisible();
});

test("주요 공개 페이지에 모바일 가로 넘침이 없다", async ({ page }) => {
  for (const path of ["/", "/history", "/terms", "/privacy", "/account"]) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  }
});
