const appList = {
    // base_url: '/gitee_resource_main',
    base_url: 'https://gitee.com/qingyun-cottage/resource/raw/main',
    data: null,
}

// 劫持appList.list 的写入  Proxy
let proxy = new Proxy(appList, {
    set(target, key, value) {
        if (key === 'data') {
            target[key] = value.map(item => {
                if (item.logo) {
                    item.logo = appList.base_url + item.logo
                }
                return item
            })
            return true // 表示属性设置成功
        }
        target[key] = value
        return true
    },
})

proxy.data = [
    {
        name: 'TH 汎用ヒト型決戦兵器',
        url: 'https://qingyun-cottage.github.io/th-summary/',
        desc: '一个基于云存储的案例演示，用于数据记录与可视化展示。',
        logo: '/public/app_logo/th.png',
    },
    {
        name: '刑事案款示例',
        url: 'https://qingyun-cottage.github.io/case-demo',
        desc: 'H5手机端应用案例演示，模拟涉众型非法集资案件的被害人在线进行信息的确认。',
        logo: '/public/app_logo/case_demo.png',
    },
    {
        name: '动森图鉴',
        url: ' https://qingyun-cottage.github.io/animal-crossing/',
        desc: '动物森友会 鱼类、昆虫、化石图鉴。',
        logo: '/public/app_logo/animal_crossing.jpg',
    },
    {
        name: '三养火鸡辣酱H5',
        url: './show/turkey-h5',
        desc: '三养火鸡辣酱H5示例，关于“辣音风暴”的活动。',
        logo: '/public/app_logo/hot_sauce.svg',
    },
    {
        name: '字体转换工具',
        url: '/app/font-trans',
        desc: '压缩字体和转成css的功能。',
        logo: '/public/app_logo/font_trans.png',
    },
    {
        name: 'bilibili秋',
        url: '/app/bilibili-show/autumn',
        desc: '网页动效-哔哩哔哩秋',
        logo: '/public/app_logo/bilibili_autumn.png',
    },
    {
        name: 'bilibili冬',
        url: '/app/bilibili-show/winter',
        desc: '网页动效-哔哩哔哩冬',
        logo: '/public/app_logo/bilibili_winter.png',
    },
    {
        name: '草稿画板',
        url: 'app/canvas-board',
        desc: '一款简单的在线绘图工具，允许用户自由绘制草图、涂鸦或进行创意设计。该工具通常具备基础的绘画功能如颜色选择、笔刷调整等，并支持保存作品以供后续编辑或分享。',
        logo: '/public/app_logo/canvas_board.png',
    },
    {
        name: '寄存海岛',
        url: './tool/deposit',
        desc: '一个记录网页地址的小工具，待重构',
    },
    {
        name: '基金小工具',
        url: './tool/fund-amend',
        desc: '一个平衡基金份额的小型应用程序，提供数据自动计算功能。它可以帮助个人投资者简化日常财务管理任务。',
        logo: '/public/app_logo/fund.png',
    },
    {
        name: '贪吃蛇',
        url: './game/snake',
        desc: '经典的贪吃蛇游戏，玩家控制一条不断增长的蛇去吞噬食物，同时避免撞到墙壁或其他障碍物。此版本可能加入了新的玩法机制或视觉风格，使其更适合现代设备和观众口味。',
        logo: '/public/app_logo/snake.png',
    },
    {
        name: '扫雷(高高高级版)',
        url: './game/mine',
        desc: '经典的扫雷游戏，玩家通过标记和点击方块来寻找雷，并避免踩雷。将经典的排雷挑战融入到了一个广阔的开放世界环境中。',
        logo: '/public/app_logo/mine.png',
    },
    {
        name: 'css颜色表',
        url: './reference/html-color',
        desc: '提供了一个全面的CSS颜色参考指南，列出了所有可用的颜色名称及其对应的十六进制代码。这对于前端开发者来说是一个宝贵的资源，有助于快速查找和应用所需的颜色值。',
        logo: '/public/app_logo/html_color.png',
    },
    {
        name: '中国色 － 传统颜色',
        url: 'app/zhongguose',
        desc: '中国色-镜像站, 中国传统色, 色名, 色谱, 中国色名综览, AI中国色。',
        logo: '/public/app_logo/zhongguose.png',
    },
    {
        name: '中国色 － 重排',
        url: 'app/zhongguose-card',
        desc: '中国色-颜色卡片, 方便查看使用。',
        logo: '/public/app_logo/zhongguose.png',
    },
    {
        name: '查看图片源',
        url: './system/imgCollection',
        desc: '通过GitHub托管的仓库可以方便地存储和分享图片资源。用户可以通过直接链接访问图片，或者使用GitHub Pages展示图片库。这种方式适合需要稳定、免费且易于管理的图片存储解决方案。',
        logo: '/public/app_logo/img.webp',
    },
    // {
    //     name: 'IQ测试',
    //     url: './my/iq/qingyun_IQ',
    //     desc: '在线智力测验工具的结果页面，通过一系列逻辑推理、数学计算和语言理解等问题来评估用户的智商水平。这类测试往往设计成互动形式，提供即时反馈和结果解释，既有趣又具教育意义。',
    // },
]
