export async function createTrelloCard(name: string, desc: string) {
    const key = process.env.TRELLO_KEY;
    const token = process.env.TRELLO_TOKEN;
    const listId = process.env.TRELLO_LIST_ID;

    if (!key || !token || !listId) {
        console.warn('Trello configuration missing. Skipping card creation.');
        return null;
    }

    const url = `https://api.trello.com/1/cards?idList=${listId}&key=${key}&token=${token}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                desc,
                pos: 'top'
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Trello API Error: ${error}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to create Trello card:', error);
        return null;
    }
}
