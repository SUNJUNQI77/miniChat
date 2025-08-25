<template>
	<view class="chat-container">
		<!-- 问答列表 -->
		<view v-if="!currentQA" class="qa-list">
			<view class="search-header">
				<u-search 
					v-model="searchKeyword" 
					placeholder="搜索问答记录" 
					:showAction="false"
					@search="handleSearch"
				></u-search>
			</view>
			
			<view class="qa-items">
				<view 
					class="qa-item" 
					v-for="(qa, index) in qaList" 
					:key="index"
					@click="openQA(qa)"
					@longpress="showQAActions(qa)"
				>
					<u-avatar :src="qa.avatar" size="60"></u-avatar>
					<view class="qa-info">
						<view class="qa-header">
							<text class="qa-question">{{ qa.question }}</text>
							<text class="qa-time">{{ qa.time }}</text>
						</view>
						<text class="qa-answer">{{ qa.answer }}</text>
					</view>
					<view class="qa-badge" v-if="qa.isNew">
						<u-badge value="新" :max="99"></u-badge>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-if="qaList.length === 0" class="empty-state">
				<u-empty text="暂无问答记录" mode="chat"></u-empty>
			</view>
		</view>
		
		<!-- 问答详情 -->
		<view v-else class="qa-detail">
			<!-- 问答头部 -->
			<view class="qa-header">
				<u-button 
					type="text" 
					icon="arrow-left" 
					@click="closeQA"
				></u-button>
				<text class="qa-title">智能问答</text>
				<u-button 
					type="text" 
					icon="more-dot-fill" 
					@click="showQAMenu"
				></u-button>
			</view>
			
			<!-- 问答列表 -->
			<scroll-view 
				class="message-list" 
				scroll-y 
				:scroll-top="scrollTop"
				@scrolltoupper="loadMoreMessages"
			>
				<view 
					class="message-item" 
					v-for="(message, index) in messages" 
					:key="index"
					:class="{ 'message-mine': message.isMine }"
				>
					<u-avatar 
						:src="message.avatar" 
						size="40"
						v-if="!message.isMine"
					></u-avatar>
					<view class="message-content">
						<view class="message-bubble">
							<text class="message-text">{{ message.content }}</text>
						</view>
						<text class="message-time">{{ message.time }}</text>
					</view>
					<u-avatar 
						:src="message.avatar" 
						size="40"
						v-if="message.isMine"
					></u-avatar>
				</view>
			</scroll-view>
			
			<!-- 输入框 -->
			<view class="input-section">
				<view class="input-toolbar">
					<u-button 
						type="text" 
						icon="mic" 
						@click="voiceInput"
					></u-button>
					<u-button 
						type="text" 
						icon="camera" 
						@click="imageInput"
					></u-button>
				</view>
				<u-input 
					v-model="inputMessage" 
					placeholder="输入您的问题..." 
					:border="false"
					@confirm="sendMessage"
				></u-input>
				<u-button 
					type="primary" 
					text="发送" 
					size="small"
					@click="sendMessage"
					:disabled="!inputMessage.trim()"
				></u-button>
			</view>
		</view>
		
		<!-- 问答操作菜单 -->
		<u-action-sheet 
			:show="showActions" 
			:actions="qaActions" 
			@close="showActions = false"
			@select="handleQAAction"
		></u-action-sheet>
		
		<!-- 问答详情菜单 -->
		<u-action-sheet 
			:show="showMenu" 
			:actions="qaMenuActions" 
			@close="showMenu = false"
			@select="handleQAMenuAction"
		></u-action-sheet>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'

// 响应式数据
const searchKeyword = ref('')
const currentQA = ref(null)
const showActions = ref(false)
const showMenu = ref(false)
const inputMessage = ref('')
const scrollTop = ref(0)
const selectedQA = ref(null)

// 问答列表
const qaList = ref([
	{
		id: 1,
		question: '如何学习Vue.js？',
		answer: 'Vue.js是一个渐进式JavaScript框架，建议从基础语法开始学习...',
		time: '14:30',
		avatar: 'https://picsum.photos/100/100?random=1',
		isNew: true
	},
	{
		id: 2,
		question: '什么是机器学习？',
		answer: '机器学习是人工智能的一个分支，通过算法让计算机从数据中学习...',
		time: '12:15',
		avatar: 'https://picsum.photos/100/100?random=2',
		isNew: false
	},
	{
		id: 3,
		question: '如何提高工作效率？',
		answer: '提高工作效率可以从时间管理、任务优先级、工具使用等方面入手...',
		time: '昨天',
		avatar: 'https://picsum.photos/100/100?random=3',
		isNew: false
	},
	{
		id: 4,
		question: 'Python和JavaScript哪个更适合初学者？',
		answer: 'Python语法简洁，适合初学者；JavaScript应用广泛，两者各有优势...',
		time: '昨天',
		avatar: 'https://picsum.photos/100/100?random=4',
		isNew: false
	}
])

