# Chezz: AI Chess Application

Chezz is a feature-rich web-based chess application built with React. It features a custom-built AI opponent powered by the Minimax algorithm, an interactive AI visualizer that displays the algorithm's decision-making process, and multiple game modes. The application is designed with a focus on performance and user experience, utilizing Web Workers to ensure a responsive, non-blocking interface during complex AI computations.

---

### 🚀 Live Demo

https://chezz.onrender.com/

---

### 🎬 Project Demo

*A brief recording showcasing the main features, including the AI visualizer and responsive UI.*

![Chezz Project Demo](./screenshots/Recording-2025-07-09-030412.gif)

---

### 📸 Screenshots

*The Chezz application provides a clean and intuitive interface for all game modes.*

**Homepage**
![Chezz Homepage](./screenshots/Screenshot%202025-07-09%20023900.png)

**In-Game vs. AI**
![Chezz Play vs AI](./screenshots/Screenshot%202025-07-09%20024503.png)

**AI Algorithm Visualizer**
![Chezz AI Visualizer](./screenshots/Screenshot%202025-07-09%20024514.png)

---

## ✨ Key Features

- **Play vs. AI:** Challenge a custom-built chess AI with three adjustable difficulty levels (Easy, Medium, Hard).
- **Interactive AI Visualizer:** A unique educational tool that renders the Minimax algorithm's search tree in real-time, showing move evaluations, and alpha-beta pruning cutoffs.
- **Asynchronous AI:** The AI's thinking process runs in a background thread using a **Web Worker**, ensuring the UI remains smooth and responsive at all times.
- **Human vs. Human Mode:** A pass-and-play mode for two players on the same device.
- **Intuitive UI:**
    - Click or drag pieces to see all legal moves highlighted.
    - Full game controls including Undo/Redo moves and starting a new game.
    - Pawn promotion selection.
    - Clear visual indicators for Check, Checkmate, and Draw conditions.
- **Robust State Management:** Centralized game state management built around the FEN (Forsyth-Edwards Notation) standard, ensuring data integrity and consistency across components.

---

## 🛠️ Tech Stack

- **Frontend:** **React.js**
- **Chess Logic:** **chess.js** (for move generation, validation, and game state)
- **Chessboard UI:** **react-chessboard**
- **Asynchronous Processing:** **Web Workers** (for non-blocking AI calculations)
- **Styling:** **Custom CSS** for a clean, modern interface.

---

## 🔬 Technical Deep Dive

This project demonstrates several advanced front-end development concepts.

### 1. Asynchronous AI Engine with Web Workers

The most significant technical challenge was performing the heavy AI calculations without freezing the user interface.

- **Problem:** The Minimax algorithm, especially at higher search depths, is computationally expensive. Running it on the browser's main thread would block all rendering and user interactions, creating a jarring, unresponsive experience.
- **Solution:** The entire AI engine, including the Minimax algorithm and position evaluation logic, was moved into a **Web Worker**.
    - When it's the AI's turn to move, the main React component sends the current board state (FEN string) and difficulty setting to the worker via `postMessage`.
    - The worker runs the Minimax calculation in a separate background thread.
    - During this time, the main thread is completely free, allowing the UI to remain smooth and interactive. The user can still click and drag their own pieces to plan their next move.
    - Once the worker finds the best move, it sends the result back to the main component, which then updates the game state.

### 2. The Minimax AI Algorithm

The AI is powered by a custom implementation of the **Minimax algorithm with Alpha-Beta Pruning**.

- **Minimax:** A recursive algorithm that explores future moves to a certain depth, choosing the move that minimizes the possible loss for a worst-case scenario.
- **Alpha-Beta Pruning:** A critical optimization that significantly reduces the number of nodes the algorithm needs to evaluate in the search tree. It prunes away branches that are guaranteed to be worse than a move that has already been found.
- **Position Evaluation Function:** The "intelligence" of the AI comes from its evaluation function, which assigns a score to a given board position. The current implementation evaluates:
    - **Material Advantage:** Based on the standard point values of pieces (Queen: 9, Rook: 5, etc.).
    - **Positional Advantage:** Using Piece-Square Tables (`KNIGHT_SIGHT`, `BISHOP_SIGHT`) that incentivize placing pieces in more powerful central squares.
    - **Pawn Structure:** Pawns are given bonus points as they advance toward the promotion rank.

### 3. Interactive Algorithm Visualization

The "Visualize AI" page was built to demystify the AI's "thought process."

- The Minimax function was adapted to accept an optional parameter to build a tree data structure representing its search path.
- As the algorithm explores moves, it populates this tree with data for each node: the board state (FEN), the move made, the resulting evaluation score, and the current alpha-beta values.
- This tree is then passed back from the Web Worker to the main component and rendered using a recursive React component (`TreeVisualizer`), which displays each node with a mini-chessboard and its associated data.

---

## 🚀 Getting Started Locally

To set up and run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/chezz.git
    cd chezz/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

---

