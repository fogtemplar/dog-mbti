import { test, expect } from "@playwright/test";

test("랜딩 페이지가 정상 렌더링된다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("우리 강아지 성향 테스트")).toBeVisible();
  await expect(page.getByText("우리 강아지 성향 알아보기")).toBeVisible();
});

test("프로필 페이지로 이동한다", async ({ page }) => {
  await page.goto("/");
  await page.click("text=우리 강아지 성향 알아보기");
  await expect(page).toHaveURL("/profile");
  await expect(page.getByText("우리 아이 이름")).toBeVisible();
});

test("이름 입력 후 퀴즈 시작", async ({ page }) => {
  await page.goto("/profile");
  await page.fill('input[placeholder*="이름"]', "콩이");
  await page.click("text=시작하기");
  await expect(page).toHaveURL("/quiz/intro");
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
});
