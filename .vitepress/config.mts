import { defineConfig } from 'vitepress'
// import mathjax3 from 'markdown-it-mathjax3';

// const customElements = ['mjx-container'];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kobo",
  description: "kobo dot tssn dot ac dot cn, vitepress refusion.",

  // srcDir: 'src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/tkk3.jpg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: 'src/posts' },
      { text: 'Resume', link: 'src/resume' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gingerbeam' }
    ],

    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: "最近更新时间",
  },
  markdown: {
    math: true
  }
})
