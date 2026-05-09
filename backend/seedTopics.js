require("dotenv").config();

const mongoose = require("mongoose");
const Topic = require("./src/models/Topic");
const connectDB = require("./src/config/db");

const topics = [
  // ==================== DBMS ====================
  {
    subject: "dbms",
    name: "Introduction to DBMS",
    basePriority: "low",
    priorityScore: 3,
    examFrequency: 2,
    difficulty: 1,
    estimatedHours: 1,
    description: "What is a DBMS, types, advantages over file systems",
  },
  {
    subject: "dbms",
    name: "ER Model",
    basePriority: "high",
    priorityScore: 8,
    examFrequency: 5,
    difficulty: 3,
    estimatedHours: 2,
    description: "Entities, attributes, relationships, ER diagrams",
  },
  {
    subject: "dbms",
    name: "Relational Model",
    basePriority: "high",
    priorityScore: 9,
    examFrequency: 6,
    difficulty: 3,
    estimatedHours: 2,
    description: "Relations, keys, integrity constraints",
  },
  {
    subject: "dbms",
    name: "SQL",
    basePriority: "high",
    priorityScore: 10,
    examFrequency: 8,
    difficulty: 3,
    estimatedHours: 3,
    description: "DDL, DML, DCL, joins, subqueries, aggregations",
  },
  {
    subject: "dbms",
    name: "Normalization",
    basePriority: "high",
    priorityScore: 9,
    examFrequency: 7,
    difficulty: 4,
    estimatedHours: 2,
    description: "1NF, 2NF, 3NF, BCNF with examples",
  },
  {
    subject: "dbms",
    name: "Transactions",
    basePriority: "high",
    priorityScore: 8,
    examFrequency: 6,
    difficulty: 4,
    estimatedHours: 2,
    description: "ACID properties, commit, rollback, savepoints",
  },
  {
    subject: "dbms",
    name: "Concurrency Control",
    basePriority: "medium",
    priorityScore: 7,
    examFrequency: 5,
    difficulty: 4,
    estimatedHours: 2,
    description: "Locks, two-phase locking, deadlocks",
  },
  {
    subject: "dbms",
    name: "Indexing",
    basePriority: "medium",
    priorityScore: 7,
    examFrequency: 5,
    difficulty: 3,
    estimatedHours: 1,
    description: "Dense/sparse indexes, B+ trees, hashing",
  },
  {
    subject: "dbms",
    name: "File Organization",
    basePriority: "low",
    priorityScore: 4,
    examFrequency: 3,
    difficulty: 2,
    estimatedHours: 1,
    description: "Heap, sequential, hash, clustered file organization",
  },
  {
    subject: "dbms",
    name: "Recovery",
    basePriority: "medium",
    priorityScore: 6,
    examFrequency: 4,
    difficulty: 3,
    estimatedHours: 1,
    description: "Log-based recovery, checkpoints, shadow paging",
  },

  // ==================== DSA ====================
  {
    subject: "dsa",
    name: "Arrays",
    basePriority: "high",
    priorityScore: 10,
    examFrequency: 8,
    difficulty: 2,
    estimatedHours: 2,
    description: "1D/2D arrays, traversal, searching, sliding window",
  },
  {
    subject: "dsa",
    name: "Linked List",
    basePriority: "high",
    priorityScore: 9,
    examFrequency: 7,
    difficulty: 3,
    estimatedHours: 2,
    description: "Singly, doubly, circular linked lists, operations",
  },
  {
    subject: "dsa",
    name: "Stacks and Queues",
    basePriority: "high",
    priorityScore: 9,
    examFrequency: 7,
    difficulty: 2,
    estimatedHours: 2,
    description: "Stack/queue using arrays and linked lists, applications",
  },
  {
    subject: "dsa",
    name: "Recursion",
    basePriority: "high",
    priorityScore: 8,
    examFrequency: 6,
    difficulty: 4,
    estimatedHours: 2,
    description: "Base case, recursive calls, backtracking basics",
  },
  {
    subject: "dsa",
    name: "Sorting Algorithms",
    basePriority: "high",
    priorityScore: 9,
    examFrequency: 8,
    difficulty: 3,
    estimatedHours: 2,
    description: "Bubble, selection, insertion, merge, quick sort",
  },
  {
    subject: "dsa",
    name: "Searching Algorithms",
    basePriority: "high",
    priorityScore: 8,
    examFrequency: 7,
    difficulty: 2,
    estimatedHours: 1,
    description: "Linear search, binary search, complexity analysis",
  },
  {
    subject: "dsa",
    name: "Trees",
    basePriority: "high",
    priorityScore: 9,
    examFrequency: 7,
    difficulty: 4,
    estimatedHours: 3,
    description: "Binary trees, BST, AVL trees, traversals",
  },
  {
    subject: "dsa",
    name: "Heaps",
    basePriority: "medium",
    priorityScore: 7,
    examFrequency: 5,
    difficulty: 4,
    estimatedHours: 2,
    description: "Min/max heap, heapify, priority queues",
  },
  {
    subject: "dsa",
    name: "Graphs",
    basePriority: "high",
    priorityScore: 9,
    examFrequency: 7,
    difficulty: 5,
    estimatedHours: 3,
    description: "BFS, DFS, shortest path, Dijkstra, adjacency list/matrix",
  },
  {
    subject: "dsa",
    name: "Dynamic Programming",
    basePriority: "high",
    priorityScore: 10,
    examFrequency: 8,
    difficulty: 5,
    estimatedHours: 3,
    description: "Memoization, tabulation, classic DP problems",
  },
  {
    subject: "dsa",
    name: "Hashing",
    basePriority: "medium",
    priorityScore: 7,
    examFrequency: 5,
    difficulty: 3,
    estimatedHours: 1,
    description: "Hash tables, collision resolution, applications",
  },
  {
    subject: "dsa",
    name: "Advanced Algorithms",
    basePriority: "low",
    priorityScore: 4,
    examFrequency: 3,
    difficulty: 5,
    estimatedHours: 2,
    description: "Greedy, divide and conquer, string algorithms",
  },
];

const seed = async () => {
  await connectDB();

  // Wipe existing topics to avoid duplicates on re-run
  await Topic.deleteMany({ subject: { $in: ["dbms", "dsa"] } });
  console.log("🗑  Cleared existing DBMS and DSA topics");

  await Topic.insertMany(topics);
  console.log(`✅ Seeded ${topics.length} topics successfully`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});