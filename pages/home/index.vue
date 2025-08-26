<template>
	<view class="home-container" :style="{ background: themeStore.themeConfig.backgroundGradient }">
		<!-- 左侧抽屉组件 -->
		<UserDrawer 
			:show="showDrawer" 
			@close="showDrawer = false"
			@loadHistory="loadQAHistory"
		/>
		
		<!-- 主界面 -->
		<view class="main-content">
			<!-- 顶部区域 -->
			<view class="top-section" :style="{ background: themeStore.themeConfig.primaryGradient }">
				<view class="avatar-section" @click="showDrawer = true">
					<view class="avatar-wrapper">
						<u-avatar :src="userStore.userAvatar" size="60" :text="userStore.userName" shape="circle"></u-avatar>
						<view class="avatar-indicator"></view>
					</view>
				</view>
				<view class="title-section">
					<text class="current-title">{{ qaStore.currentTitle }}</text>
					<text class="subtitle" v-if="qaStore.hasCurrentQA">{{ qaStore.currentMessages.length }}条消息</text>
				</view>
				<view class="settings-section" @click="openSettings">
					<view class="settings-btn">
						<u-icon name="setting" size="32" color="#fff"></u-icon>
					</view>
				</view>
			</view>
			
			<!-- 聊天内容区域 -->
			<view class="content-wrapper">
				<ChatContent 
					:messages="qaStore.currentMessages"
					:quick-questions="qaStore.quickQuestions"
					:theme-config="themeStore.themeConfig"
					@quick-question="askQuickQuestion"
					@scroll="onContentScroll"
					@scroll-to-lower="onContentScrollToLower"
					ref="chatContentRef"
				/>
			</view>
			
			<!-- 聊天输入区域 -->
			<view class="input-wrapper">
				<ChatInput 
					:theme-config="themeStore.themeConfig"
					:disabled="isLoading"
					@send="sendMessage"
					@voice-input="voiceInput"
					@image-input="imageInput"
					ref="chatInputRef"
				/>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, nextTick, watch } from 'vue'
	import { useUserStore } from '@/stores/user'
	import { useQAStore } from '@/stores/qa'
	import { useThemeStore } from '@/stores/theme'
	import UserDrawer from '@/components/UserDrawer.vue'
	import ChatContent from '@/components/ChatContent.vue'
	import ChatInput from '@/components/ChatInput.vue'

	// 使用stores
	const userStore = useUserStore()
	const qaStore = useQAStore()
	const themeStore = useThemeStore()

	// 响应式数据
	const showDrawer = ref(false)
	const isLoading = ref(false)
	const chatContentRef = ref(null)
	const chatInputRef = ref(null)

	// 发送消息
	const sendMessage = async (message) => {
		if (!message.trim()) return
		
		isLoading.value = true
		
		// 如果没有当前问答，创建新的
		if (!qaStore.hasCurrentQA) {
			qaStore.addQA(message)
		}
		
		// 添加用户消息
		qaStore.addMessage(message, true)
		
		// 滚动到底部
		nextTick(() => {
			chatContentRef.value?.scrollToBottom()
		})
		
		// 模拟AI回复
		await qaStore.simulateAIReply()
		
		nextTick(() => {
			chatContentRef.value?.scrollToBottom()
		})
		
		isLoading.value = false
	}

	// 内容区域滚动事件
	const onContentScroll = (e) => {
		// 可以在这里添加滚动相关的逻辑
	}
	
	// 内容区域滚动到底部事件
	const onContentScrollToLower = () => {
		// 滚动到底部时的处理
	}

	// 快捷问题
	const askQuickQuestion = (question) => {
		chatInputRef.value?.setValue(question)
		sendMessage(question)
	}

	// 加载问答历史
	const loadQAHistory = (qa) => {
		qaStore.setCurrentQA(qa)
		nextTick(() => {
			chatContentRef.value?.scrollToBottom()
		})
	}

	// 打开设置
	const openSettings = () => {
		uni.navigateTo({
			url: '/pages/settings/index'
		})
	}

	// 语音输入
	const voiceInput = () => {
		uni.showModal({
			title: '语音输入',
			content: '点击确定开始语音识别',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '语音输入功能开发中',
						icon: 'none'
					})
				}
			}
		})
	}

	// 图片输入
	const imageInput = () => {
		uni.chooseImage({
			count: 1,
			success: (res) => {
				uni.showToast({
					title: '图片识别功能开发中',
					icon: 'none'
				})
			}
		})
	}

	// 监听主题变化
	watch(() => themeStore.currentTheme, () => {
		// 主题变化时重新渲染
		nextTick(() => {
			// 可以在这里添加主题变化后的处理逻辑
		})
	})

	// 页面加载
	onMounted(() => {
		console.log('首页加载完成')
		
		// 初始化主题
		themeStore.initTheme()
		
		// 加载本地存储的数据
		userStore.getUserInfo()
		qaStore.loadFromStorage()
		
		// 检查登录状态
		if (!userStore.isLoggedIn) {
			uni.reLaunch({
				url: '/pages/login/index'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.home-container {
		height: 100vh;
		display: flex;
		overflow: hidden;
		position: relative;
	}

	/* 主界面样式 */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	/* 顶部区域 */
	.top-section {
		display: flex;
		align-items: center;
		padding: 40rpx 30rpx 30rpx;
		color: #fff;
		box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
		flex-shrink: 0;
		position: relative;
		
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 1rpx;
			background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
		}
		
		.avatar-section {
			margin-right: 30rpx;
			
			.avatar-wrapper {
				position: relative;
				
				.avatar-indicator {
					position: absolute;
					bottom: -2rpx;
					right: -2rpx;
					width: 16rpx;
					height: 16rpx;
					background: #4CAF50;
					border: 3rpx solid #fff;
					border-radius: 50%;
					box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
				}
			}
		}
		
		.title-section {
			flex: 1;
			text-align: center;
			
			.current-title {
				display: block;
				font-size: 36rpx;
				font-weight: 600;
				text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
				margin-bottom: 8rpx;
			}
			
			.subtitle {
				display: block;
				font-size: 24rpx;
				opacity: 0.8;
			}
		}
		
		.settings-section {
			margin-left: 30rpx;
			
			.settings-btn {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				background: rgba(255,255,255,0.1);
				backdrop-filter: blur(10rpx);
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s ease;
				
				&:active {
					background: rgba(255,255,255,0.2);
					transform: scale(0.95);
				}
			}
		}
	}

	/* 内容区域 */
	.content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 0; /* 重要：允许flex子元素收缩 */
	}
	
	/* 输入区域 */
	.input-wrapper {
		flex-shrink: 0; /* 防止输入区域被压缩 */
		position: relative;
		z-index: 10;
	}

	/* 响应式设计 */
	@media screen and (max-width: 750rpx) {
		.top-section {
			padding: 30rpx 20rpx 20rpx;
		}
		
		.content-wrapper {
			min-height: 0;
		}
	}
	
	/* 处理键盘弹出时的适配 */
	@media screen and (max-height: 600px) {
		.main-content {
			height: 100vh;
		}
		
		.content-wrapper {
			flex: 1;
			min-height: 0;
		}
	}
</style>