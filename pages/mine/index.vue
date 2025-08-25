<template>
	<view class="mine-container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-info">
				<u-avatar :src="userInfo.avatar" size="120" shape="circle"></u-avatar>
				<view class="user-details">
					<text class="user-name">{{ userInfo.name }}</text>
					<text class="user-id">ID: {{ userInfo.userId }}</text>
					<text class="user-signature">{{ userInfo.signature }}</text>
				</view>
				<u-button 
					type="text" 
					icon="setting" 
					@click="goToSettings"
				></u-button>
			</view>
			
					<view class="user-stats">
			<view class="stat-item" @click="goToQuestions">
				<text class="stat-number">{{ userInfo.questionCount }}</text>
				<text class="stat-label">提问</text>
			</view>
			<view class="stat-item" @click="goToFavorites">
				<text class="stat-number">{{ userInfo.favoriteCount }}</text>
				<text class="stat-label">收藏</text>
			</view>
			<view class="stat-item" @click="goToHistory">
				<text class="stat-number">{{ userInfo.historyCount }}</text>
				<text class="stat-label">历史</text>
			</view>
		</view>
		</view>
		
		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-group">
				<view class="menu-item" @click="goToQuestions">
					<u-icon name="help-circle" size="40" color="#ff9900"></u-icon>
					<text class="menu-text">我的提问</text>
					<u-icon name="arrow-right" size="30" color="#ccc"></u-icon>
				</view>
				<view class="menu-item" @click="goToFavorites">
					<u-icon name="star" size="40" color="#ffc107"></u-icon>
					<text class="menu-text">我的收藏</text>
					<u-icon name="arrow-right" size="30" color="#ccc"></u-icon>
				</view>
				<view class="menu-item" @click="goToHistory">
					<u-icon name="clock" size="40" color="#9c26b0"></u-icon>
					<text class="menu-text">问答历史</text>
					<u-icon name="arrow-right" size="30" color="#ccc"></u-icon>
				</view>
			</view>
			
			<view class="menu-group">
				<view class="menu-item" @click="goToSettings">
					<u-icon name="setting" size="40" color="#607d8b"></u-icon>
					<text class="menu-text">设置</text>
					<u-icon name="arrow-right" size="30" color="#ccc"></u-icon>
				</view>
				<view class="menu-item" @click="goToPrivacy">
					<u-icon name="lock" size="40" color="#795548"></u-icon>
					<text class="menu-text">隐私</text>
					<u-icon name="arrow-right" size="30" color="#ccc"></u-icon>
				</view>
				<view class="menu-item" @click="goToHelp">
					<u-icon name="help-circle" size="40" color="#2196f3"></u-icon>
					<text class="menu-text">帮助与反馈</text>
					<u-icon name="arrow-right" size="30" color="#ccc"></u-icon>
				</view>
				<view class="menu-item" @click="goToAbout">
					<u-icon name="info-circle" size="40" color="#4caf50"></u-icon>
					<text class="menu-text">关于我们</text>
					<u-icon name="arrow-right" size="30" color="#ccc"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 退出登录 -->
		<view class="logout-section">
			<u-button 
				type="error" 
				text="退出登录" 
				@click="handleLogout"
				shape="circle"
			></u-button>
		</view>
		
		<!-- 版本信息 -->
		<view class="version-info">
			<text class="version-text">版本 1.0.0</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 用户信息
const userInfo = reactive({
	name: '张三',
	userId: '12345678',
	signature: 'AI助手，智慧解答',
	avatar: 'https://picsum.photos/200/200?random=10',
	questionCount: 128,
	favoriteCount: 15,
	historyCount: 56
})

// 跳转到设置
const goToSettings = () => {
	uni.showToast({
		title: '设置功能开发中',
		icon: 'none'
	})
}

// 跳转到提问
const goToQuestions = () => {
	uni.showToast({
		title: '我的提问功能开发中',
		icon: 'none'
	})
}

// 跳转到收藏
const goToFavorites = () => {
	uni.showToast({
		title: '我的收藏功能开发中',
		icon: 'none'
	})
}

// 跳转到历史
const goToHistory = () => {
	uni.showToast({
		title: '问答历史功能开发中',
		icon: 'none'
	})
}

// 跳转到隐私
const goToPrivacy = () => {
	uni.showToast({
		title: '隐私设置功能开发中',
		icon: 'none'
	})
}

