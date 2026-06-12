# Antigravity Cookbook Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng website hướng dẫn sử dụng Antigravity IDE & CLI theo dạng Cookbook bằng Next.js và MDX.

**Architecture:** Sử dụng Next.js App Router. Nội dung bài học lưu ở định dạng MDX trong thư mục `/docs` ở root project. Dữ liệu được đọc qua Node `fs` và parse thành React Components bằng `next-mdx-remote`.

**Tech Stack:** Next.js 14, React, MDX (`next-mdx-remote`), `gray-matter` (parse YAML), Vanilla CSS / CSS Modules, Jest (for testing).

---

### Task 1: Khởi tạo dự án và Setup Testing

**Files:**
- Create: `package.json`
- Create: `jest.config.js`
- Test: `__tests__/mdxReader.test.ts`

- [ ] **Step 1: Khởi tạo package.json và cài đặt Dependencies cốt lõi**
```bash
npm init -y
npm install next react react-dom next-mdx-remote gray-matter
npm install -D typescript @types/react @types/node jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest @types/jest
```

- [ ] **Step 2: Cấu hình Jest**
Tạo file `jest.config.js`:
```javascript
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
}
module.exports = createJestConfig(customJestConfig)
```

- [ ] **Step 3: Viết Failing Test cho hàm đọc thư mục MDX**
Tạo file `__tests__/mdxReader.test.ts`:
```typescript
import { getMdxFiles } from '../utils/mdxReader';

describe('MDX Reader', () => {
  it('should return empty array when no docs exist', () => {
    const files = getMdxFiles('dummy-path');
    expect(files).toEqual([]);
  });
});
```

- [ ] **Step 4: Chạy test và đảm bảo fail**
Run: `npx jest __tests__/mdxReader.test.ts`
Expected: FAIL với lỗi "Cannot find module '../utils/mdxReader'"

- [ ] **Step 5: Implement minimal code**
Tạo file `utils/mdxReader.ts`:
```typescript
import fs from 'fs';

export function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
}
```

- [ ] **Step 6: Chạy test và pass**
Run: `npx jest __tests__/mdxReader.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**
```bash
git init
git add package.json jest.config.js __tests__/ utils/
git commit -m "chore: setup project and testing environment"
```

### Task 2: Đọc và Parse MDX (YAML Frontmatter)

**Files:**
- Modify: `utils/mdxReader.ts:6-10`
- Modify: `__tests__/mdxReader.test.ts:10-18`

- [ ] **Step 1: Viết test cho hàm parse Frontmatter**
Thêm nội dung sau vào `__tests__/mdxReader.test.ts`:
```typescript
import { parseMdx } from '../utils/mdxReader';

describe('MDX Parser', () => {
  it('should parse frontmatter correctly', () => {
    const mdxContent = '---\ntitle: "Hello"\n---\n# Content';
    const result = parseMdx(mdxContent);
    expect(result.data.title).toBe('Hello');
    expect(result.content).toBe('# Content');
  });
});
```

- [ ] **Step 2: Chạy test để fail**
Run: `npx jest __tests__/mdxReader.test.ts`
Expected: FAIL với lỗi "parseMdx is not a function"

- [ ] **Step 3: Implement parseMdx**
Thêm import và hàm parseMdx vào `utils/mdxReader.ts`:
```typescript
import matter from 'gray-matter';

export function parseMdx(fileContent: string) {
  const { data, content } = matter(fileContent);
  return { data, content };
}
```

- [ ] **Step 4: Chạy test pass**
Run: `npx jest __tests__/mdxReader.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add __tests__/ utils/
git commit -m "feat: parse mdx frontmatter with gray-matter"
```

### Task 3: Cấu hình Next.js Layout và Styling chuẩn bị

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Khởi tạo file style cơ bản**
Tạo file `app/globals.css`:
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #0f172a; /* Dark mode mặc định */
  color: #f8fafc;
}
```