// 消息列表
const messages = ref([
	{
		id: 1,
		content: '您好！我是AI助手，有什么可以帮助您的吗？',
		time: '14:30',
		isMine: false,
		avatar: 'https://picsum.photos/100/100?random=1'
	},
	{
		id: 2,
		content: '如何学习编程？',
		time: '14:31',
		isMine: true,
		avatar: 'https://picsum.photos/100/100?random=10'
	},
	{
		id: 3,
		content: '学习编程建议从基础开始：1. 选择一门入门语言（如Python）2. 学习基础语法 3. 做小项目练习 4. 阅读优秀代码 5. 持续学习和实践',
		time: '14:32',
		isMine: false,
		avatar: 'https://picsum.photos/100/100?random=1'
	},
	{
		id: 4,
		content: '谢谢！',
		time: '14:33',
		isMine: true,
		avatar: 'https://picsum.photos/100/100?random=10'
	}
])

// 问答操作
const qaActions = ref([
	{ name: '收藏问答', icon: 'star' },
	{ name: '分享问答', icon: 'share' },
	{ name: '删除问答', icon: 'trash', color: '#f56c6c' }
])

// 问答菜单
const qaMenuActions = ref([
	{ name: '清空记录', icon: 'trash' },
	{ name: '导出记录', icon: 'download' },
	{ name: '设置', icon: 'setting' }
])

// 搜索处理
const handleSearch = (value) => {
	if (!value.trim()) {
		uni.showToast({
			title: '请输入搜索关键词',
			icon: 'none'
		})
		return
	}
	
	// 模拟搜索问答记录
	const filteredQAs = qaList.value.filter(qa => 
		qa.question.includes(value) || qa.answer.includes(value)
	)
	
	if (filteredQAs.length === 0) {
		uni.showToast({
			title: '未找到相关问答',
			icon: 'none'
		})
	} else {
		uni.showToast({
			title: `找到${filteredQAs.length}条相关记录`,
			icon: 'success'
		})
	}
}

// 打开问答
const openQA = (qa) => {
	currentQA.value = qa
	selectedQA.value = qa
	// 滚动到底部
	nextTick(() => {
		scrollToBottom()
	})
}

// 关闭问答
const closeQA = () => {
	currentQA.value = null
	selectedQA.value = null
	inputMessage.value = ''
}

// 显示问答操作
const showQAActions = (qa) => {
	selectedQA.value = qa
	showActions.value = true
}

// 显示问答菜单
const showQAMenu = () => {
	showMenu.value = true
}

// 处理问答操作
const handleQAAction = (action) => {
	switch (action.name) {
		case '收藏问答':
			uni.showToast({
				title: '已收藏问答',
				icon: 'success'
			})
			break
		case '分享问答':
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			})
			break
		case '删除问答':
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个问答吗？',
				success: (res) => {
					if (res.confirm) {
						const index = qaList.value.findIndex(item => item.id === selectedQA.value.id)
						if (index > -1) {
							qaList.value.splice(index, 1)
							uni.showToast({
								title: '已删除',
								icon: 'success'
							})
						}
					}
				}
			})
			break
	}
}

// 处理问答菜单操作
const handleQAMenuAction = (action) => {
	switch (action.name) {
		case '清空记录':
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有问答记录吗？',
				success: (res) => {
					if (res.confirm) {
						messages.value = []
						uni.showToast({
							title: '已清空',
							icon: 'success'
						})
					}
				}
			})
			break
		case '导出记录':
			uni.showToast({
				title: '导出功能开发中',
				icon: 'none'
			})
			break
		case '设置':
			uni.showToast({
				title: '设置功能开发中',
				icon: 'none'
			})
			break
	}
}

