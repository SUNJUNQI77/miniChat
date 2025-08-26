<template>
	<view class="settings-container" :style="{ background: themeStore.themeConfig.backgroundGradient }">
		<!-- 顶部导航 -->
		<view class="nav-header">
			<view class="nav-left" @click="goBack">
				<u-icon name="arrow-left" size="32" :color="themeStore.themeConfig.textPrimary"></u-icon>
			</view>
			<text class="nav-title" :style="{ color: themeStore.themeConfig.textPrimary }">设置</text>
			<view class="nav-right"></view>
		</view>
		
		<!-- 设置内容 -->
		<scroll-view class="settings-content" scroll-y :show-scrollbar="false">
			<!-- 用户信息卡片 -->
			<view class="user-card" :style="{ background: themeStore.themeConfig.cardBackgroundTransparent }">
				<view class="user-info">
					<u-avatar :src="userStore.userInfo.avatar" size="120" :text="userStore.userInfo.name" shape="circle"></u-avatar>
					<view class="user-details">
						<text class="user-name" :style="{ color: themeStore.themeConfig.textPrimary }">{{ userStore.userInfo.name }}</text>
						<text class="user-email" :style="{ color: themeStore.themeConfig.textSecondary }">{{ userStore.userInfo.email }}</text>
						<text class="user-phone" :style="{ color: themeStore.themeConfig.textSecondary }">{{ userStore.userInfo.phone || '未绑定手机号' }}</text>
					</view>
				</view>
			</view>
			
			<!-- 主题设置 -->
			<view class="settings-section">
				<view class="section-header">
					<u-icon name="palette" size="28" :color="themeStore.themeConfig.primary"></u-icon>
					<text class="section-title" :style="{ color: themeStore.themeConfig.textPrimary }">主题设置</text>
				</view>
				
				<view class="settings-list">
					<view class="setting-item" @click="showThemeSelector = true">
						<view class="item-left">
							<u-icon name="moon" size="24" :color="themeStore.themeConfig.textSecondary"></u-icon>
							<text class="item-title" :style="{ color: themeStore.themeConfig.textPrimary }">主题模式</text>
						</view>
						<view class="item-right">
							<text class="item-value" :style="{ color: themeStore.themeConfig.textSecondary }">{{ getThemeModeText() }}</text>
							<u-icon name="arrow-right" size="20" :color="themeStore.themeConfig.textTertiary"></u-icon>
						</view>
					</view>
					
					<view class="setting-item" @click="toggleTheme">
						<view class="item-left">
							<u-icon name="refresh" size="24" :color="themeStore.themeConfig.textSecondary"></u-icon>
							<text class="item-title" :style="{ color: themeStore.themeConfig.textPrimary }">切换主题</text>
						</view>
						<view class="item-right">
							<text class="item-value" :style="{ color: themeStore.themeConfig.textSecondary }">{{ themeStore.isDark ? '暗色' : '亮色' }}</text>
							<u-icon name="arrow-right" size="20" :color="themeStore.themeConfig.textTertiary"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 应用设置 -->
			<view class="settings-section">
				<view class="section-header">
					<u-icon name="setting" size="28" :color="themeStore.themeConfig.primary"></u-icon>
					<text class="section-title" :style="{ color: themeStore.themeConfig.textPrimary }">应用设置</text>
				</view>
				
				<view class="settings-list">
					<view class="setting-item" @click="clearHistory">
						<view class="item-left">
							<u-icon name="trash" size="24" :color="themeStore.themeConfig.textSecondary"></u-icon>
							<text class="item-title" :style="{ color: themeStore.themeConfig.textPrimary }">清空聊天记录</text>
						</view>
						<view class="item-right">
							<u-icon name="arrow-right" size="20" :color="themeStore.themeConfig.textTertiary"></u-icon>
						</view>
					</view>
					
					<view class="setting-item" @click="exportData">
						<view class="item-left">
							<u-icon name="download" size="24" :color="themeStore.themeConfig.textSecondary"></u-icon>
							<text class="item-title" :style="{ color: themeStore.themeConfig.textPrimary }">导出数据</text>
						</view>
						<view class="item-right">
							<u-icon name="arrow-right" size="20" :color="themeStore.themeConfig.textTertiary"></u-icon>
						</view>
					</view>
					
					<view class="setting-item" @click="aboutApp">
						<view class="item-left">
							<u-icon name="info-circle" size="24" :color="themeStore.themeConfig.textSecondary"></u-icon>
							<text class="item-title" :style="{ color: themeStore.themeConfig.textPrimary }">关于应用</text>
						</view>
						<view class="item-right">
							<u-icon name="arrow-right" size="20" :color="themeStore.themeConfig.textTertiary"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 账户设置 -->
			<view class="settings-section">
				<view class="section-header">
					<u-icon name="account" size="28" :color="themeStore.themeConfig.primary"></u-icon>
					<text class="section-title" :style="{ color: themeStore.themeConfig.textPrimary }">账户设置</text>
				</view>
				
				<view class="settings-list">
					<view class="setting-item" @click="logout">
						<view class="item-left">
							<u-icon name="logout" size="24" :color="themeStore.themeConfig.error"></u-icon>
							<text class="item-title" :style="{ color: themeStore.themeConfig.error }">退出登录</text>
						</view>
						<view class="item-right">
							<u-icon name="arrow-right" size="20" :color="themeStore.themeConfig.textTertiary"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 主题选择器 -->
		<u-action-sheet 
			:show="showThemeSelector" 
			:actions="themeActions" 
			@close="showThemeSelector = false"
			@select="selectTheme"
			title="选择主题模式"
		></u-action-sheet>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useQAStore } from '@/stores/qa'
