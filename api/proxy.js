const axios = require('axios');

module.exports = async (req, res) => {
    // 1. 设置跨域头，允许你的网页访问
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { Q1, Q2, Q3, Q4 } = req.body;

        // 调用 Coze API
        const response = await axios.post(
            'https://api.coze.cn/v1/workflow/run',
            {
                workflow_id: process.env.WORKFLOW_ID,
                parameters: { Q1, Q2, Q3, Q4 }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.COZE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json(response.data);

    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch from Coze' });
    }
};
