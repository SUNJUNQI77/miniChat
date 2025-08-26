<template>
	<scroll-view 
		class="content-section" 
		scroll-y 
		:scroll-top="scrollTop" 
		:scroll-with-animation="true" 
		:show-scrollbar="false"
		:enhanced="true"
		:bounces="true"
		:scroll-anchoring="true"
		:fast-deceleration="true"
		:scroll-into-view="scrollIntoView"
		:enable-flex="true"
		:enable-passive="true"
		@scroll="onScroll"
		@scrolltolower="onScrollToLower"
	>
		<!-- 问答内容 -->
		<view v-if="hasMessages" class="qa-content">
			<view 
				class="message-item" 
				v-for="(message, index) in messages" 
				:key="index"
				:class="{ 'message-mine': message.isMine }"
				:id="`message-${index}`"
			>
				<u-avatar 
					:src="message.avatar" 
					size="50"
					v-if="!message.isMine"
					class="message-avatar"
				></u-avatar>
				<view class="message-content">
					<view class="message-bubble" :style="{ 
						background: message.isMine ? themeConfig.messageBubbleMine : themeConfig.messageBubbleOther,
						color: message.isMine ? '#fff' : themeConfig.textPrimary
					}">
						<text class="message-text">{{ message.content }}</text>
					</view>
					<text class="message-time" :style="{ color: themeConfig.textTertiary }">{{ message.time }}</text>
				</view>
				<u-avatar 
					:src="message.avatar" 
					size="50"
					v-if="message.isMine"
					class="message-avatar"
				></u-avatar>
			</view>
		</view>
		
		<!-- 欢迎内容 -->
		<view v-else class="welcome-content">
			<view class="welcome-card" :style="{ 
				background: themeConfig.cardBackgroundTransparent,
				boxShadow: themeConfig.shadow
			}">
				<view class="welcome-icon">
					<u-icon name="chat" size="100" :color="themeConfig.primary"></u-icon>
				</view>
				<text class="welcome-title" :style="{ color: themeConfig.textPrimary }">欢迎使用智能问答</text>
				<text class="welcome-desc" :style="{ color: themeConfig.textSecondary }">我是您的AI助手，有什么可以帮助您的吗？</text>
				<view class="welcome-features">
					<view class="feature-item">
						<u-icon name="star" size="24" color="#FFD700"></u-icon>
						<text :style="{ color: themeConfig.textSecondary }">智能对话</text>
					</view>
					<view class="feature-item">
						<u-icon name="clock" size="24" color="#4CAF50"></u-icon>
						<text :style="{ color: themeConfig.textSecondary }">24小时在线</text>
					</view>
					<view class="feature-item">
						<u-icon name="shield" size="24" color="#2196F3"></u-icon>
						<text :style="{ color: themeConfig.textSecondary }">安全可靠</text>
					</view>
				</view>
			</view>
			
			<!-- 快捷问题 -->
			<view class="quick-questions">
				<view class="quick-header">
					<u-icon name="lightning" size="28" :color="themeConfig.primary"></u-icon>
					<text class="quick-title" :style="{ color: themeConfig.textPrimary }">常见问题</text>
				</view>
				<view class="quick-list">
					<view 
						class="quick-item" 
						v-for="(question, index) in quickQuestions" 
						:key="index"
						@click="handleQuickQuestion(question)"
						:style="{ 
							background: themeConfig.cardBackgroundTransparent,
							boxShadow: themeConfig.shadowLight
						}"
					>
						<view class="quick-icon">
							<u-icon name="help-circle" size="24" :color="themeConfig.primary"></u-icon>
						</view>
						<text class="quick-text" :style="{ color: themeConfig.textPrimary }">{{ question }}</text>
						<u-icon name="arrow-right" size="20" :color="themeConfig.textTertiary"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { throttle } from '@/utils/index.js'

// 定义props
const props = defineProps({
	messages: {
		type: Array,
		default: () => []
	},
	quickQuestions: {
		type: Array,
		default: () => [
			'如何提高学习效率？',
			'推荐一些好书',
			'如何保持健康的生活方式？',
			'编程入门建议'
		]
	},
	themeConfig: {
		type: Object,
		required: true
	}
})

// 定义emits
const emit = defineEmits(['quickQuestion', 'scroll', 'scrollToLower'])

// 响应式数据
const scrollTop = ref(0)
const scrollIntoView = ref('')

// 计算属性
const hasMessages = computed(() => props.messages && props.messages.length > 0)

// 滚动事件处理（使用节流优化性能）
const onScroll = throttle((e) => {
	emit('scroll', e)
}, 100)

// 滚动到底部事件
const onScrollToLower = () => {
	emit('scrollToLower')
}

