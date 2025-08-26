import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => ({
		userInfo: {
			name: '用户',
			email: 'user@example.com',
			avatar: 'https://picsum.photos/200/200?random=1',
			openid: '',
			unionid: '',
			phone: '',
			isLogin: false
		},
		loading: false
	}),
	
	getters: {
		isLoggedIn: (state) => state.userInfo.isLogin,
		userAvatar: (state) => state.userInfo.avatar,
		userName: (state) => state.userInfo.name
	},
	
	actions: {
		// 设置用户信息
		setUserInfo(userInfo) {
			this.userInfo = { ...this.userInfo, ...userInfo, isLogin: true }
			// 保存到本地存储
			uni.setStorageSync('userInfo', this.userInfo)
		},
		
		// 获取用户信息
		getUserInfo() {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				this.userInfo = userInfo
			}
			return this.userInfo
		},
		
		// 手机号登录
		async phoneLogin(phone) {
			this.loading = true
			try {
				// 模拟手机号登录请求
				await new Promise(resolve => setTimeout(resolve, 1500))
				
				const mockUserInfo = {
					name: `用户${phone.slice(-4)}`,
					email: `${phone}@example.com`,
					avatar: 'https://picsum.photos/200/200?random=1',
					openid: '',
					unionid: '',
					phone: phone,
					isLogin: true
				}
				
				this.setUserInfo(mockUserInfo)
				
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				
				return true
			} catch (error) {
				console.error('手机号登录错误:', error)
				uni.showToast({
					title: '登录失败',
					icon: 'error'
				})
				return false
			} finally {
				this.loading = false
			}
		},
		
		// 微信一键登录（获取手机号）
		async wxPhoneLogin() {
			this.loading = true
			try {
				// 获取微信登录code
				const loginRes = await uni.login({
					provider: 'weixin'
				})
				
				if (!loginRes.code) {
					throw new Error('微信登录失败')
				}
				
				// 注意：uni.getPhoneNumber 需要在button组件中使用open-type="getPhoneNumber"
				// 这里提供一个模拟的实现，实际使用时需要在页面中通过button组件触发
				console.log('微信登录code:', loginRes.code)
				
				// 模拟获取手机号的过程
				// 在实际项目中，手机号获取需要通过button组件的open-type="getPhoneNumber"
				// 然后在button的getphonenumber事件中处理
				
				// 模拟后端接口调用，使用获取到的手机号
				// 实际项目中，这里应该将code和encryptedData发送到后端解密获取手机号
				const mockPhone = '138****8888' // 实际应该是从后端解密得到的手机号
				
				const mockUserInfo = {
					name: `用户${mockPhone.slice(-4)}`,
					avatar: 'https://picsum.photos/200/200?random=1',
					email: `${mockPhone}@wechat.com`,
					openid: loginRes.code, // 实际应该是后端返回的openid
					unionid: '', // 实际应该是后端返回的unionid
					phone: mockPhone,
					isLogin: true
				}
				
				this.setUserInfo(mockUserInfo)
				
				uni.showToast({
					title: '微信一键登录成功',
					icon: 'success'
				})
				
				return true
			} catch (error) {
				console.error('微信一键登录错误:', error)
				uni.showToast({
					title: error.message || '微信一键登录失败',
					icon: 'error'
				})
				return false
			} finally {
				this.loading = false
			}
		},
		
		// 微信登录
		async wxLogin() {
			this.loading = true
			try {
				// 获取微信登录code
				const loginRes = await uni.login({
					provider: 'weixin'
				})
				
				if (loginRes.code) {
					// 获取用户信息
					const userInfoRes = await uni.getUserProfile({
						desc: '用于完善用户资料'
					})
					
					// 模拟后端接口调用
					const mockUserInfo = {
						name: userInfoRes.userInfo.nickName || '微信用户',
						avatar: userInfoRes.userInfo.avatarUrl || 'https://picsum.photos/200/200?random=1',
						email: `${userInfoRes.userInfo.nickName}@wechat.com`,
						openid: loginRes.code, // 实际应该是后端返回的openid
						unionid: '', // 实际应该是后端返回的unionid
						phone: '',
						isLogin: true
					}
					
					this.setUserInfo(mockUserInfo)
					
					uni.showToast({
						title: '微信登录成功',
						icon: 'success'
					})
					
					return true
				} else {
					throw new Error('微信登录失败')
				}
			} catch (error) {
				console.error('微信登录错误:', error)
				uni.showToast({
					title: '微信登录失败',
					icon: 'error'
				})
				return false
			} finally {
				this.loading = false
			}
		},
		
		// 处理微信获取手机号回调
		async handleGetPhoneNumber(e) {
			this.loading = true
			try {
				console.log('获取手机号回调:', e)
				
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					throw new Error('用户拒绝授权手机号')
				}
				
				// 获取微信登录code
				const loginRes = await uni.login({
					provider: 'weixin'
				})
				
				if (!loginRes.code) {
					throw new Error('微信登录失败')
				}
				
				// 实际项目中，这里应该将以下数据发送到后端：
				// - code: 登录凭证
				// - encryptedData: 加密的用户数据
				// - iv: 加密算法的初始向量
				// 后端解密后返回用户手机号
				
				// 模拟后端接口调用
				const mockPhone = '138****8888' // 实际应该是从后端解密得到的手机号
				
				const mockUserInfo = {
					name: `用户${mockPhone.slice(-4)}`,
					avatar: 'https://picsum.photos/200/200?random=1',
					email: `${mockPhone}@wechat.com`,
					openid: loginRes.code, // 实际应该是后端返回的openid
					unionid: '', // 实际应该是后端返回的unionid
					phone: mockPhone,
					isLogin: true
				}
				
				this.setUserInfo(mockUserInfo)
				
				uni.showToast({
					title: '微信一键登录成功',
					icon: 'success'
				})
				
				return true
			} catch (error) {
				console.error('微信一键登录错误:', error)
				uni.showToast({
					title: error.message || '微信一键登录失败',
					icon: 'error'
				})
				return false
			} finally {
				this.loading = false
			}
		},
		
		// 普通登录
		async login(username, password) {
			this.loading = true
			try {
				// 模拟登录请求
				await new Promise(resolve => setTimeout(resolve, 1500))
				
				const mockUserInfo = {
					name: username,
					email: `${username}@example.com`,
					avatar: 'https://picsum.photos/200/200?random=1',
					openid: '',
					unionid: '',
					phone: '',
					isLogin: true
				}
				
				this.setUserInfo(mockUserInfo)
				
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				
				return true
			} catch (error) {
				console.error('登录错误:', error)
				uni.showToast({
					title: '登录失败',
					icon: 'error'
				})
				return false
			} finally {
				this.loading = false
			}
		},
		
		// 退出登录
		logout() {
			this.userInfo = {
				name: '用户',
				email: 'user@example.com',
				avatar: 'https://picsum.photos/200/200?random=1',
				openid: '',
				unionid: '',
				phone: '',
				isLogin: false
			}
			
			// 清除本地存储
			uni.removeStorageSync('userInfo')
			
			uni.showToast({
				title: '已退出登录',
				icon: 'success'
			})
		},
		
		// 更新用户信息
		updateUserInfo(userInfo) {
			this.setUserInfo({ ...this.userInfo, ...userInfo })
		}
	}
})
