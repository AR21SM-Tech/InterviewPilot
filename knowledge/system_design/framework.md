# System Design Interview Framework

## The Framework (30-45 minutes)

### 1. Requirements Clarification (3-5 min)
- **Functional**: What does the system need to do?
- **Non-functional**: Scale, latency, availability, consistency
- **Constraints**: Budget, timeline, existing systems

**Key questions to ask:**
- Who are the users? How many?
- What's the read/write ratio?
- What's the expected scale (DAU, QPS, data size)?
- What's more important: consistency or availability?

### 2. Capacity Estimation (3-5 min)
**Calculate:**
- QPS (queries per second)
- Storage requirements
- Bandwidth needs
- Memory for caching

**Example calculation:**
- 100M DAU, each user 10 requests/day
- QPS = 100M * 10 / 86400 ≈ 12K QPS
- Peak = 3x average ≈ 36K QPS

### 3. High-Level Design (10-15 min)
- Draw main components
- Show data flow
- Identify APIs

**Common components:**
- Load Balancer
- API Gateway
- Application Servers
- Database (SQL/NoSQL)
- Cache (Redis/Memcached)
- Message Queue
- CDN

### 4. Deep Dive (10-15 min)
Pick 2-3 components to detail:
- Data model and schema
- Specific algorithms
- Handling edge cases

### 5. Scalability & Reliability (5-10 min)
- Horizontal scaling
- Database sharding
- Replication
- Failure handling
- Monitoring

## Key Trade-offs

| Choice | Pros | Cons |
|--------|------|------|
| SQL vs NoSQL | ACID, joins / Flexible, scale | Schema rigidity / Eventual consistency |
| Cache-aside vs Write-through | Simple / Consistent | Stale data / Write latency |
| Sync vs Async | Immediate / Decoupled | Blocking / Complexity |

## Common System Design Problems

1. **URL Shortener** - Hashing, base62, database design
2. **Rate Limiter** - Token bucket, sliding window
3. **Chat System** - WebSocket, message queues, presence
4. **News Feed** - Fan-out, ranking, caching
5. **Video Streaming** - CDN, transcoding, chunking