// 滚动到底部
const scrollToBottom = () => {
	nextTick(() => {
		// 使用scroll-into-view实现更流畅的滚动
		const messageCount = props.messages.length
		if (messageCount > 0) {
			scrollIntoView.value = `message-${messageCount - 1}`
		}
		
		// 备用方案：使用scrollTop
		setTimeout(() => {
			const query = uni.createSelectorQuery()
			query.select('.content-section').boundingClientRect()
			query.exec((res) => {
				if (res[0]) {
					scrollTop.value = res[0].height * 2
				}
			})
		}, 50)
	})
}

// 处理快捷问题点击
const handleQuickQuestion = (question) => {
	emit('quickQuestion', question)
}

// 监听消息变化，自动滚动到底部
watch(() => props.messages.length, () => {
	if (props.messages.length > 0) {
		scrollToBottom()
	}
}, { flush: 'post' })

// 暴露方法给父组件
defineExpose({
	scrollToBottom
})
</script>

<style lang="scss" scoped>
/* 中间内容区域 */
.content-section {
	flex: 1;
	height: 100%;
	padding: 30rpx;
	background: transparent;
	overflow-y: auto;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	scroll-behavior: smooth;
	will-change: scroll-position;
	contain: layout style paint;
	box-sizing: border-box;
}

/* 问答内容样式 */
.qa-content {
	display: flex;
	flex-direction: column;
	will-change: transform;
	transform: translateZ(0);
	
	.message-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 40rpx;
		animation: fadeInUp 0.3s ease-out;
		transform: translateZ(0);
		backface-visibility: hidden;
		contain: layout style;
		
		&.message-mine {
			flex-direction: row-reverse;
		}
		
		.message-avatar {
			flex-shrink: 0;
		}
		
		.message-content {
			max-width: 70%;
			margin: 0 20rpx;
			
			.message-bubble {
				padding: 25rpx;
				border-radius: 24rpx;
				position: relative;
				border: 1rpx solid rgba(0,0,0,0.05);
				transform: translateZ(0);
				backface-visibility: hidden;
				
				&::before {
					content: '';
					position: absolute;
					top: 20rpx;
					left: -10rpx;
					width: 0;
					height: 0;
					border: 10rpx solid transparent;
					border-right-color: inherit;
					border-left: 0;
				}
				
				.message-text {
					font-size: 30rpx;
					line-height: 1.6;
				}
			}
			
			.message-time {
				font-size: 24rpx;
				margin-top: 12rpx;
				text-align: center;
				background: rgba(255, 255, 255, 0.8);
				padding: 6rpx 16rpx;
				border-radius: 16rpx;
				display: inline-block;
				backdrop-filter: blur(10rpx);
			}
		}
		
		&.message-mine .message-content .message-bubble {
			&::before {
				left: auto;
				right: -10rpx;
				border-right: 0;
				border-left: 10rpx solid transparent;
				border-left-color: inherit;
			}
		}
	}
}

/* 欢迎内容样式 */
.welcome-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
	
	.welcome-card {
		border-radius: 32rpx;
		padding: 60rpx 40rpx;
		text-align: center;
		margin-bottom: 60rpx;
		max-width: 100%;
		border: 1rpx solid rgba(255,255,255,0.2);
		
		.welcome-icon {
			margin-bottom: 30rpx;
			animation: float 3s ease-in-out infinite;
		}
		
		.welcome-title {
			display: block;
			font-size: 42rpx;
			font-weight: 600;
			margin-bottom: 20rpx;
		}
		
		.welcome-desc {
			font-size: 28rpx;
			line-height: 1.6;
			margin-bottom: 40rpx;
		}
		
		.welcome-features {
			display: flex;
			justify-content: space-around;
			gap: 20rpx;
			
			.feature-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 8rpx;
				
				text {
					font-size: 24rpx;
				}
			}
		}
	}
	
	.quick-questions {
		width: 100%;
		
		.quick-header {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 12rpx;
			margin-bottom: 30rpx;
			
			.quick-title {
				font-size: 32rpx;
				font-weight: 600;
			}
		}
		
		.quick-list {
			display: flex;
			flex-direction: column;
			gap: 20rpx;
			
			.quick-item {
				padding: 30rpx;
				border-radius: 20rpx;
				transition: all 0.3s ease;
				border: 1rpx solid rgba(255,255,255,0.2);
				display: flex;
				align-items: center;
				gap: 20rpx;
				
				&:active {
					transform: scale(0.98);
				}
				
				.quick-icon {
					flex-shrink: 0;
				}
				
				.quick-text {
					flex: 1;
					font-size: 30rpx;
					line-height: 1.5;
				}
			}
		}
	}
}

/* 动画效果 */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20rpx) translateZ(0);
	}
	to {
		opacity: 1;
		transform: translateY(0) translateZ(0);
	}
}

@keyframes float {
	0%, 100% { transform: translateY(0px); }
	50% { transform: translateY(-10px); }
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 6rpx;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: rgba(102, 126, 234, 0.3);
	border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(102, 126, 234, 0.5);
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
	.content-section {
		padding: 20rpx;
	}
	
	.message-content {
		max-width: 80%;
	}
}
</style>
