<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
	console.log('App Launch')
	// 检查登录状态
	checkLoginStatus()
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})

// 检查登录状态
const checkLoginStatus = () => {
	// 这里可以检查本地存储的登录状态
	const token = uni.getStorageSync('token')
	if (!token) {
		// 如果没有登录，跳转到登录页
		uni.reLaunch({
			url: '/pages/login/index'
		})
	}
}
</script>

<style>
/* 全局样式 */
page {
	background-color: #f5f5f5;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 通用样式类 */
.container {
	padding: 20rpx;
}

.card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.text-center {
	text-align: center;
}

.text-primary {
	color: #007aff;
}

.text-success {
	color: #19be6b;
}

.text-warning {
	color: #ff9900;
}

.text-error {
	color: #f56c6c;
}

.text-muted {
	color: #999;
}

/* 按钮样式 */
.btn-primary {
	background-color: #007aff;
	color: #fff;
}

.btn-success {
	background-color: #19be6b;
	color: #fff;
}

.btn-warning {
	background-color: #ff9900;
	color: #fff;
}

.btn-error {
	background-color: #f56c6c;
	color: #fff;
}

/* 输入框样式 */
.input-group {
	margin-bottom: 30rpx;
}

.input-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
}

/* 列表样式 */
.list-item {
	display: flex;
	align-items: center;
	padding: 30rpx 20rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.list-item:last-child {
	border-bottom: none;
}

.list-item-content {
	flex: 1;
	margin-left: 20rpx;
}

.list-item-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
}

.list-item-subtitle {
	font-size: 24rpx;
	color: #666;
}

/* 头像样式 */
.avatar {
	border-radius: 50%;
}

/* 徽章样式 */
.badge {
	background-color: #f56c6c;
	color: #fff;
	border-radius: 20rpx;
	padding: 4rpx 12rpx;
	font-size: 20rpx;
}

/* 分割线 */
.divider {
	height: 1rpx;
	background-color: #f0f0f0;
	margin: 20rpx 0;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 40rpx;
	color: #999;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
}
</style>
