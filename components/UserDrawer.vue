<template>
	<u-popup 
		:show="show" 
		mode="left" 
		:width="drawerWidth" 
		@close="handleClose"
		:closeable="true"
		:mask-close-able="true"
		:close-icon-pos="['20rpx', '20rpx']"
		:close-icon-size="40"
		:close-icon-color="'#fff'"
		:custom-style="drawerStyle"
	>
		<view class="drawer-content">
			<!-- 用户信息区域 -->
			<view class="user-info-section">
				<view class="user-avatar-container">
					<u-avatar :src="userStore.userInfo.avatar" size="120" :text="userStore.userInfo.name" shape="circle"></u-avatar>
					<view class="online-status"></view>
				</view>
				<text class="user-name">{{ userStore.userInfo.name }}</text>
				<text class="user-email">{{ userStore.userInfo.email }}</text>
				<view class="user-stats">
					<view class="stat-item">
						<text class="stat-number">{{ qaStore.historyCount }}</text>
						<text class="stat-label">问答记录</text>
					</view>
					<view class="stat-divider"></view>
					<view class="stat-item">
						<text class="stat-number">{{ qaStore.qaHistory.filter(qa => qa.messages.length > 2).length }}</text>
						<text class="stat-label">深度对话</text>
					</view>
				</view>
			</view>
			
			<!-- 问答记录区域 -->
			<view class="qa-history-section">
				<view class="history-header">
					<view class="header-left">
						<u-icon name="chat" size="28" color="#fff"></u-icon>
						<text class="history-title">问答记录</text>
					</view>
					<u-button 
						type="text" 
						text="清空" 
						size="mini" 
						@click="clearHistory"
						class="clear-btn"
					></u-button>
				</view>
				
				<scroll-view class="history-list" scroll-y :show-scrollbar="false">
					<view 
						class="history-item" 
						v-for="(item, index) in qaStore.qaHistory" 
						:key="index"
						@click="loadQAHistory(item)"
						:class="{ 'active': qaStore.currentQA?.id === item.id }"
					>
						<view class="item-content">
							<view class="item-header">
								<u-icon name="chat" size="20" color="rgba(255,255,255,0.7)"></u-icon>
								<text class="item-time">{{ item.time }}</text>
							</view>
							<text class="item-question">{{ item.question }}</text>
							<view class="item-footer">
								<text class="message-count">{{ item.messages.length }}条消息</text>
								<view class="item-badge" v-if="item.messages.length > 2">
									<u-icon name="star" size="14" color="#FFD700"></u-icon>
								</view>
							</view>
						</view>
					</view>
					
					<view v-if="qaStore.qaHistory.length === 0" class="empty-history">
						<u-icon name="chat" size="60" color="rgba(255,255,255,0.3)"></u-icon>
						<text class="empty-text">暂无问答记录</text>
						<text class="empty-desc">开始您的第一次对话吧</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useQAStore } from '@/stores/qa'

// 定义props
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})

// 定义emits
const emit = defineEmits(['close', 'loadHistory'])

// 使用stores
const userStore = useUserStore()
const qaStore = useQAStore()

// 动态计算抽屉宽度
const systemInfo = ref({})
const drawerWidth = computed(() => {
	const { windowWidth } = systemInfo.value
	if (!windowWidth) return '70%'
	
	// 根据屏幕宽度动态调整
	if (windowWidth <= 375) {
		return '85%' // 小屏设备
	} else if (windowWidth <= 414) {
		return '80%' // 中等屏幕
	} else {
		return '70%' // 大屏设备
	}
})

// 抽屉样式
const drawerStyle = computed(() => ({
	'border-radius': '0 20rpx 20rpx 0',
	'box-shadow': '0 0 40rpx rgba(0,0,0,0.3)',
	'backdrop-filter': 'blur(20rpx)'
}))

// 关闭抽屉
const handleClose = () => {
	emit('close')
}

// 清空历史
const clearHistory = () => {
	uni.showModal({
		title: '确认清空',
		content: '确定要清空所有问答记录吗？此操作不可恢复',
		confirmColor: '#ff4757',
		success: (res) => {
			if (res.confirm) {
				qaStore.clearHistory()
				uni.showToast({
					title: '已清空',
					icon: 'success'
				})
			}
		}
	})
}

// 加载问答历史
const loadQAHistory = (qa) => {
	emit('loadHistory', qa)
	handleClose()
}

// 获取系统信息
onMounted(() => {
	uni.getSystemInfo({
		success: (res) => {
			systemInfo.value = res
		}
	})
})
</script>

