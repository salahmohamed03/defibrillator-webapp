
interface Message {
    sender_id: string;
    recipient_id: string;
    content: string;
}

class PoolingService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    /**
     * Send a message to a recipient.
     * @param message - The message object containing sender_id, recipient_id, and content.
     * @returns A promise that resolves to the response data or throws an error.
     */
    async sendMessage(message: Message): Promise<{ status: string }> {
        try {
            const response = await fetch(`${this.apiUrl}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error sending message: ${error}`);
        }
    }

    /**
     * Poll for new messages for a specific user.
     * @param userId - The ID of the user to retrieve messages for.
     * @returns A promise that resolves to a Message or throws an error if there are no new messages.
     */
    async getMessages(userId: string): Promise<Message | null> {
        try {
            const response = await fetch(`${this.apiUrl}/getMessages/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                // No new messages available
                return null;
            }

            if (!response.ok) {
                throw new Error(`Failed to get messages: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error getting messages: ${error}`);
        }
    }
}
export default PoolingService;