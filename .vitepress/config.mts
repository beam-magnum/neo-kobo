import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kobo",
  description: "kobo dot tssn dot ac dot cn, vitepress refusion.",

  // srcDir: 'src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: 'src/posts' },
      { text: 'Resume', link: 'src/resume' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gingerbeam' }
    ]
  }
})