<style lang="scss" scoped>
.drawer-content {
	height: 100%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
	color: #fff;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
	min-width: 600rpx;
	max-width: 800rpx;
	will-change: transform;
	transform: translateZ(0);
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
		opacity: 0.3;
		pointer-events: none;
	}
}

.user-info-section {
	padding: 60rpx 40rpx 40rpx;
	text-align: center;
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
	position: relative;
	flex-shrink: 0;
	
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
		border-radius: 2rpx;
	}
	
	.user-avatar-container {
		position: relative;
		display: inline-block;
		margin-bottom: 25rpx;
		
		.online-status {
			position: absolute;
			bottom: 8rpx;
			right: 8rpx;
			width: 20rpx;
			height: 20rpx;
			background: #4CAF50;
			border: 3rpx solid #fff;
			border-radius: 50%;
			box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
		}
	}
	
	.user-name {
		display: block;
		font-size: 36rpx;
		font-weight: 600;
		margin-bottom: 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
	}
	
	.user-email {
		display: block;
		font-size: 24rpx;
		opacity: 0.8;
		margin-bottom: 30rpx;
	}
	
	.user-stats {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 30rpx;
		
		.stat-item {
			text-align: center;
			
			.stat-number {
				display: block;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 6rpx;
				text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
			}
			
			.stat-label {
				font-size: 22rpx;
				opacity: 0.7;
			}
		}
		
		.stat-divider {
			width: 2rpx;
			height: 35rpx;
			background: rgba(255,255,255,0.3);
			border-radius: 1rpx;
		}
	}
}

.qa-history-section {
	flex: 1;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	min-height: 0;
	
	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		
		.header-left {
			display: flex;
			align-items: center;
			gap: 12rpx;
			
			.history-title {
				font-size: 32rpx;
				font-weight: 600;
				text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
			}
		}
		
		.clear-btn {
			color: rgba(255,255,255,0.8);
			font-size: 24rpx;
			padding: 6rpx 12rpx;
			border-radius: 16rpx;
			background: rgba(255,255,255,0.1);
			backdrop-filter: blur(10rpx);
			transition: all 0.3s ease;
			
			&:active {
				background: rgba(255,255,255,0.2);
				transform: scale(0.95);
			}
		}
	}
	
	.history-list {
		flex: 1;
		-webkit-overflow-scrolling: touch;
		scroll-behavior: smooth;
		
		.history-item {
			margin-bottom: 20rpx;
			border-radius: 16rpx;
			background: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(10rpx);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			border: 1rpx solid rgba(255,255,255,0.1);
			transform: translateZ(0);
			backface-visibility: hidden;
			animation: slideInLeft 0.4s ease-out;
			
			&:active {
				background: rgba(255, 255, 255, 0.2);
				transform: scale(0.98);
			}
			
			&.active {
				background: rgba(255, 255, 255, 0.25);
				border-color: rgba(255,255,255,0.3);
				box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.2);
			}
			
			.item-content {
				padding: 25rpx;
				
				.item-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 12rpx;
					
					.item-time {
						font-size: 22rpx;
						opacity: 0.7;
					}
				}
				
				.item-question {
					display: block;
					font-size: 26rpx;
					line-height: 1.4;
					margin-bottom: 12rpx;
					font-weight: 500;
				}
				
				.item-footer {
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.message-count {
						font-size: 22rpx;
						opacity: 0.6;
					}
					
					.item-badge {
						width: 28rpx;
						height: 28rpx;
						border-radius: 50%;
						background: rgba(255,215,0,0.2);
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
		
		.empty-history {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 300rpx;
			text-align: center;
			
			.empty-text {
				font-size: 28rpx;
				margin: 25rpx 0 12rpx;
				opacity: 0.6;
			}
			
			.empty-desc {
				font-size: 24rpx;
				opacity: 0.4;
			}
		}
	}
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 4rpx;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.3);
	border-radius: 2rpx;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.5);
}

/* 动画效果 */
@keyframes slideInLeft {
	from {
		opacity: 0;
		transform: translateX(-30rpx) translateZ(0);
	}
	to {
		opacity: 1;
		transform: translateX(0) translateZ(0);
	}
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
	.drawer-content {
		min-width: 100%;
		max-width: 100%;
	}
	
	.user-info-section {
		padding: 40rpx 30rpx 30rpx;
	}
	
	.qa-history-section {
		padding: 30rpx;
	}
	
	.history-item .item-content {
		padding: 20rpx;
	}
}

@media screen and (max-width: 600rpx) {
	.user-info-section {
		padding: 30rpx 20rpx 20rpx;
	}
	
	.qa-history-section {
		padding: 20rpx;
	}
	
	.history-header {
		margin-bottom: 20rpx;
	}
}
</style>
