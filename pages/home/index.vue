<template>
	<view class="home-container">
		<!-- 顶部搜索栏 -->
		<view class="search-header">
			<u-search 
				v-model="searchKeyword" 
				placeholder="输入您的问题..." 
				:showAction="false"
				@search="handleSearch"
				@click="handleSearchClick"
			></u-search>
		</view>
		
		<!-- 轮播图 -->
		<view class="banner-section">
			<u-swiper 
				:list="bannerList" 
				:autoplay="true" 
				:interval="3000"
				height="300"
				:indicator="true"
				indicatorMode="dot"
			></u-swiper>
		</view>
		
		<!-- 功能模块 -->
		<view class="function-section">
			<u-grid :col="4" :border="false">
				<u-grid-item 
					v-for="(item, index) in functionList" 
					:key="index"
					@click="handleFunctionClick(item)"
				>
					<u-icon :name="item.icon" size="50" :color="item.color"></u-icon>
					<text class="function-text">{{ item.name }}</text>
				</u-grid-item>
			</u-grid>
		</view>
		
		<!-- 热门问题 -->
		<view class="hot-questions-section">
			<view class="section-header">
				<text class="section-title">热门问题</text>
				<u-link text="更多" @click="goToMoreQuestions"></u-link>
			</view>
			
			<view class="question-list">
				<view 
					class="question-item" 
					v-for="(question, index) in hotQuestions" 
					:key="index"
					@click="askQuestion(question)"
				>
					<u-icon name="help-circle" size="30" color="#007aff"></u-icon>
					<text class="question-text">{{ question.title }}</text>
					<u-icon name="arrow-right" size="20" color="#ccc"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 最近问答 -->
		<view class="recent-section">
			<view class="section-header">
				<text class="section-title">最近问答</text>
				<u-link text="全部" @click="goToAllRecords"></u-link>
			</view>
			
			<view class="qa-list">
				<view 
					class="qa-item" 
					v-for="(qa, index) in recentQAs" 
					:key="index"
					@click="viewQA(qa)"
				>
					<u-avatar :src="qa.avatar" size="60"></u-avatar>
					<view class="qa-info">
						<view class="qa-header">
							<text class="qa-title">{{ qa.question }}</text>
							<text class="qa-time">{{ qa.time }}</text>
						</view>
						<text class="qa-answer">{{ qa.answer }}</text>
					</view>
					<view class="qa-badge" v-if="qa.isNew">
						<u-badge value="新" :max="99"></u-badge>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 响应式数据
const searchKeyword = ref('')

// 轮播图数据
const bannerList = ref([
	{
		image: 'https://picsum.photos/400/200?random=1',
		title: '欢迎使用智能问答'
	},
	{
		image: 'https://picsum.photos/400/200?random=2',
		title: 'AI助手为您解答'
	},
	{
		image: 'https://picsum.photos/400/200?random=3',
		title: '智能学习助手'
	}
])

// 功能模块
const functionList = ref([
	{ name: '语音问答', icon: 'mic', color: '#2979ff', action: 'voiceQA' },
	{ name: '图片识别', icon: 'camera', color: '#19be6b', action: 'imageRecognition' },
	{ name: '文档问答', icon: 'file-text', color: '#ff9900', action: 'documentQA' },
	{ name: '翻译助手', icon: 'translate', color: '#f56c6c', action: 'translate' },
	{ name: '代码助手', icon: 'code', color: '#9c26b0', action: 'codeHelper' },
	{ name: '收藏夹', icon: 'star', color: '#ffc107', action: 'favorites' },
	{ name: '设置', icon: 'setting', color: '#607d8b', action: 'settings' },
	{ name: '帮助', icon: 'help-circle', color: '#795548', action: 'help' }
])

// 热门问题
const hotQuestions = ref([
	{ id: 1, title: '如何学习编程？', category: '学习' },
	{ id: 2, title: '什么是人工智能？', category: '科技' },
	{ id: 3, title: '如何提高英语口语？', category: '语言' },
	{ id: 4, title: '健康饮食的建议', category: '健康' },
	{ id: 5, title: '如何管理时间？', category: '生活' }
])

// 最近问答
const recentQAs = ref([
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
	}
])

