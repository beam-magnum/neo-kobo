<script setup>
import { ref, computed } from 'vue'
import { data as posts } from './posts.data.ts'

// 排序文章，按照倒序排列
const sortedPosts = computed(() => {
  return [...posts].sort((a, b) => parseInt(b.url.replace('.html', '')) - parseInt(a.url.replace('.html', '')))
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}
</script>

<template>
  <div class="blog-posts-container">
    <div class="content">
      <h1 class="title">All Posts</h1>
      <ul class="posts-list">
        <li v-for="post in sortedPosts" :key="post.url" class="post-item">
          <a :href="post.url" class="post-link">{{ post.frontmatter.title }}</a>
          <span class="post-date"> on {{ formatDate(post.frontmatter.date) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.blog-posts-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
}

.content {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.title {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.posts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  margin: 15px 0;
  padding: 10px;
}

.post-link {
  font-size: 1.2em;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
  margin-right: 10px;
}

.post-link:hover {
  color: #0056b3;
}

.post-date {
  color: #777;
  font-size: 0.9em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 15px;
  }

  .title {
    font-size: 2em;
  }

  .post-item {
    margin: 10px 0;
  }

  .post-link {
    font-size: 1em;
  }

  .post-date {
    font-size: 0.8em;
  }
}
</style>