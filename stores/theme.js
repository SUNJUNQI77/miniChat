import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
	state: () => ({
		// 主题模式：'light' | 'dark' | 'auto'
		mode: 'auto',
		// 当前实际主题：'light' | 'dark'
		currentTheme: 'light',
		// 系统主题：'light' | 'dark'
		systemTheme: 'light'
	}),
	
	getters: {
		// 是否为暗色主题
		isDark: (state) => state.currentTheme === 'dark',
		
		// 获取主题配置
		themeConfig: (state) => {
			const isDark = state.currentTheme === 'dark'
			return {
				// 背景色
				background: isDark ? '#1a1a1a' : '#f5f7fa',
				backgroundGradient: isDark 
					? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
					: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
				
				// 卡片背景
				cardBackground: isDark ? '#2d3748' : '#ffffff',
				cardBackgroundTransparent: isDark 
					? 'rgba(45, 55, 72, 0.95)' 
					: 'rgba(255, 255, 255, 0.95)',
				
				// 文字颜色
				textPrimary: isDark ? '#ffffff' : '#333333',
				textSecondary: isDark ? '#a0aec0' : '#666666',
				textTertiary: isDark ? '#718096' : '#999999',
				
				// 边框颜色
				borderColor: isDark ? '#4a5568' : '#e2e8f0',
				borderColorLight: isDark ? '#2d3748' : '#f7fafc',
				
				// 阴影
				shadow: isDark 
					? '0 8rpx 32rpx rgba(0, 0, 0, 0.3)' 
					: '0 8rpx 32rpx rgba(0, 0, 0, 0.08)',
				shadowLight: isDark 
					? '0 4rpx 16rpx rgba(0, 0, 0, 0.2)' 
					: '0 4rpx 16rpx rgba(0, 0, 0, 0.05)',
				
				// 输入框背景
				inputBackground: isDark ? '#4a5568' : '#f8f9fa',
				
				// 消息气泡
				messageBubbleMine: isDark 
					? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
					: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				messageBubbleOther: isDark ? '#4a5568' : '#ffffff',
				
				// 主题色
				primary: '#667eea',
				primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				
				// 状态颜色
				success: '#4CAF50',
				warning: '#FF9800',
				error: '#f56565',
				info: '#2196F3'
			}
		}
	},
	
	actions: {
		// 初始化主题
		initTheme() {
			// 从本地存储获取主题设置
			const savedMode = uni.getStorageSync('themeMode')
			if (savedMode) {
				this.mode = savedMode
			}
			
			// 检测系统主题
			this.detectSystemTheme()
			
			// 应用主题
			this.applyTheme()
		},
		
		// 检测系统主题
		detectSystemTheme() {
			// #ifdef MP-WEIXIN
			wx.getSystemInfo({
				success: (res) => {
					this.systemTheme = res.theme || 'light'
					if (this.mode === 'auto') {
						this.currentTheme = this.systemTheme
					}
				}
			})
			// #endif
			
			// #ifdef H5
			// H5环境检测系统主题
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
			this.systemTheme = mediaQuery.matches ? 'dark' : 'light'
			if (this.mode === 'auto') {
				this.currentTheme = this.systemTheme
			}
			
			// 监听系统主题变化
			mediaQuery.addListener((e) => {
				this.systemTheme = e.matches ? 'dark' : 'light'
				if (this.mode === 'auto') {
					this.currentTheme = this.systemTheme
					this.applyTheme()
				}
			})
			// #endif
		},
		
		// 设置主题模式
		setThemeMode(mode) {
			this.mode = mode
			
			// 根据模式设置当前主题
			if (mode === 'auto') {
				this.currentTheme = this.systemTheme
			} else {
				this.currentTheme = mode
			}
			
			// 保存到本地存储
			uni.setStorageSync('themeMode', mode)
			
			// 应用主题
			this.applyTheme()
		},
		
		// 切换主题
		toggleTheme() {
			const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
			this.setThemeMode(newTheme)
		},
		
		// 应用主题
		applyTheme() {
			const config = this.themeConfig
			
			// 设置CSS变量
			document.documentElement.style.setProperty('--background', config.background)
			document.documentElement.style.setProperty('--background-gradient', config.backgroundGradient)
			document.documentElement.style.setProperty('--card-background', config.cardBackground)
			document.documentElement.style.setProperty('--text-primary', config.textPrimary)
			document.documentElement.style.setProperty('--text-secondary', config.textSecondary)
			document.documentElement.style.setProperty('--border-color', config.borderColor)
			document.documentElement.style.setProperty('--shadow', config.shadow)
			
			// 触发主题变化事件
			uni.$emit('themeChanged', config)
		},
		
		// 获取主题配置
		getThemeConfig() {
			return this.themeConfig
		}
	}
})