// 搜索处理
const handleSearch = (value) => {
	if (!value.trim()) {
		uni.showToast({
			title: '请输入问题',
			icon: 'none'
		})
		return
	}
	
	// 跳转到问答页面
	uni.navigateTo({
		url: `/pages/chat/index?question=${encodeURIComponent(value)}`
	})
}

const handleSearchClick = () => {
	uni.showToast({
		title: '请输入您的问题',
		icon: 'none'
	})
}

// 功能模块点击
const handleFunctionClick = (item) => {
	switch (item.action) {
		case 'voiceQA':
			uni.showModal({
				title: '语音问答',
				content: '点击确定开始语音输入',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '语音问答功能开发中',
							icon: 'none'
						})
					}
				}
			})
			break
		case 'imageRecognition':
			uni.chooseImage({
				count: 1,
				success: (res) => {
					uni.showToast({
						title: '图片识别功能开发中',
						icon: 'none'
					})
				}
			})
			break
		case 'documentQA':
			uni.showToast({
				title: '文档问答功能开发中',
				icon: 'none'
			})
			break
		case 'translate':
			uni.showToast({
				title: '翻译助手功能开发中',
				icon: 'none'
			})
			break
		case 'codeHelper':
			uni.showToast({
				title: '代码助手功能开发中',
				icon: 'none'
			})
			break
		default:
			uni.showToast({
				title: `${item.name}功能开发中`,
				icon: 'none'
			})
	}
}

// 问题相关
const askQuestion = (question) => {
	uni.navigateTo({
		url: `/pages/chat/index?question=${encodeURIComponent(question.title)}`
	})
}

const goToMoreQuestions = () => {
	uni.showToast({
		title: '更多问题功能开发中',
		icon: 'none'
	})
}

// 问答相关
const viewQA = (qa) => {
	uni.navigateTo({
		url: `/pages/chat/index?id=${qa.id}&question=${encodeURIComponent(qa.question)}`
	})
}

const goToAllRecords = () => {
	uni.switchTab({
		url: '/pages/chat/index'
	})
}

// 页面加载
onMounted(() => {
	console.log('首页加载完成')
})
</script>

<style scoped>
.home-container {
	background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
	min-height: 100vh;
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

.banner-section {
	margin: 40rpx 20rpx 30rpx;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.function-section {
	margin: 30rpx 20rpx;
	background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
	border-radius: 20rpx;
	padding: 40rpx 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.function-text {
	font-size: 26rpx;
	color: #333;
	margin-top: 20rpx;
	font-weight: 500;
}

.hot-questions-section {
	margin: 30rpx 20rpx;
	background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	position: relative;
}

.section-title::after {
	content: '';
	position: absolute;
	bottom: -8rpx;
	left: 0;
	width: 40rpx;
	height: 4rpx;
	background: linear-gradient(90deg, #667eea, #764ba2);
	border-radius: 2rpx;
}

.question-list {
	display: flex;
	flex-direction: column;
}

.question-item {
	display: flex;
	align-items: center;
	padding: 25rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
	transition: all 0.3s ease;
}

.question-item:last-child {
	border-bottom: none;
}

.question-item:active {
	background-color: #f8f9fa;
	border-radius: 12rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	margin: 0 -20rpx;
}

.question-text {
	flex: 1;
	margin-left: 20rpx;
	font-size: 30rpx;
	color: #333;
	line-height: 1.5;
}

.recent-section {
	margin: 30rpx 20rpx 40rpx;
	background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.qa-list {
	display: flex;
	flex-direction: column;
}

.qa-item {
	display: flex;
	align-items: center;
	padding: 25rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
	transition: all 0.3s ease;
}

.qa-item:last-child {
	border-bottom: none;
}

.qa-item:active {
	background-color: #f8f9fa;
	border-radius: 12rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	margin: 0 -20rpx;
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

.qa-title {
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

/* 动画效果 */
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

.function-section,
.hot-questions-section,
.recent-section {
	animation: fadeInUp 0.6s ease-out;
}

.hot-questions-section {
	animation-delay: 0.1s;
}

.recent-section {
	animation-delay: 0.2s;
}
</style>