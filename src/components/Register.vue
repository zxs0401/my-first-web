<template>
  <div class="register-container">
    <h1>注册账号</h1>
    <div class="register-form">
      <input type="text" v-model="username" placeholder="用户名" />
      <input type="password" v-model="password" placeholder="密码" />
      <input type="password" v-model="confirmPassword" placeholder="确认密码" />
      <button @click="handleRegister">注册</button>
      <p class="login-link">已有账号？<a @click="goToLogin">去登录</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    validateUsername(username) {
      // 用户名长度限制
      if (username.length < 3 || username.length > 20) {
        return '用户名长度应在3-20个字符之间'
      }
      // 用户名格式限制（只允许字母、数字和下划线）
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return '用户名只能包含字母、数字和下划线'
      }
      return null
    },
    handleRegister() {
      if (!this.username || !this.password || !this.confirmPassword) {
        alert('请填写完整信息')
        return
      }

      // 验证用户名格式
      const usernameError = this.validateUsername(this.username)
      if (usernameError) {
        alert(usernameError)
        return
      }

      if (this.password !== this.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }

      // 获取已注册用户列表
      let users = []
      try {
        const storedUsers = localStorage.getItem('registeredUsers')
        users = storedUsers ? JSON.parse(storedUsers) : []
      } catch (e) {
        console.error('Error parsing stored users:', e)
        users = []
      }
      
      // 检查用户名是否已存在
      if (users.some(user => user.username === this.username)) {
        alert('用户名已存在')
        return
      }

      // 添加新用户
      const newUser = {
        username: this.username,
        password: this.password,
        createTime: new Date().toISOString()
      }
      
      users.push(newUser)
      
      // 保存到 localStorage
      try {
        localStorage.setItem('registeredUsers', JSON.stringify(users))
        alert('注册成功')
        this.$router.push('/')
      } catch (e) {
        console.error('Error saving user:', e)
        alert('注册失败，请重试')
      }
    },
    goToLogin() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.register-form {
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

.login-link {
  text-align: center;
  margin-top: 10px;
}

.login-link a {
  color: #42b983;
  cursor: pointer;
  text-decoration: underline;
}
</style> 