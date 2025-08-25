<template>
	<view class="login-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>

		<!-- 登录表单 -->
		<view class="login-form">
			<view class="logo-section">
				<u-image src="/static/logo.png" width="120" height="120" shape="circle"></u-image>
				<text class="app-title">智能问答</text>
				<text class="app-subtitle">AI助手，智慧解答</text>
			</view>

			<view class="form-section">
				<u-form :model="formData" ref="formRef" label-width="80px" :rules="rules">
					<u-form-item label="用户名" prop="username">
						<u-input v-model="formData.username" placeholder="请输入用户名" :border="false" prefixIcon="account"></u-input>
					</u-form-item>

					<u-form-item label="密码" prop="password">
						<u-input v-model="formData.password" placeholder="请输入密码" :border="false" prefixIcon="lock"
							:password="!showPassword" :suffixIcon="showPassword ? 'eye' : 'eye-off'"
							@suffixIconClick="togglePassword"></u-input>
					</u-form-item>
				</u-form>

				<view class="form-actions">
					<u-button type="primary" text="登录" :loading="loading" @click="handleLogin" shape="circle"
						size="large"></u-button>

					<u-button type="success" text="微信登录" :loading="wxLoading" @click="handleWxLogin" shape="circle" size="large"
						icon="weixin-fill"></u-button>
				</view>

				<view class="register-link">
					<text>还没有账号？</text>
					<u-link text="立即注册" @click="goToRegister"></u-link>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'

	// 响应式数据
	const formRef = ref(null)
	const loading = ref(false)
	const wxLoading = ref(false)
	const showPassword = ref(false)

	const formData = reactive({
		username: '',
		password: ''
	})

	// 表单验证规则
	const rules = {
		username: [{
				required: true,
				message: '请输入用户名',
				trigger: 'blur'
			},
			{
				min: 3,
				max: 20,
				message: '用户名长度在3-20个字符',
				trigger: 'blur'
			}
		],
		password: [{
				required: true,
				message: '请输入密码',
				trigger: 'blur'
			},
			{
				min: 6,
				max: 20,
				message: '密码长度在6-20个字符',
				trigger: 'blur'
			}
		]
	}

	// 切换密码显示
	const togglePassword = () => {
		showPassword.value = !showPassword.value
	}

	// 处理登录
	const handleLogin = async () => {
		try {
			// 表单验证
			const valid = await formRef.value.validate()
			if (!valid) return

			loading.value = true

			// 模拟登录请求
			await new Promise(resolve => setTimeout(resolve, 1500))

			// 登录成功，跳转到首页
			uni.switchTab({
				url: '/pages/home/index'
			})

			uni.showToast({
				title: '登录成功',
				icon: 'success'
			})

		} catch (error) {
			uni.showToast({
				title: '登录失败',
				icon: 'error'
			})
		} finally {
			loading.value = false
		}
	}

	// 处理微信登录
	const handleWxLogin = async () => {
		try {
			wxLoading.value = true

			// 模拟微信登录
			await new Promise(resolve => setTimeout(resolve, 2000))

			// 登录成功，跳转到首页
			uni.switchTab({
				url: '/pages/home/index'
			})

			uni.showToast({
				title: '微信登录成功',
				icon: 'success'
			})

		} catch (error) {
			uni.showToast({
				title: '微信登录失败',
				icon: 'error'
			})
		} finally {
			wxLoading.value = false
		}
	}

	// 跳转到注册页面
	const goToRegister = () => {
		uni.showToast({
			title: '注册功能开发中',
			icon: 'none'
		})
	}
</script>

<style scoped>
	.login-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
		overflow: hidden;
	}

	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		animation: float 6s ease-in-out infinite;
	}

	.circle-1 {
		width: 200rpx;
		height: 200rpx;
		top: 10%;
		right: -50rpx;
		animation-delay: 0s;
	}

	.circle-2 {
		width: 150rpx;
		height: 150rpx;
		top: 60%;
		left: -30rpx;
		animation-delay: 2s;
	}

	.circle-3 {
		width: 100rpx;
		height: 100rpx;
		bottom: 20%;
		right: 20%;
		animation-delay: 4s;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}

	.login-form {
		position: relative;
		z-index: 1;
		padding: 100rpx 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 100vh;
	}

	.logo-section {
		text-align: center;
		margin-bottom: 80rpx;
		animation: fadeInDown 1s ease-out;
	}

	.app-title {
		display: block;
		font-size: 56rpx;
		font-weight: bold;
		color: #fff;
		margin: 30rpx 0 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.app-subtitle {
		display: block;
		font-size: 32rpx;
		color: rgba(255, 255, 255, 0.9);
		letter-spacing: 2rpx;
	}

	.form-section {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24rpx;
		padding: 60rpx 40rpx;
		backdrop-filter: blur(20rpx);
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
		animation: fadeInUp 1s ease-out 0.3s both;
	}

	.form-actions {
		margin-top: 60rpx;
	}

	.form-actions .u-button {
		margin-bottom: 30rpx;
		border-radius: 50rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.form-actions .u-button:active {
		transform: translateY(2rpx);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
	}

	.register-link {
		text-align: center;
		margin-top: 40rpx;
		font-size: 28rpx;
		color: #666;
	}

	.register-link .u-link {
		margin-left: 10rpx;
		color: #667eea;
		font-weight: 500;
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-30rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>