- [ ] **Step 2: Khởi tạo layout cơ bản của Next.js**
Tạo file `app/layout.tsx`:
```tsx
import './globals.css';

export const metadata = {
  title: 'Antigravity Cookbook',
  description: 'Vibe Coding Cookbook with Antigravity IDE and CLI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Build thử để kiểm tra**
Run: `npx next build`
Expected: Build thành công (có thể báo lỗi thiếu file page.tsx nhưng layout phải hợp lệ).

- [ ] **Step 4: Commit**
```bash
git add app/
git commit -m "feat: setup root layout and base global styles"
```

### Task 4: Xây dựng Dynamic Routing cho MDX Pages (App Router)

**Files:**
- Create: `app/docs/[category]/[slug]/page.tsx`
- Create: `docs/setup/install.mdx`

- [ ] **Step 1: Tạo file MDX mẫu để test**
Tạo file `docs/setup/install.mdx`:
```markdown
---
title: "Hướng dẫn Cài đặt"
category: "setup"
---

# Cài đặt Antigravity IDE

Để cài đặt, hãy sử dụng lệnh sau:
`npm install -g antigravity`
```

- [ ] **Step 2: Tạo trang đọc MDX động**
Tạo file `app/docs/[category]/[slug]/page.tsx`:
```tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import { parseMdx } from '../../../../utils/mdxReader';

export default function DocPage({ params }: { params: { category: string, slug: string } }) {
  const filePath = path.join(process.cwd(), 'docs', params.category, `${params.slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return <h1>404 - Bài viết không tồn tại</h1>;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseMdx(fileContent);

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{data.title || 'Untitled'}</h1>
      <MDXRemote source={content} />
    </article>
  );
}
```

- [ ] **Step 3: Build dự án để sinh ra App Router**
Run: `npx next build`
Expected: Quá trình build hoàn tất mà không có lỗi.

- [ ] **Step 4: Commit**
```bash
git add app/ docs/
git commit -m "feat: add dynamic routes for mdx rendering"
```

### Task 5: Component Hỗ trợ MDX (MDXProvider)

**Files:**
- Create: `components/MDXComponents.tsx`
- Modify: `app/docs/[category]/[slug]/page.tsx`

- [ ] **Step 1: Xây dựng Custom CodeBlock Component**
Tạo file `components/MDXComponents.tsx`:
```tsx
export const mdxComponents = {
  pre: (props: any) => (
    <pre {...props} style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', overflowX: 'auto' }} />
  ),
  code: (props: any) => (
    <code {...props} style={{ fontFamily: 'monospace', color: '#38bdf8' }} />
  )
};
```

- [ ] **Step 2: Tích hợp MDXComponents vào trang đọc**
Sửa file `app/docs/[category]/[slug]/page.tsx` để truyền components:
```tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import { parseMdx } from '../../../../utils/mdxReader';
import { mdxComponents } from '../../../../components/MDXComponents';

export default function DocPage({ params }: { params: { category: string, slug: string } }) {
  const filePath = path.join(process.cwd(), 'docs', params.category, `${params.slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return <h1>404 - Bài viết không tồn tại</h1>;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseMdx(fileContent);

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{data.title || 'Untitled'}</h1>
      <MDXRemote source={content} components={mdxComponents} />
    </article>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add components/ app/
git commit -m "feat: add custom mdx components for styling"
```

### Task 6: Cấu hình GitHub Actions CI/CD (Deploy to GitHub Pages)

**Files:**
- Create: `next.config.js`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Cấu hình Next.js cho Static Export**
Tạo file `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Lưu ý: Nếu deploy vào subfolder (VD: github.com/user/repo), cần bỏ comment dòng dưới
  // basePath: '/repo-name',
}

module.exports = nextConfig
```

- [ ] **Step 2: Tạo workflow GitHub Actions**
Tạo file `.github/workflows/deploy.yml`:
```yaml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm ci
      - name: Build with Next.js
        run: npx next build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Commit cấu hình CI/CD**
```bash
git add next.config.js .github/
git commit -m "ci: setup github actions deployment to pages"
```

---
*Made by Anh Tu - Share to be share*
