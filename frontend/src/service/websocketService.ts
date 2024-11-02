const url = 'ws://127.0.0.1:8000/';

interface Message {
    content: string;
    role: "assistant" | "user" | "error" | "progress";
}

type SetMessages = React.Dispatch<React.SetStateAction<Message[]>>;

export class ClientChatController {
    private readonly socket: WebSocket;
    private readonly setMessages: SetMessages;

    constructor(
        setMessages: SetMessages,
        source: number[],
        notes: number[]
    ) {
        this.setMessages = setMessages;
        this.socket = new WebSocket(`${url}api/v1/notebook/ws/ClientLLMResponse?source=${source}&notes=${notes}`);
        this.initializeWebSocket();
    }

    private initializeWebSocket(): void {
        this.socket.addEventListener('open', () => {
            console.log('WebSocket connection opened');
        });

        this.socket.addEventListener('message', (event: MessageEvent) => {
            try {
                const messagePart = event.data;

                if (messagePart === "__END_OF_RESPONSE__") {
                    // Remove progress indicator when done
                    this.setMessages((prevMessages) => prevMessages.filter((msg) => msg.role !== 'progress'));
                } else {
                    const parsedMessage: Message = { role: 'assistant', content: messagePart };
                    // Replace last "progress" message with new message content
                    this.setMessages((prevMessages) => [
                        ...prevMessages.filter((msg) => msg.role !== 'progress'),
                        parsedMessage,
                    ]);
                }
            } catch (error) {
                const errorMessage: Message = { role: 'error', content: 'Error parsing message: ' + error };
                this.setMessages((prevMessages) => [
                    ...prevMessages.filter((msg) => msg.role !== 'progress'),
                    errorMessage,
                ]);
                console.error('Error parsing message:', error);
            }
        });

        this.socket.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            // Optionally remove any remaining progress indicator
            this.setMessages((prevMessages) => prevMessages.filter((msg) => msg.role !== 'progress'));
        });

        this.socket.addEventListener('error', (event: Event) => {
            console.error('WebSocket Error: ', event);
        });
    }

    public sendMessage(messages: Message[]): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(messages));
            // Add progress indicator
            this.setMessages((prevMessages) => [...prevMessages, { role: 'progress', content: 'Loading...' }]);
        } else {
            console.warn('WebSocket is not open. Unable to send message');
        }
    }

    public close(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}