// 发送消息
const sendMessage = () => {
	if (!inputMessage.value.trim()) return
	
	const newMessage = {
		id: Date.now(),
		content: inputMessage.value,
		time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
		isMine: true,
		avatar: 'https://picsum.photos/100/100?random=10'
	}
	
	messages.value.push(newMessage)
	const question = inputMessage.value
	inputMessage.value = ''
	
	// 滚动到底部
	nextTick(() => {
		scrollToBottom()
	})
	
	// 模拟AI回复
	setTimeout(() => {
		const aiResponses = [
			'这是一个很好的问题！让我为您详细解答...',
			'根据我的理解，这个问题的答案是...',
			'我可以为您提供以下建议...',
			'这个问题涉及到几个方面，我来逐一为您分析...',
			'基于最新的信息，我的回答是...'
		]
		
		const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
		
		const replyMessage = {
			id: Date.now() + 1,
			content: randomResponse,
			time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
			isMine: false,
			avatar: 'https://picsum.photos/100/100?random=1'
		}
		messages.value.push(replyMessage)
		
		nextTick(() => {
			scrollToBottom()
		})
	}, 1500)
}

// 滚动到底部
const scrollToBottom = () => {
	const query = uni.createSelectorQuery()
	query.select('.message-list').boundingClientRect()
	query.exec((res) => {
		if (res[0]) {
			scrollTop.value = res[0].height
		}
	})
}

// 加载更多消息
const loadMoreMessages = () => {
	uni.showToast({
		title: '加载更多问答记录功能开发中',
		icon: 'none'
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

// 页面加载
onMounted(() => {
	console.log('聊天页面加载完成')
})
</script>

<style scoped>
.chat-container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.qa-list {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.search-header {
	padding: 30rpx 20rpx 20rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	position: relative;
}

.search-header::after {
	content: '';
	position: absolute;
	bottom: -20rpx;
	left: 0;
	right: 0;
	height: 40rpx;
	background: inherit;
	border-radius: 0 0 50% 50% / 0 0 100% 100%;
	z-index: -1;
}

.qa-items {
	flex: 1;
}

.qa-item {
	display: flex;
	align-items: center;
	padding: 25rpx 20rpx;
	background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
	border-bottom: 1rpx solid #f0f0f0;
	transition: all 0.3s ease;
	margin: 10rpx 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.qa-item:active {
	transform: scale(0.98);
	box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
}

.qa-info {
	flex: 1;
	margin-left: 20rpx;
}

.qa-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.qa-question {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
	line-height: 1.4;
}

.qa-time {
	font-size: 24rpx;
	color: #999;
	background: #f0f0f0;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
}

.qa-answer {
	font-size: 28rpx;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 1.4;
}

.qa-badge {
	margin-left: 20rpx;
}

.empty-state {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.qa-detail {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.qa-header {
	display: flex;
	align-items: center;
	padding: 25rpx 20rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-bottom: 1rpx solid #f0f0f0;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.qa-title {
	flex: 1;
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.message-list {
	flex: 1;
	padding: 30rpx 20rpx;
	background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.message-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 40rpx;
	animation: fadeInUp 0.5s ease-out;
}

.message-item.message-mine {
	flex-direction: row-reverse;
}

.message-content {
	max-width: 70%;
	margin: 0 20rpx;
}

.message-bubble {
	background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
	padding: 25rpx;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	position: relative;
}

.message-bubble::before {
	content: '';
	position: absolute;
	top: 20rpx;
	left: -10rpx;
	width: 0;
	height: 0;
	border: 10rpx solid transparent;
	border-right-color: #fff;
	border-left: 0;
}

.message-item.message-mine .message-bubble {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.message-item.message-mine .message-bubble::before {
	left: auto;
	right: -10rpx;
	border-right: 0;
	border-left: 10rpx solid transparent;
	border-left-color: #667eea;
}

.message-text {
	font-size: 30rpx;
	line-height: 1.6;
}

.message-time {
	font-size: 24rpx;
	color: #999;
	margin-top: 12rpx;
	text-align: center;
	background: rgba(255, 255, 255, 0.8);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	display: inline-block;
}

.input-section {
	display: flex;
	align-items: center;
	padding: 25rpx 20rpx;
	background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
	border-top: 1rpx solid #f0f0f0;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.input-toolbar {
	display: flex;
	margin-right: 20rpx;
}

.input-toolbar .u-button {
	margin-right: 15rpx;
	border-radius: 50%;
	width: 60rpx;
	height: 60rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
	transition: all 0.3s ease;
}

.input-toolbar .u-button:active {
	transform: scale(0.9);
}

.input-section .u-input {
	flex: 1;
	margin-right: 20rpx;
}

/* 动画效果 */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
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
	background: rgba(102, 126, 234, 0.3);
	border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(102, 126, 234, 0.5);
}
</style>