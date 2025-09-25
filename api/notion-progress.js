// Netlify/Vercel Function for Notion API
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { databaseId, token, propertyName, labelProperty } = req.body;

    if (!databaseId || !token) {
        return res.status(400).json({ error: 'Database ID and token required' });
    }

    try {
        // Notion API çağrısı
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page_size: 1 // Sadece ilk kaydı al
            })
        });

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.results.length === 0) {
            return res.status(404).json({ error: 'No records found' });
        }

        const record = data.results[0];
        const properties = record.properties;

        // Progress değerini çıkar
        let progress = 0;
        if (properties[propertyName]) {
            if (properties[propertyName].type === 'number') {
                progress = properties[propertyName].number || 0;
            } else if (properties[propertyName].type === 'formula') {
                progress = properties[propertyName].formula.number || 0;
            }
        }

        // Label değerini çıkar
        let label = '';
        if (properties[labelProperty]) {
            if (properties[labelProperty].type === 'title') {
                label = properties[labelProperty].title[0]?.plain_text || '';
            } else if (properties[labelProperty].type === 'rich_text') {
                label = properties[labelProperty].rich_text[0]?.plain_text || '';
            }
        }

        return res.status(200).json({
            progress: Math.round(progress),
            label: label
        });

    } catch (error) {
        console.error('Notion API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch from Notion',
            details: error.message
        });
    }
}
