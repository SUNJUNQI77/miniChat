<template>
	<view class="login-container" :style="{ background: themeStore.themeConfig.backgroundGradient }">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
			<view class="circle circle-4"></view>
			<view class="floating-shapes">
				<view class="shape shape-1"></view>
				<view class="shape shape-2"></view>
				<view class="shape shape-3"></view>
			</view>
			<view class="particles">
				<view class="particle" v-for="i in 20" :key="i"></view>
			</view>
		</view>

		<!-- 登录内容 -->
		<view class="login-content">
			<!-- Logo区域 -->
			<view class="logo-section">
				<view class="logo-container">
					<u-image src="/static/logo.png" width="140" height="140" shape="circle"></u-image>
					<view class="logo-glow"></view>
					<view class="logo-ring"></view>
				</view>
				<text class="app-title">智能问答</text>
				<text class="app-subtitle">AI助手，智慧解答</text>
				<view class="app-features">
					<view class="feature-tag">
						<u-icon name="star" size="18" color="#FFD700"></u-icon>
						<text>智能对话</text>
					</view>
					<view class="feature-tag">
						<u-icon name="shield" size="18" color="#4CAF50"></u-icon>
						<text>安全可靠</text>
					</view>
					<view class="feature-tag">
						<u-icon name="clock" size="18" color="#2196F3"></u-icon>
						<text>24小时在线</text>
					</view>
				</view>
			</view>

			<!-- 登录区域 -->
			<view class="login-section" :style="{ 
				background: themeStore.themeConfig.cardBackgroundTransparent,
				boxShadow: themeStore.themeConfig.shadow
			}">
				<view class="welcome-text">
					<text class="welcome-title" :style="{ color: themeStore.themeConfig.textPrimary }">欢迎使用</text>
					<text class="welcome-desc" :style="{ color: themeStore.themeConfig.textSecondary }">一键登录，开启智能对话之旅</text>
				</view>
				
				<view class="login-actions">
					<!-- 开发调试按钮 -->
					<u-button 
						type="primary" 
						text="开发调试登录" 
						:loading="userStore.loading" 
						@click="handleDevLogin" 
						shape="circle"
						size="large"
						class="dev-login-btn"
						icon="play-circle-fill"
						:style="{ background: themeStore.themeConfig.primaryGradient }"
					></u-button>
					
					<view class="divider">
						<view class="divider-line" :style="{ background: `linear-gradient(90deg, transparent, ${themeStore.themeConfig.textTertiary}, transparent)` }"></view>
						<text class="divider-text" :style="{ color: themeStore.themeConfig.textTertiary }">正式登录方式（已注释）</text>
						<view class="divider-line" :style="{ background: `linear-gradient(90deg, transparent, ${themeStore.themeConfig.textTertiary}, transparent)` }"></view>
					</view>

					<!-- 注释掉的微信一键登录按钮 -->
					<!-- 
					<button 
						class="wx-phone-login-btn"
						open-type="getPhoneNumber"
						@getphonenumber="handleGetPhoneNumber"
						:loading="userStore.loading"
						:disabled="!agreed"
					>
						<u-icon name="weixin-fill" size="20" color="#fff"></u-icon>
						<text>微信一键登录</text>
					</button>
					-->
					
					<!-- 注释掉的微信登录按钮 -->
					<!--
					<u-button 
						type="success" 
						text="微信登录" 
						:loading="userStore.loading" 
						@click="handleWxLogin" 
						shape="circle" 
						size="large"
						icon="weixin-fill"
						class="wx-btn"
						:disabled="!agreed"
					></u-button>
					-->
					
					<!-- 显示注释状态的提示 -->
					<view class="commented-login-tips" :style="{ 
						background: themeStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(153, 153, 153, 0.1)',
						border: `1rpx dashed ${themeStore.themeConfig.textTertiary}`
					}">
						<u-icon name="info-circle" size="16" :color="themeStore.themeConfig.textTertiary"></u-icon>
						<text class="tip-text" :style="{ color: themeStore.themeConfig.textTertiary }">微信登录功能已注释，用于开发调试</text>
					</view>
				</view>

				<view class="agreement-section">
					<view class="agreement-checkbox" @click="toggleAgreement">
						<u-icon 
							:name="agreed ? 'checkmark-circle-fill' : 'checkmark-circle'" 
							size="20" 
							:color="agreed ? themeStore.themeConfig.primary : themeStore.themeConfig.textTertiary"
						></u-icon>
						<text class="agreement-text" :style="{ color: themeStore.themeConfig.textSecondary }">我已阅读并同意</text>
						<text class="agreement-link" :style="{ color: themeStore.themeConfig.primary }">《用户协议》</text>
						<text class="agreement-text" :style="{ color: themeStore.themeConfig.textSecondary }">和</text>
						<text class="agreement-link" :style="{ color: themeStore.themeConfig.primary }">《隐私政策》</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { useUserStore } from '@/stores/user'
	import { useThemeStore } from '@/stores/theme'

	// 使用stores
	const userStore = useUserStore()
	const themeStore = useThemeStore()

	// 响应式数据
	const agreed = ref(false)

	// 切换协议同意状态
	const toggleAgreement = () => {
		agreed.value = !agreed.value
	}

	// 开发调试登录
	const handleDevLogin = async () => {
		if (!agreed.value) {
			uni.showToast({
				title: '请先同意用户协议',
				icon: 'none'
			})
			return
		}

		try {
			// 模拟登录过程
			userStore.loading = true
			
			// 模拟网络延迟
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// 设置模拟用户信息
			const mockUserInfo = {
				name: '开发测试用户',
				avatar: 'https://picsum.photos/200/200?random=1',
				email: 'dev@example.com',
				openid: 'dev_openid_123',
				unionid: 'dev_unionid_123',
				phone: '138****8888',
				isLogin: true
			}
			
			userStore.setUserInfo(mockUserInfo)
			
			uni.showToast({
				title: '开发调试登录成功',
				icon: 'success'
			})
			
			// 延迟跳转，让用户看到成功提示
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/home/index'
				})
			}, 1000)
			
		} catch (error) {
			console.error('开发调试登录错误:', error)
			uni.showToast({
				title: '登录失败',
				icon: 'error'
			})
		} finally {
			userStore.loading = false
		}
	}

	// 注释掉的微信登录方法
	/*
	const handleWxLogin = async () => {
		if (!agreed.value) {
			uni.showToast({
				title: '请先同意用户协议',
				icon: 'none'
			})
			return
		}

		try {
			const success = await userStore.wxLogin()
			
			if (success) {
				// 登录成功，跳转到首页
				uni.navigateTo({
					url: '/pages/home/index'
				})
			}

		} catch (error) {
			console.error('微信登录错误:', error)
		}
	}
	*/

	// 注释掉的微信一键登录获取手机号方法
	/*
	const handleGetPhoneNumber = async (e) => {
		if (!agreed.value) {
			uni.showToast({
				title: '请先同意用户协议',
				icon: 'none'
			})
			return
		}

		try {
			const success = await userStore.handleGetPhoneNumber(e)
			if (success) {
				uni.navigateTo({
					url: '/pages/home/index'
				})
			}
		} catch (error) {
			console.error('微信一键登录错误:', error)
		}
	}
	*/

	// 页面加载时检查登录状态
	onMounted(() => {
		// 初始化主题
		themeStore.initTheme()
		
		// 获取本地存储的用户信息
		userStore.getUserInfo()
		
		// 如果已经登录，直接跳转到首页
		if (userStore.isLoggedIn) {
			uni.navigateTo({
				url: '/pages/home/index'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.login-container {
		min-height: 100vh;
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

	.circle-4 {
		width: 80rpx;
		height: 80rpx;
		top: 30%;
		left: 20%;
		animation-delay: 1s;
	}

	.floating-shapes {
		position: absolute;
		width: 100%;
		height: 100%;
		
		.shape {
			position: absolute;
			background: rgba(255, 255, 255, 0.05);
			animation: rotate 20s linear infinite;
		}
		
		.shape-1 {
			width: 60rpx;
			height: 60rpx;
			top: 15%;
			left: 10%;
			clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		}
		
		.shape-2 {
			width: 40rpx;
			height: 40rpx;
			top: 70%;
			right: 15%;
			clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
		}
		
		.shape-3 {
			width: 50rpx;
			height: 50rpx;
			bottom: 30%;
			left: 60%;
			clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
		}
	}

	.particles {
		position: absolute;
		width: 100%;
		height: 100%;
		
		.particle {
			position: absolute;
			width: 4rpx;
			height: 4rpx;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 50%;
			animation: particleFloat 8s linear infinite;
			
			@for $i from 1 through 20 {
				&:nth-child(#{$i}) {
					left: random(100) * 1%;
					top: random(100) * 1%;
					animation-delay: random(8) * 1s;
					animation-duration: (random(4) + 4) * 1s;
				}
			}
		}
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(180deg); }
	}

	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes particleFloat {
		0% {
			transform: translateY(100vh) scale(0);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateY(-100rpx) scale(1);
			opacity: 0;
		}
	}

	.login-content {
		position: relative;
		z-index: 1;
		padding: 80rpx 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 100vh;
	}

	.logo-section {
		text-align: center;
		margin-bottom: 80rpx;
		animation: fadeInDown 1s ease-out;
		
		.logo-container {
			position: relative;
			display: inline-block;
			margin-bottom: 40rpx;
			
			.logo-glow {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 160rpx;
				height: 160rpx;
				background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
				border-radius: 50%;
				animation: pulse 2s ease-in-out infinite;
			}
			
			.logo-ring {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 180rpx;
				height: 180rpx;
				border: 2rpx solid rgba(255,255,255,0.2);
				border-radius: 50%;
				animation: rotate 10s linear infinite;
			}
		}
		
		.app-title {
			display: block;
			font-size: 60rpx;
			font-weight: 700;
			color: #fff;
			margin: 30rpx 0 10rpx;
			text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
			letter-spacing: 2rpx;
		}

		.app-subtitle {
			display: block;
			font-size: 32rpx;
			color: rgba(255, 255, 255, 0.9);
			letter-spacing: 2rpx;
			margin-bottom: 50rpx;
		}
		
		.app-features {
			display: flex;
			justify-content: center;
			gap: 30rpx;
			flex-wrap: wrap;
			
			.feature-tag {
				display: flex;
				align-items: center;
				gap: 8rpx;
				padding: 12rpx 20rpx;
				background: rgba(255, 255, 255, 0.15);
				backdrop-filter: blur(10rpx);
				border-radius: 25rpx;
				border: 1rpx solid rgba(255, 255, 255, 0.2);
				
				text {
					font-size: 24rpx;
					color: rgba(255, 255, 255, 0.9);
					font-weight: 500;
				}
			}
		}
	}

	.login-section {
		border-radius: 32rpx;
		padding: 60rpx 40rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.2);
		animation: fadeInUp 1s ease-out 0.3s both;
		
		.welcome-text {
			text-align: center;
			margin-bottom: 50rpx;
			
			.welcome-title {
				display: block;
				font-size: 36rpx;
				font-weight: 600;
				margin-bottom: 12rpx;
			}
			
			.welcome-desc {
				font-size: 28rpx;
				line-height: 1.5;
			}
		}
		
		.login-actions {
			margin-bottom: 40rpx;
			
			.dev-login-btn {
				border-radius: 50rpx;
				box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
				transition: all 0.3s ease;
				border: none;
				font-size: 32rpx;
				font-weight: 600;
				margin-bottom: 30rpx;
				
				&:active {
					transform: translateY(2rpx);
					box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
				}
			}
			
			.divider {
				display: flex;
				align-items: center;
				margin: 30rpx 0;
				
				.divider-line {
					flex: 1;
					height: 1rpx;
				}
				
				.divider-text {
					margin: 0 20rpx;
					font-size: 26rpx;
				}
			}
			
			.commented-login-tips {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8rpx;
				padding: 20rpx;
				border-radius: 16rpx;
				
				.tip-text {
					font-size: 26rpx;
				}
			}
			
			.wx-phone-login-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 10rpx;
				width: 100%;
				padding: 24rpx 40rpx;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border-radius: 50rpx;
				border: none;
				font-size: 32rpx;
				font-weight: 600;
				color: #fff;
				box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
				transition: all 0.3s ease;
				margin-bottom: 30rpx;
				
				&:active {
					transform: translateY(2rpx);
					box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
				}
				
				&:disabled {
					background: #ccc;
					box-shadow: none;
					opacity: 0.6;
				}
			}
			
			.wx-btn {
				border-radius: 50rpx;
				box-shadow: 0 8rpx 32rpx rgba(76, 175, 80, 0.3);
				transition: all 0.3s ease;
				background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
				border: none;
				font-size: 32rpx;
				font-weight: 600;
				
				&:active {
					transform: translateY(2rpx);
					box-shadow: 0 4rpx 16rpx rgba(76, 175, 80, 0.4);
				}
			}
		}
		
		.agreement-section {
			text-align: center;
			
			.agreement-checkbox {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8rpx;
				flex-wrap: wrap;
				
				.agreement-text {
					font-size: 26rpx;
				}
				
				.agreement-link {
					font-size: 26rpx;
					font-weight: 500;
					
					&:active {
						opacity: 0.7;
					}
				}
			}
		}
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
	
	@keyframes pulse {
		0%, 100% { 
			opacity: 0.3;
			transform: translate(-50%, -50%) scale(1);
		}
		50% { 
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(1.1);
		}
	}
</style>