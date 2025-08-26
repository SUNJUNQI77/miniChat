/**
 * 工具函数使用示例
 */

import { 
	formatDate, 
	getRelativeTime, 
	debounce, 
	throttle, 
	deepClone, 
	generateId,
	formatFileSize,
	isValidEmail,
	isValidPhone,
	getSystemInfo,
	showToast,
	showLoading,
	hideLoading,
	showModal,
	storage
} from './index.js'

import { 
	userAPI, 
	chatAPI, 
	settingsAPI, 
	fileAPI, 
	systemAPI 
} from './api.js'

// 时间格式化示例
export function timeExample() {
	const now = new Date()
	console.log('格式化时间:', formatDate(now, 'YYYY-MM-DD HH:mm:ss'))
	console.log('相对时间:', getRelativeTime(now))
}

// 防抖节流示例
export function debounceThrottleExample() {
	// 防抖函数 - 搜索输入
	const searchInput = debounce((value) => {
		console.log('搜索:', value)
	}, 500)
	
	// 节流函数 - 滚动事件
	const handleScroll = throttle((e) => {
		console.log('滚动位置:', e.scrollTop)
	}, 100)
	
	// 使用示例
	searchInput('hello')
	handleScroll({ scrollTop: 100 })
}

// 深拷贝示例
export function deepCloneExample() {
	const original = {
		name: '张三',
		age: 25,
		hobbies: ['读书', '游泳'],
		address: {
			city: '北京',
			street: '朝阳区'
		}
	}
	
	const cloned = deepClone(original)
	console.log('深拷贝结果:', cloned)
}

// 工具函数示例
export function utilityExample() {
	// 生成ID
	console.log('生成ID:', generateId(10))
	
	// 格式化文件大小
	console.log('文件大小:', formatFileSize(1024 * 1024)) // 1MB
	
	// 验证邮箱
	console.log('邮箱验证:', isValidEmail('test@example.com'))
	
	// 验证手机号
	console.log('手机号验证:', isValidPhone('13800138000'))
}

// 系统信息示例
export async function systemInfoExample() {
	try {
		const info = await getSystemInfo()
		console.log('系统信息:', info)
	} catch (error) {
		console.error('获取系统信息失败:', error)
	}
}

// UI工具示例
export function uiExample() {
	// 显示提示
	showToast('操作成功', 'success')
	
	// 显示加载
	showLoading('加载中...')
	
	// 隐藏加载
	setTimeout(() => {
		hideLoading()
	}, 2000)
	
	// 显示确认对话框
	showModal('确认删除', '确定要删除这条记录吗？').then((confirmed) => {
		if (confirmed) {
			console.log('用户确认删除')
		}
	})
}

// 本地存储示例
export function storageExample() {
	// 存储数据
	storage.set('user', { name: '张三', age: 25 })
	
	// 获取数据
	const user = storage.get('user')
	console.log('用户数据:', user)
	
	// 删除数据
	storage.remove('user')
	
	// 清空所有数据
	// storage.clear()
}

// API使用示例
export async function apiExample() {
	try {
		// 用户登录
		const loginResult = await userAPI.login({
			username: 'test',
			password: '123456'
		})
		console.log('登录结果:', loginResult)
		
		// 发送消息
		const messageResult = await chatAPI.sendMessage({
			content: '你好',
			type: 'text'
		})
		console.log('发送消息结果:', messageResult)
		
		// 获取设置
		const settings = await settingsAPI.getSettings()
		console.log('设置信息:', settings)
		
		// 上传文件
		const uploadResult = await fileAPI.uploadFile('/path/to/file.jpg')
		console.log('上传结果:', uploadResult)
		
		// 获取系统信息
		const systemInfo = await systemAPI.getSystemInfo()
		console.log('系统信息:', systemInfo)
		
	} catch (error) {
		console.error('API调用失败:', error)
	}
}

// 在组件中使用示例
export function componentExample() {
	// 在Vue组件中使用
	return {
		data() {
			return {
				searchValue: '',
				userInfo: null
			}
		},
		
		mounted() {
			// 加载用户信息
			this.loadUserInfo()
			
			// 设置防抖搜索
			this.debouncedSearch = debounce(this.handleSearch, 500)
		},
		
		methods: {
			// 加载用户信息
			async loadUserInfo() {
				try {
					showLoading('加载中...')
					const result = await userAPI.getUserInfo()
					this.userInfo = result.data
					showToast('加载成功', 'success')
				} catch (error) {
					showToast('加载失败', 'error')
				} finally {
					hideLoading()
				}
			},
			
			// 搜索处理
			handleSearch(value) {
				console.log('搜索:', value)
				// 执行搜索逻辑
			},
			
			// 输入变化
			onInputChange(value) {
				this.searchValue = value
				this.debouncedSearch(value)
			},
			
			// 发送消息
			async sendMessage(content) {
				try {
					const result = await chatAPI.sendMessage({
						content,
						type: 'text'
					})
					console.log('消息发送成功:', result)
				} catch (error) {
					showToast('发送失败', 'error')
				}
			}
		}
	}
}

// 导出所有示例
export default {
	timeExample,
	debounceThrottleExample,
	deepCloneExample,
	utilityExample,
	systemInfoExample,
	uiExample,
	storageExample,
	apiExample,
	componentExample
}
