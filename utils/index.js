/**
 * 通用工具函数
 */

/**
 * 格式化时间
 * @param {Date|string|number} date 日期
 * @param {string} format 格式字符串
 * @returns {string} 格式化后的时间字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
	const d = new Date(date)
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	const hours = String(d.getHours()).padStart(2, '0')
	const minutes = String(d.getMinutes()).padStart(2, '0')
	const seconds = String(d.getSeconds()).padStart(2, '0')
	
	return format
		.replace('YYYY', year)
		.replace('MM', month)
		.replace('DD', day)
		.replace('HH', hours)
		.replace('mm', minutes)
		.replace('ss', seconds)
}

/**
 * 获取相对时间
 * @param {Date|string|number} date 日期
 * @returns {string} 相对时间字符串
 */
export function getRelativeTime(date) {
	const now = new Date()
	const target = new Date(date)
	const diff = now - target
	
	const minute = 60 * 1000
	const hour = 60 * minute
	const day = 24 * hour
	const week = 7 * day
	const month = 30 * day
	const year = 365 * day
	
	if (diff < minute) {
		return '刚刚'
	} else if (diff < hour) {
		return `${Math.floor(diff / minute)}分钟前`
	} else if (diff < day) {
		return `${Math.floor(diff / hour)}小时前`
	} else if (diff < week) {
		return `${Math.floor(diff / day)}天前`
	} else if (diff < month) {
		return `${Math.floor(diff / week)}周前`
	} else if (diff < year) {
		return `${Math.floor(diff / month)}个月前`
	} else {
		return `${Math.floor(diff / year)}年前`
	}
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300, immediate = false) {
	let timeout
	return function executedFunction(...args) {
		const later = () => {
			timeout = null
			if (!immediate) func.apply(this, args)
		}
		const callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(this, args)
	}
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} wait 等待时间
 * @returns {Function} 节流后的函数
 */
export function throttle(func, wait = 300) {
	let timeout
	let previous = 0
	return function executedFunction(...args) {
		const now = Date.now()
		const remaining = wait - (now - previous)
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			previous = now
			func.apply(this, args)
		} else if (!timeout) {
			timeout = setTimeout(() => {
				previous = Date.now()
				timeout = null
				func.apply(this, args)
			}, remaining)
		}
	}
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export function deepClone(obj) {
	if (obj === null || typeof obj !== 'object') return obj
	if (obj instanceof Date) return new Date(obj.getTime())
	if (obj instanceof Array) return obj.map(item => deepClone(item))
	if (typeof obj === 'object') {
		const clonedObj = {}
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				clonedObj[key] = deepClone(obj[key])
			}
		}
		return clonedObj
	}
}

/**
 * 生成唯一ID
 * @param {number} length ID长度
 * @returns {string} 唯一ID
 */
export function generateId(length = 8) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
	if (bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 验证邮箱格式
 * @param {string} email 邮箱地址
 * @returns {boolean} 是否有效
 */
export function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

/**
 * 验证手机号格式
 * @param {string} phone 手机号
 * @returns {boolean} 是否有效
 */
export function isValidPhone(phone) {
	const phoneRegex = /^1[3-9]\d{9}$/
	return phoneRegex.test(phone)
}

/**
 * 获取系统信息
 * @returns {Promise} 系统信息
 */
export function getSystemInfo() {
	return new Promise((resolve, reject) => {
		uni.getSystemInfo({
			success: resolve,
			fail: reject
		})
	})
}

/**
 * 显示提示信息
 * @param {string} title 提示内容
 * @param {string} icon 图标类型
 * @param {number} duration 显示时长
 */
export function showToast(title, icon = 'none', duration = 2000) {
	uni.showToast({
		title,
		icon,
		duration
	})
}

/**
 * 显示加载提示
 * @param {string} title 提示内容
 * @param {boolean} mask 是否显示遮罩
 */
export function showLoading(title = '加载中...', mask = true) {
	uni.showLoading({
		title,
		mask
	})
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
	uni.hideLoading()
}

/**
 * 显示确认对话框
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {boolean} showCancel 是否显示取消按钮
 * @returns {Promise} 用户选择结果
 */
export function showModal(title, content, showCancel = true) {
	return new Promise((resolve) => {
		uni.showModal({
			title,
			content,
			showCancel,
			success: (res) => {
				resolve(res.confirm)
			}
		})
	})
}

/**
 * 本地存储工具
 */
export const storage = {
	/**
	 * 设置存储
	 * @param {string} key 键名
	 * @param {any} value 值
	 */
	set(key, value) {
		try {
			uni.setStorageSync(key, JSON.stringify(value))
		} catch (e) {
			console.error('存储失败:', e)
		}
	},
	
	/**
	 * 获取存储
	 * @param {string} key 键名
	 * @param {any} defaultValue 默认值
	 * @returns {any} 存储的值
	 */
	get(key, defaultValue = null) {
		try {
			const value = uni.getStorageSync(key)
			return value ? JSON.parse(value) : defaultValue
		} catch (e) {
			console.error('读取存储失败:', e)
			return defaultValue
		}
	},
	
	/**
	 * 删除存储
	 * @param {string} key 键名
	 */
	remove(key) {
		try {
			uni.removeStorageSync(key)
		} catch (e) {
			console.error('删除存储失败:', e)
		}
	},
	
	/**
	 * 清空所有存储
	 */
	clear() {
		try {
			uni.clearStorageSync()
		} catch (e) {
			console.error('清空存储失败:', e)
		}
	}
}
