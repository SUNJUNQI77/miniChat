import { defineStore } from 'pinia'

export const useQAStore = defineStore('qa', {
	state: () => ({
		qaHistory: [
			{
				id: 1,
				question: '如何学习编程？',
				time: '14:30',
				messages: [
					{
						id: 1,
						content: '如何学习编程？',
						time: '14:30',
						isMine: true,
						avatar: 'https://picsum.photos/100/100?random=10'
					},
					{
						id: 2,
						content: '学习编程建议从基础开始：1. 选择一门入门语言（如Python）2. 学习基础语法 3. 做小项目练习 4. 阅读优秀代码 5. 持续学习和实践',
						time: '14:31',
						isMine: false,
						avatar: 'https://picsum.photos/100/100?random=1'
					}
				]
			},
			{
				id: 2,
				question: '什么是人工智能？',
				time: '12:15',
				messages: [
					{
						id: 1,
						content: '什么是人工智能？',
						time: '12:15',
						isMine: true,
						avatar: 'https://picsum.photos/100/100?random=10'
					},
					{
						id: 2,
						content: '人工智能是计算机科学的一个分支，旨在创建能够执行通常需要人类智能的任务的系统。',
						time: '12:16',
						isMine: false,
						avatar: 'https://picsum.photos/100/100?random=1'
					}
				]
			}
		],
		currentQA: null,
		currentTitle: '智能问答',
		quickQuestions: [
			'如何学习编程？',
			'什么是人工智能？',
			'如何提高英语口语？',
			'健康饮食的建议',
			'如何管理时间？'
		]
	}),
	
	getters: {
		historyCount: (state) => state.qaHistory.length,
		hasCurrentQA: (state) => !!state.currentQA,
		currentMessages: (state) => state.currentQA?.messages || []
	},
	
	actions: {
		// 添加新的问答
		addQA(question) {
			const newQA = {
				id: Date.now(),
				question: question,
				time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
				messages: []
			}
			
			this.qaHistory.unshift(newQA)
			this.currentQA = newQA
			this.currentTitle = question.length > 20 ? question.substring(0, 20) + '...' : question
			
			// 保存到本地存储
			this.saveToStorage()
			
			return newQA
		},
		
		// 添加消息到当前问答
		addMessage(content, isMine = true) {
			if (!this.currentQA) {
				return
			}
			
			const newMessage = {
				id: Date.now(),
				content: content,
				time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
				isMine: isMine,
				avatar: isMine ? 'https://picsum.photos/100/100?random=10' : 'https://picsum.photos/100/100?random=1'
			}
			
			this.currentQA.messages.push(newMessage)
			
			// 更新历史记录中的问答
			const historyIndex = this.qaHistory.findIndex(qa => qa.id === this.currentQA.id)
			if (historyIndex > -1) {
				this.qaHistory[historyIndex] = { ...this.currentQA }
			}
			
			// 保存到本地存储
			this.saveToStorage()
			
			return newMessage
		},
		
		// 设置当前问答
		setCurrentQA(qa) {
			this.currentQA = qa
			this.currentTitle = qa.question.length > 20 ? qa.question.substring(0, 20) + '...' : qa.question
		},
		
		// 清空当前问答
		clearCurrentQA() {
			this.currentQA = null
			this.currentTitle = '智能问答'
		},
		
		// 清空历史记录
		clearHistory() {
			this.qaHistory = []
			this.currentQA = null
			this.currentTitle = '智能问答'
			this.saveToStorage()
		},
		
		// 删除指定问答
		deleteQA(qaId) {
			const index = this.qaHistory.findIndex(qa => qa.id === qaId)
			if (index > -1) {
				this.qaHistory.splice(index, 1)
				if (this.currentQA && this.currentQA.id === qaId) {
					this.clearCurrentQA()
				}
				this.saveToStorage()
			}
		},
		
		// 保存到本地存储
		saveToStorage() {
			uni.setStorageSync('qaHistory', this.qaHistory)
		},
		
		// 从本地存储加载
		loadFromStorage() {
			const qaHistory = uni.getStorageSync('qaHistory')
			if (qaHistory) {
				this.qaHistory = qaHistory
			}
		},
		
		// 模拟AI回复
		async simulateAIReply() {
			if (!this.currentQA) return
			
			const aiResponses = [
				'这是一个很好的问题！让我为您详细解答...',
				'根据我的理解，这个问题的答案是...',
				'我可以为您提供以下建议...',
				'这个问题涉及到几个方面，我来逐一为您分析...',
				'基于最新的信息，我的回答是...'
			]
			
			const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
			
			// 延迟1.5秒模拟AI思考时间
			await new Promise(resolve => setTimeout(resolve, 1500))
			
			this.addMessage(randomResponse, false)
		}
	}
})
