# DSA Problem-Solving Patterns

## Core Patterns

### 1. Two Pointers
**Use when**: Searching pairs in sorted array, reversing, partitioning
**Time**: O(n), **Space**: O(1)

```
Examples:
- Two Sum II (sorted array)
- Container With Most Water
- 3Sum
- Remove Duplicates
```

### 2. Sliding Window
**Use when**: Subarray/substring problems, contiguous sequences
**Time**: O(n), **Space**: O(1) to O(k)

```
Examples:
- Maximum Sum Subarray of Size K
- Longest Substring Without Repeating Characters
- Minimum Window Substring
```

### 3. Fast & Slow Pointers
**Use when**: Cycle detection, finding middle, linked list problems
**Time**: O(n), **Space**: O(1)

```
Examples:
- Linked List Cycle
- Find Middle of Linked List
- Happy Number
```

### 4. Binary Search
**Use when**: Sorted arrays, search space reduction
**Time**: O(log n), **Space**: O(1)

```
Key insight: Can often be applied to "find minimum X such that..."
Examples:
- Search in Rotated Sorted Array
- Find Peak Element
- Koko Eating Bananas
```

### 5. BFS/DFS
**Use when**: Graph traversal, tree problems, connected components
**BFS**: Level-order, shortest path (unweighted)
**DFS**: Exhaustive search, backtracking, path finding

### 6. Dynamic Programming
**Use when**: Overlapping subproblems, optimal substructure
**Approach**: 
1. Define state
2. Find recurrence
3. Identify base cases
4. Optimize space if needed

```
Examples:
- Fibonacci, Climbing Stairs
- Longest Common Subsequence
- Knapsack Problems
- Edit Distance
```

### 7. Heap (Priority Queue)
**Use when**: K largest/smallest, merge K sorted, scheduling
**Time**: O(log k) per operation

```
Examples:
- Kth Largest Element
- Merge K Sorted Lists
- Top K Frequent Elements
```

### 8. Monotonic Stack
**Use when**: Next greater/smaller element, histogram problems
**Time**: O(n), **Space**: O(n)

```
Examples:
- Daily Temperatures
- Largest Rectangle in Histogram
- Trapping Rain Water
```

## Problem-Solving Framework

1. **Understand** - Clarify inputs, outputs, constraints, edge cases
2. **Plan** - Identify pattern, discuss approach, analyze complexity
3. **Implement** - Write clean code, use meaningful names
4. **Verify** - Test with examples, check edge cases
5. **Optimize** - Can we do better in time or space?
