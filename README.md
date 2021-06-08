# **Spyfall**

The original game can be found [here](https://hwint.ru/portfolio-item/spyfall/).

Anchors:

- [Events](#events)
- [Technologies](#technologies)

# [Events](#events)

## **playerLeft**: (player: Player, reason: number)

Triggers when a player leaves the lobby or closes the game tab.

## **gameEnd**: (lobby: Lobby, reason: number)

### **Reason codes:**

- **0**: Spies left the game
- **1**: Innocents left the game
- **2**: Spies won the game
- **3**: Innocent won the game

# [Technologies](#technologies)

Here are the technologies used in this project.

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Redis](https://redis.io/)
- [Socket.io](https://socket.io/)
