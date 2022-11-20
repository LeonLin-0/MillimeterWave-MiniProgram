// conponents/emotionComponent/emotionComponent.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		emotionText: String
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		emotion: {
			emotionText: "未知",
			emotionBackground: "-emotion-unknown",
			emotionIcon: "/icon/unknown.png"
		}
	},
	/**
	 * 组件监听器
	 */
	observers: {
		'emotionText': function(newVal) {
			this.judgeEmotion(newVal);
		},
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		judgeEmotion(newVal) {
			let text = 'emotion.emotionText';
			let background = 'emotion.emotionBackground';
			let icon = 'emotion.emotionIcon';
			switch (newVal) {
				case '未知': {
					this.setData({
						[text]: newVal,
						[background]: '-emotion-unknown',
						[icon]: '/icon/unknown.png'
					})
					break;
				}
				case '愉悦': {
					this.setData({
						[text]: newVal,
						[background]: '-emotion-happy',
						[icon]: '/icon/happy.png'
					});
					break;
				}
				case '平静': {
					this.setData({
						[text]: newVal,
						[background]: '-emotion-calm',
						[icon]: '/icon/calm.png'
					});
					break;
				}
				case '压力': {
					this.setData({
						[text]: newVal,
						[background]: '-emotion-stressful',
						[icon]: '/icon/stressful.png'
					})
				}
			}
		},
		changeEmotion() {
			let emotion = ['未知','愉悦','平静','压力'];
			let index = parseInt(Math.random()*4);
			this.setData({
				emotionText: emotion[index]
			})
		}
	}
})