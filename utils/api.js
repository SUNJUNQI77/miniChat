/**
 * API服务
 */

import request from './request.js'

// 用户相关API
export const userAPI = {
	// 用户登录
	login: (data) => request.post('/user/login', data),
	
	// 用户注册
	register: (data) => request.post('/user/register', data),
	
	// 获取用户信息
	getUserInfo: () => request.get('/user/info'),
	
	// 更新用户信息
	updateUserInfo: (data) => request.put('/user/info', data),
	
	// 上传头像
	uploadAvatar: (filePath) => request.uploadFile('/user/avatar', filePath),
	
	// 修改密码
	changePassword: (data) => request.post('/user/change-password', data),
	
	// 退出登录
	logout: () => request.post('/user/logout')
}

// 聊天相关API
export const chatAPI = {
	// 发送消息
	sendMessage: (data) => request.post('/chat/send', data),
	
	// 获取聊天历史
	getChatHistory: (params) => request.get('/chat/history', params),
	
	// 获取聊天列表
	getChatList: (params) => request.get('/chat/list', params),
	
	// 删除聊天记录
	deleteChat: (chatId) => request.delete(`/chat/${chatId}`),
	
	// 清空聊天记录
	clearChatHistory: () => request.delete('/chat/clear'),
	
	// 获取快捷问题
	getQuickQuestions: () => request.get('/chat/quick-questions'),
	
	// 语音识别
	voiceToText: (filePath) => request.uploadFile('/chat/voice', filePath, 'voice'),
	
	// 图片识别
	imageToText: (filePath) => request.uploadFile('/chat/image', filePath, 'image')
}

// 设置相关API
export const settingsAPI = {
	// 获取设置
	getSettings: () => request.get('/settings'),
	
	// 更新设置
	updateSettings: (data) => request.put('/settings', data),
	
	// 获取主题配置
	getThemeConfig: () => request.get('/settings/theme'),
	
	// 更新主题配置
	updateThemeConfig: (data) => request.put('/settings/theme', data)
}

// 文件相关API
export const fileAPI = {
	// 上传文件
	uploadFile: (filePath, type = 'file') => request.uploadFile('/file/upload', filePath, type),
	
	// 下载文件
	downloadFile: (fileId) => request.downloadFile(`/file/download/${fileId}`),
	
	// 删除文件
	deleteFile: (fileId) => request.delete(`/file/${fileId}`)
}

// 系统相关API
export const systemAPI = {
	// 获取系统信息
	getSystemInfo: () => request.get('/system/info'),
	
	// 检查更新
	checkUpdate: () => request.get('/system/check-update'),
	
	// 获取配置
	getConfig: () => request.get('/system/config'),
	
	// 反馈
	feedback: (data) => request.post('/system/feedback', data)
}

// 默认导出所有API
export default {
	user: userAPI,
	chat: chatAPI,
	settings: settingsAPI,
	file: fileAPI,
	system: systemAPI
}
