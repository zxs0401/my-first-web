<template>
  <div id="app">
    <nav v-if="isLoggedIn" class="nav-menu">
      <router-link to="/training">训练计划</router-link>
      <router-link to="/diet">饮食管理</router-link>
      <router-link to="/body">身体数据</router-link>
      <div class="user-info">
        <span>{{ currentUser }}</span>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      currentUser: ''
    }
  },
  created() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    this.currentUser = localStorage.getItem('currentUser') || ''
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('currentUser')
      this.isLoggedIn = false
      this.currentUser = ''
      this.$router.push('/')
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.nav-menu {
  padding: 20px;
  background-color: #f8f9fa;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.nav-menu a {
  color: #2c3e50;
  text-decoration: none;
  padding: 5px 15px;
}

.nav-menu a.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}

.logout-btn {
  padding: 5px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
}

.logout-btn:hover {
  background-color: #c82333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info span {
  color: #2c3e50;
}
</style>
