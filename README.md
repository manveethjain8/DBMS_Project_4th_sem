# DBMS Mini Project – 4th Sem

### Topic
**Basic In-Game Virtual Currency Purchasing System**

### Team Members
- **Manveeth H V** (4NI23CI055)  
- **M M Kaverappa** (4NI23CI052)  
- **Mithul Kannan** (4NI23CI057)  
- **M Bharath Mani** (4NI23CI051)  

---

### Synopsis

This project implements a **simple in-game purchasing system** where players earn **virtual coins** by completing levels or tasks. These coins can then be used to **purchase in-game items** such as new familiers. It uses **MongoDB** as the database to store and manage data like player profiles, coin balances, and purchased items.

---

### Existing System & Drawbacks

In traditional simple games, purchasing systems are handled locally, often leading to:
- Loss of data when the game is closed or refreshed
- Lack of structured inventory management
- Scalability issues
- Inability to track user behavior

---

### Proposed System & Benefits

Our proposed system includes:
- **MongoDB-powered backend** with collections for `users`, `carts`, `familiers`
- **Persistent storage** for player data
- Real-time **coin updates** and item transactions
- Easy **item management** and price updates
- High **flexibility** for development using MongoDB's schema-less structure

#### Advantages:
- No data loss on refresh
- Easy to scale and modify
- Trackable player inventory
- Educational for understanding document-based DBMS

---

### Tech Stack

- **Frontend**: HTML, CSS, JavaScript, React  
- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **Tools**: VS Code, Git, MongoDB Compass/Postman, MongoDB Atlas

---

### Conclusion

This project serves as an excellent introduction to using MongoDB in a game setting, teaching the fundamentals of CRUD operations, user state management, and virtual currency tracking in a fun and interactive way.
