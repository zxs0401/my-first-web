<template>
  <div class="login-container">
    <h1>训练计划管理系统</h1>
    <div class="login-form">
      <input type="text" v-model="username" placeholder="用户名" />
      <input type="password" v-model="password" placeholder="密码" />
      <button @click="handleLogin">登录</button>
      <p class="register-link">还没有账号？<a @click="goToRegister">去注册</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        alert('请输入用户名和密码')
        return
      }

      // 从 localStorage 获取注册用户列表
      let users = []
      try {
        const storedUsers = localStorage.getItem('registeredUsers')
        users = storedUsers ? JSON.parse(storedUsers) : []
      } catch (e) {
        console.error('Error parsing stored users:', e)
        users = []
      }

      // 验证用户
      const user = users.find(u => 
        u.username === this.username &&
        u.password === this.password
      )

      if (user) {
        // 保存登录状态
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('currentUser', user.username)
        localStorage.setItem('lastLoginTime', new Date().toISOString())
        
        this.$router.push('/training')
        window.location.reload()
      } else {
        alert('用户名或密码错误')
      }
    },
    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
  margin-top: 30px;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3aa876;
}

.register-link {
  text-align: center;
  margin-top: 10px;
}

.register-link a {
  color: #42b983;
  cursor: pointer;
  text-decoration: underline;
}
</style>
