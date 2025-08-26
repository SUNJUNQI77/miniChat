<template>
	<view class="bottom-section" :style="{ 
		background: themeConfig.cardBackgroundTransparent,
		borderTop: `1rpx solid ${themeConfig.borderColor}`
	}">
		<view class="input-container" :style="{ background: themeConfig.inputBackground }">
			<view class="input-toolbar">
				<view class="toolbar-btn" @click="handleVoiceInput">
					<u-icon name="mic" size="24" :color="themeConfig.primary"></u-icon>
				</view>
				<view class="toolbar-btn" @click="handleImageInput">
					<u-icon name="camera" size="24" :color="themeConfig.primary"></u-icon>
				</view>
			</view>
			<view class="input-wrapper">
				<u-input 
					v-model="inputValue" 
					placeholder="输入您的问题..." 
					:border="false"
					@confirm="handleSend"
					class="message-input"
					:style="{ color: themeConfig.textPrimary }"
					:maxlength="maxLength"
					:show-word-limit="showWordLimit"
				></u-input>
			</view>
			<view class="send-wrapper">
				<u-button 
					type="primary" 
					text="发送" 
					size="small"
					@click="handleSend"
					:disabled="!canSend"
					class="send-btn"
					:style="{ background: themeConfig.primaryGradient }"
				></u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { showModal, showToast } from '@/utils/index.js'

// 定义props
const props = defineProps({
	themeConfig: {
		type: Object,
		required: true
	},
	maxLength: {
		type: Number,
		default: 500
	},
	showWordLimit: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

// 定义emits
const emit = defineEmits(['send', 'voiceInput', 'imageInput'])

// 响应式数据
const inputValue = ref('')

// 计算属性
const canSend = computed(() => {
	return !props.disabled && inputValue.value.trim().length > 0
})

// 发送消息
const handleSend = () => {
	if (!canSend.value) return
	
	const message = inputValue.value.trim()
	emit('send', message)
	inputValue.value = ''
}

// 语音输入
const handleVoiceInput = () => {
	emit('voiceInput')
	
	// 默认实现
	showModal('语音输入', '点击确定开始语音识别').then((confirmed) => {
		if (confirmed) {
			showToast('语音输入功能开发中', 'none')
		}
	})
}

// 图片输入
const handleImageInput = () => {
	emit('imageInput')
	
	// 默认实现
	uni.chooseImage({
		count: 1,
		success: (res) => {
			showToast('图片识别功能开发中', 'none')
		}
	})
}

// 监听输入值变化
watch(inputValue, (newValue) => {
	// 可以在这里添加输入验证逻辑
	if (newValue.length > props.maxLength) {
		inputValue.value = newValue.slice(0, props.maxLength)
		showToast(`输入内容不能超过${props.maxLength}个字符`, 'none')
	}
})

// 暴露方法给父组件
defineExpose({
	// 设置输入值
	setValue: (value) => {
		inputValue.value = value
	},
	
	// 清空输入
	clear: () => {
		inputValue.value = ''
	},
	
	// 聚焦输入框
	focus: () => {
		// 这里可以调用u-input的focus方法
	},
	
	// 获取当前输入值
	getValue: () => {
		return inputValue.value
	}
})
</script>

<style lang="scss" scoped>
/* 底部输入区域 */
.bottom-section {
	padding: 30rpx;
	box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.08);
	flex-shrink: 0;
	position: relative;
	z-index: 10;
	
	.input-container {
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		padding: 20rpx 30rpx;
		border: 1rpx solid rgba(0,0,0,0.05);
		
		.input-toolbar {
			display: flex;
			margin-right: 20rpx;
			gap: 15rpx;
			
			.toolbar-btn {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				background: rgba(102, 126, 234, 0.1);
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s ease;
				
				&:active {
					background: rgba(102, 126, 234, 0.2);
					transform: scale(0.9);
				}
			}
		}
		
		.input-wrapper {
			flex: 1;
			margin-right: 20rpx;
			
			.message-input {
				background: transparent;
			}
		}
		
		.send-wrapper {
			.send-btn {
				border-radius: 50rpx;
				box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
				transition: all 0.3s ease;
				border: none;
				
				&:active {
					transform: scale(0.95);
				}
				
				&:disabled {
					background: #ccc;
					box-shadow: none;
				}
			}
		}
	}
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
	.bottom-section {
		padding: 20rpx;
	}
	
	.input-container {
		padding: 15rpx 20rpx;
		
		.input-toolbar {
			margin-right: 15rpx;
			gap: 10rpx;
			
			.toolbar-btn {
				width: 50rpx;
				height: 50rpx;
			}
		}
		
		.input-wrapper {
			margin-right: 15rpx;
		}
	}
}
</style>
