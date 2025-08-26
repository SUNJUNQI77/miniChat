/**
 * 请求工具类
 */

import { showToast, showLoading, hideLoading } from './index.js'

// 基础配置
const config = {
	baseURL: 'https://api.example.com', // 替换为实际的API地址
	timeout: 10000,
	header: {
		'Content-Type': 'application/json'
	}
}

// 请求拦截器
const requestInterceptors = []
// 响应拦截器
const responseInterceptors = []

/**
 * 添加请求拦截器
 * @param {Function} interceptor 拦截器函数
 */
export function addRequestInterceptor(interceptor) {
	requestInterceptors.push(interceptor)
}

/**
 * 添加响应拦截器
 * @param {Function} interceptor 拦截器函数
 */
export function addResponseInterceptor(interceptor) {
	responseInterceptors.push(interceptor)
}

/**
 * 执行请求拦截器
 * @param {Object} options 请求配置
 * @returns {Object} 处理后的配置
 */
async function executeRequestInterceptors(options) {
	let result = { ...options }
	for (const interceptor of requestInterceptors) {
		result = await interceptor(result)
	}
	return result
}

/**
 * 执行响应拦截器
 * @param {Object} response 响应数据
 * @returns {Object} 处理后的响应
 */
async function executeResponseInterceptors(response) {
	let result = { ...response }
	for (const interceptor of responseInterceptors) {
		result = await interceptor(result)
	}
	return result
}

/**
 * 处理错误
 * @param {Object} error 错误信息
 * @param {Object} options 请求配置
 */
function handleError(error, options) {
	console.error('请求错误:', error)
	
	// 根据错误类型显示不同的提示
	let message = '网络请求失败'
	
	if (error.errMsg) {
		if (error.errMsg.includes('timeout')) {
			message = '请求超时，请检查网络连接'
		} else if (error.errMsg.includes('fail')) {
			message = '网络连接失败，请检查网络设置'
		}
	}
	
	// 如果配置了不显示错误提示，则不显示
	if (options.hideError) {
		return
	}
	
	showToast(message, 'none')
}

/**
 * 核心请求方法
 * @param {Object} options 请求配置
 * @returns {Promise} 请求结果
 */
async function request(options) {
	// 合并配置
	const requestOptions = {
		...config,
		...options,
		url: options.url.startsWith('http') ? options.url : config.baseURL + options.url
	}
	
	// 执行请求拦截器
	const interceptedOptions = await executeRequestInterceptors(requestOptions)
	
	// 显示加载提示
	if (interceptedOptions.loading !== false) {
		showLoading(interceptedOptions.loadingText || '加载中...')
	}
	
	return new Promise((resolve, reject) => {
		uni.request({
			...interceptedOptions,
			success: async (response) => {
				try {
					// 执行响应拦截器
					const interceptedResponse = await executeResponseInterceptors(response)
					
					// 检查业务状态码
					if (interceptedResponse.statusCode === 200) {
						const data = interceptedResponse.data
						
						// 假设后端返回格式为 { code: 200, message: 'success', data: {} }
						if (data.code === 200 || data.code === 0) {
							resolve(data)
						} else {
							// 业务错误
							const error = {
								type: 'business',
								code: data.code,
								message: data.message || '业务处理失败',
								data: data
							}
							handleError(error, interceptedOptions)
							reject(error)
						}
					} else {
						// HTTP错误
						const error = {
							type: 'http',
							code: interceptedResponse.statusCode,
							message: `HTTP ${interceptedResponse.statusCode}`,
							data: interceptedResponse
						}
						handleError(error, interceptedOptions)
						reject(error)
					}
				} catch (error) {
					handleError(error, interceptedOptions)
					reject(error)
				} finally {
					// 隐藏加载提示
					if (interceptedOptions.loading !== false) {
						hideLoading()
					}
				}
			},
			fail: (error) => {
				handleError(error, interceptedOptions)
				reject(error)
				
				// 隐藏加载提示
				if (interceptedOptions.loading !== false) {
					hideLoading()
				}
			}
		})
	})
}

/**
 * GET请求
 * @param {string} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
export function get(url, params = {}, options = {}) {
	return request({
		url,
		method: 'GET',
		data: params,
		...options
	})
}

/**
 * POST请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
export function post(url, data = {}, options = {}) {
	return request({
		url,
		method: 'POST',
		data,
		...options
	})
}

/**
 * PUT请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
export function put(url, data = {}, options = {}) {
	return request({
		url,
		method: 'PUT',
		data,
		...options
	})
}

/**
 * DELETE请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
export function del(url, data = {}, options = {}) {
	return request({
		url,
		method: 'DELETE',
		data,
		...options
	})
}

/**
 * 上传文件
 * @param {string} url 上传地址
 * @param {string} filePath 文件路径
 * @param {string} name 文件字段名
 * @param {Object} formData 其他表单数据
 * @param {Object} options 其他配置
 * @returns {Promise} 上传结果
 */
export function uploadFile(url, filePath, name = 'file', formData = {}, options = {}) {
	const uploadOptions = {
		...config,
		...options,
		url: url.startsWith('http') ? url : config.baseURL + url
	}
	
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: uploadOptions.url,
			filePath,
			name,
			formData,
			header: uploadOptions.header,
			success: async (response) => {
				try {
					const data = JSON.parse(response.data)
					
					if (data.code === 200 || data.code === 0) {
						resolve(data)
					} else {
						const error = {
							type: 'upload',
							code: data.code,
							message: data.message || '文件上传失败',
							data: data
						}
						handleError(error, uploadOptions)
						reject(error)
					}
				} catch (error) {
					handleError(error, uploadOptions)
					reject(error)
				}
			},
			fail: (error) => {
				handleError(error, uploadOptions)
				reject(error)
			}
		})
	})
}

/**
 * 下载文件
 * @param {string} url 下载地址
 * @param {Object} options 其他配置
 * @returns {Promise} 下载结果
 */
export function downloadFile(url, options = {}) {
	const downloadOptions = {
		...config,
		...options,
		url: url.startsWith('http') ? url : config.baseURL + url
	}
	
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url: downloadOptions.url,
			header: downloadOptions.header,
			success: (response) => {
				if (response.statusCode === 200) {
					resolve(response)
				} else {
					const error = {
						type: 'download',
						code: response.statusCode,
						message: '文件下载失败',
						data: response
					}
					handleError(error, downloadOptions)
					reject(error)
				}
			},
			fail: (error) => {
				handleError(error, downloadOptions)
				reject(error)
			}
		})
	})
}

// 默认导出
export default {
	request,
	get,
	post,
	put,
	delete: del,
	uploadFile,
	downloadFile,
	addRequestInterceptor,
	addResponseInterceptor
}