// 跳转到帮助
const goToHelp = () => {
	uni.showToast({
		title: '帮助功能开发中',
		icon: 'none'
	})
}

// 跳转到关于
const goToAbout = () => {
	uni.showModal({
		title: '关于我们',
		content: '智能问答小程序 v1.0.0\n\n这是一个基于uni-app开发的智能问答小程序，使用uview-plus组件库构建。\n\n功能包括：\n• 智能问答\n• 语音识别\n• 图片识别\n• 问答记录\n• 收藏管理\n\n感谢使用！',
		showCancel: false
	})
}

// 退出登录
const handleLogout = () => {
	uni.showModal({
		title: '确认退出',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				// 清除用户信息
				Object.assign(userInfo, {
					name: '',
					userId: '',
					signature: '',
					avatar: '',
					questionCount: 0,
					favoriteCount: 0,
					historyCount: 0
				})
				
				// 跳转到登录页
				uni.reLaunch({
					url: '/pages/login/index'
				})
				
				uni.showToast({
					title: '已退出登录',
					icon: 'success'
				})
			}
		}
	})
}

// 页面加载
onMounted(() => {
	console.log('我的页面加载完成')
})
</script>

<style scoped>
.mine-container {
	background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
	min-height: 100vh;
	padding-bottom: 40rpx;
}

.user-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 80rpx 40rpx 50rpx;
	color: #fff;
	position: relative;
	overflow: hidden;
}

.user-card::before {
	content: '';
	position: absolute;
	top: -50%;
	right: -20%;
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	animation: float 6s ease-in-out infinite;
}

.user-card::after {
	content: '';
	position: absolute;
	bottom: -30%;
	left: -10%;
	width: 150rpx;
	height: 150rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.05);
	animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
	0%, 100% { transform: translateY(0px) rotate(0deg); }
	50% { transform: translateY(-20px) rotate(180deg); }
}

.user-info {
	display: flex;
	align-items: center;
	margin-bottom: 50rpx;
	position: relative;
	z-index: 1;
}

.user-details {
	flex: 1;
	margin-left: 30rpx;
}

.user-name {
	display: block;
	font-size: 42rpx;
	font-weight: bold;
	margin-bottom: 12rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.user-id {
	display: block;
	font-size: 26rpx;
	opacity: 0.8;
	margin-bottom: 12rpx;
	background: rgba(255, 255, 255, 0.2);
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	display: inline-block;
}

.user-signature {
	display: block;
	font-size: 28rpx;
	opacity: 0.9;
	font-style: italic;
}

.user-stats {
	display: flex;
	justify-content: space-around;
	border-top: 1rpx solid rgba(255, 255, 255, 0.2);
	padding-top: 40rpx;
	position: relative;
	z-index: 1;
}

.stat-item {
	text-align: center;
	flex: 1;
	transition: all 0.3s ease;
}

.stat-item:active {
	transform: scale(0.95);
}

.stat-number {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.stat-label {
	display: block;
	font-size: 26rpx;
	opacity: 0.9;
	background: rgba(255, 255, 255, 0.2);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
}

.menu-section {
	padding: 50rpx 20rpx;
}

.menu-group {
	background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
	border-radius: 24rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	animation: fadeInUp 0.6s ease-out;
}

.menu-group:nth-child(2) {
	animation-delay: 0.1s;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 35rpx 25rpx;
	border-bottom: 1rpx solid #f0f0f0;
	transition: all 0.3s ease;
	position: relative;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item:active {
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	transform: translateX(10rpx);
}

.menu-item::after {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 4rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	transform: scaleY(0);
	transition: transform 0.3s ease;
}

.menu-item:active::after {
	transform: scaleY(1);
}

.menu-text {
	flex: 1;
	margin-left: 25rpx;
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
}

.logout-section {
	padding: 50rpx 20rpx;
	animation: fadeInUp 0.6s ease-out 0.2s both;
}

.logout-section .u-button {
	border-radius: 50rpx;
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
	box-shadow: 0 8rpx 32rpx rgba(255, 107, 107, 0.3);
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.logout-section .u-button::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
	transition: left 0.5s ease;
}

.logout-section .u-button:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.4);
}

.logout-section .u-button:active::before {
	left: 100%;
}

.version-info {
	text-align: center;
	padding: 20rpx;
	animation: fadeInUp 0.6s ease-out 0.3s both;
}

.version-text {
	font-size: 24rpx;
	color: #999;
	background: rgba(255, 255, 255, 0.8);
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	display: inline-block;
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