import { useThemeStore } from '@/stores/theme'

// 使用stores
const userStore = useUserStore()
const qaStore = useQAStore()
const themeStore = useThemeStore()

// 响应式数据
const showThemeSelector = ref(false)

// 主题选项
const themeActions = [
	{ name: '跟随系统', value: 'auto' },
	{ name: '浅色模式', value: 'light' },
	{ name: '深色模式', value: 'dark' }
]

// 返回上一页
const goBack = () => {
	uni.navigateBack()
}

// 获取主题模式文本
const getThemeModeText = () => {
	switch (themeStore.mode) {
		case 'auto':
			return '跟随系统'
		case 'light':
			return '浅色模式'
		case 'dark':
			return '深色模式'
		default:
			return '跟随系统'
	}
}

// 切换主题
const toggleTheme = () => {
	themeStore.toggleTheme()
	uni.showToast({
		title: `已切换到${themeStore.isDark ? '深色' : '浅色'}模式`,
		icon: 'success'
	})
}

// 选择主题
const selectTheme = (action) => {
	themeStore.setThemeMode(action.value)
	showThemeSelector.value = false
	uni.showToast({
		title: '主题设置已保存',
		icon: 'success'
	})
}

// 清空聊天记录
const clearHistory = () => {
	uni.showModal({
		title: '确认清空',
		content: '确定要清空所有聊天记录吗？此操作不可恢复',
		confirmColor: themeStore.themeConfig.error,
		success: (res) => {
			if (res.confirm) {
				qaStore.clearHistory()
				uni.showToast({
					title: '已清空聊天记录',
					icon: 'success'
				})
			}
		}
	})
}

// 导出数据
const exportData = () => {
	uni.showToast({
		title: '导出功能开发中',
		icon: 'none'
	})
}

// 关于应用
const aboutApp = () => {
	uni.showModal({
		title: '关于智能问答',
		content: '版本：2.0.0\n一个基于AI的智能问答小程序，支持多种主题模式。',
		showCancel: false,
		confirmText: '确定'
	})
}

// 退出登录
const logout = () => {
	uni.showModal({
		title: '确认退出',
		content: '确定要退出登录吗？',
		confirmColor: themeStore.themeConfig.error,
		success: (res) => {
			if (res.confirm) {
				userStore.logout()
				uni.reLaunch({
					url: '/pages/login/index'
				})
			}
		}
	})
}

// 页面加载
onMounted(() => {
	// 初始化主题
	themeStore.initTheme()
})
</script>

<style lang="scss" scoped>
.settings-container {
	min-height: 100vh;
	position: relative;
}

.nav-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40rpx 30rpx 20rpx;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20rpx);
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	
	.nav-left, .nav-right {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.nav-title {
		font-size: 36rpx;
		font-weight: 600;
	}
}

.settings-content {
	height: calc(100vh - 120rpx);
	padding: 30rpx;
}

.user-card {
	border-radius: 24rpx;
	padding: 40rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.1);
	
	.user-info {
		display: flex;
		align-items: center;
		gap: 30rpx;
		
		.user-details {
			flex: 1;
			
			.user-name {
				display: block;
				font-size: 36rpx;
				font-weight: 600;
				margin-bottom: 12rpx;
			}
			
			.user-email, .user-phone {
				display: block;
				font-size: 28rpx;
				margin-bottom: 8rpx;
			}
		}
	}
}

.settings-section {
	margin-bottom: 40rpx;
	
	.section-header {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 20rpx;
		padding: 0 10rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: 600;
		}
	}
	
	.settings-list {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20rpx);
		border-radius: 20rpx;
		overflow: hidden;
		border: 1rpx solid rgba(255, 255, 255, 0.1);
		
		.setting-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx;
			border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
			transition: all 0.3s ease;
			
			&:last-child {
				border-bottom: none;
			}
			
			&:active {
				background: rgba(255, 255, 255, 0.1);
			}
			
			.item-left {
				display: flex;
				align-items: center;
				gap: 20rpx;
				
				.item-title {
					font-size: 30rpx;
				}
			}
			
			.item-right {
				display: flex;
				align-items: center;
				gap: 10rpx;
				
				.item-value {
					font-size: 28rpx;
				}
			}
		}
	}
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 6rpx;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.3);
	border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
	.settings-content {
		padding: 20rpx;
	}
	
	.nav-header {
		padding: 30rpx 20rpx 15rpx;
	}
}
</style>
