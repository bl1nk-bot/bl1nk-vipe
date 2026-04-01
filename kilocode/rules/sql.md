# KiloCode Rules for SQL

## Database Design Principles

- **Normalization**: Apply appropriate normal forms (1NF, 2NF, 3NF) without over-normalizing
- **Indexing Strategy**: Create indexes for foreign keys, WHERE clauses, and ORDER BY columns
- **Constraints**: Use primary keys, foreign keys, CHECK constraints, and unique constraints
- **Data Types**: Choose appropriate data types (VARCHAR vs TEXT, INT vs BIGINT)
- **Security**: Implement row-level security and parameterized queries

## Table Naming

- **Tables**: snake_case (`users`, `user_profiles`, `order_items`)
- **Primary Keys**: `id` (singular)
- **Foreign Keys**: `{table_name_singular}_id` (`user_id`, `category_id`)
- **Join Tables**: `{table_a}_{table_b}` with alphabetical order (`posts_tags`)

## Column Naming

- **Primary Keys**: `id`
- **Foreign Keys**: `{table_name}_id`
- **Timestamps**: `created_at`, `updated_at`, `deleted_at`
- **Booleans**: `is_*` or `has_*` (`is_active`, `has_approved`)
- **Amounts**: `{item}_amount` (`total_amount`, `tax_amount`)
- **Dates**: `{event}_date` or `{event}_at` (`published_at`, `due_date`)
- **JSON**: `{item}_data` or `{item}_config`

## Schema Structure

```sql
-- ✅ Good: proper table structure
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) CHECK (role IN ('admin', 'user', 'moderator')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_created_at ON users (created_at DESC);
```

## Query Patterns

### SELECT Queries

```sql
-- ✅ Good: explicit joins and readable aliases
SELECT
    u.username,
    u.full_name,
    p.title,
    p.content,
    p.created_at
FROM users u
INNER JOIN posts p ON u.id = p.user_id
WHERE u.is_active = true
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;

-- ✅ Good: subqueries for complex logic
SELECT *
FROM posts
WHERE user_id IN (
    SELECT id
    FROM users
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
);
```

### INSERT Statements

```sql
-- ✅ Good: explicit column listing and parameterization
INSERT INTO users (
    email,
    username,
    password_hash,
    full_name
) VALUES (
    $1, $2, $3, $4
) RETURNING id;

-- ✅ Good: bulk inserts
INSERT INTO users (email, username, password_hash)
SELECT
    email,
    username,
    password_hash
FROM staging_users
WHERE status = 'approved';
```

### UPDATE Operations

```sql
-- ✅ Good: conditional updates with RETURNING
UPDATE users
SET
    full_name = $1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2
    AND email = $3
RETURNING *;

-- ✅ Good: optimistic locking with version columns
UPDATE products
SET
    stock_quantity = stock_quantity - $1,
    version = version + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2
    AND version = $3;
```

### DELETE Operations

```sql
-- ✅ Good: soft deletes maintain data integrity
UPDATE users
SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- ✅ Good: cascading deletes with care
DELETE FROM post_tags
WHERE post_id IN (
    SELECT id FROM posts WHERE deleted_at IS NOT NULL
);
```

## Joins and Relationships

### INNER JOINs

```sql
-- ✅ Good: clear join conditions
SELECT
    o.id,
    o.total_amount,
    u.username,
    p.name as product_name
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.status = 'pending';
```

### LEFT JOINs

```sql
-- ✅ Good: handling nullable relationships
SELECT
    u.username,
    COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.published_at IS NOT NULL
GROUP BY u.id, u.username
HAVING COUNT(p.id) >= 1;
```

## Aggregation and Analytics

### GROUP BY with ROLLUP

```sql
-- ✅ Good: summary analytics
SELECT
    COALESCE(country, 'Total') as country,
    COALESCE(region, 'Total') as region,
    SUM(revenue) as total_revenue,
    COUNT(DISTINCT user_id) as unique_users
FROM user_revenue
GROUP BY ROLLUP (country, region)
ORDER BY country, region;
```

### Window Functions

```sql
-- ✅ Good: ranking and running totals
SELECT
    user_id,
    revenue,
    RANK() OVER (ORDER BY revenue DESC) as revenue_rank,
    SUM(revenue) OVER (ORDER BY created_at ROWS UNBOUNDED PRECEDING) as running_total
FROM user_revenue
ORDER BY created_at;
```

## Performance Optimization

### Indexing Strategy

```sql
-- ✅ Composite indexes for common query patterns
CREATE INDEX idx_posts_user_created ON posts (user_id, created_at DESC);
CREATE INDEX idx_posts_category_status ON posts (category_id, status) WHERE status = 'published';

-- ✅ Partial indexes for filtered data
CREATE INDEX idx_active_users ON users (email) WHERE deleted_at IS NULL;
```

### Query Optimization

```sql
-- ✅ Good: proper pagination
SELECT * FROM posts
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- ✅ Good: use EXISTS for existence checks
SELECT u.*
FROM users u
WHERE EXISTS (
    SELECT 1 FROM posts p
    WHERE p.user_id = u.id AND p.published_at IS NOT NULL
);
```

## Data Integrity

### Constraints

```sql
-- ✅ Check constraints for business rules
ALTER TABLE orders
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));

-- ✅ Foreign key constraints with cascade options
ALTER TABLE posts
ADD CONSTRAINT fk_posts_author
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ✅ Unique constraints for data integrity
ALTER TABLE users
ADD CONSTRAINT unique_email_per_domain
EXCLUDE (email) WITH gist (substring(email from '@(.*)$'));
```

### Triggers

```sql
-- ✅ Good: automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Migration Scripts

### Version Control

```sql
-- migrations/001_initial_schema.sql
BEGIN;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

-- migrations/002_add_indexes.sql
BEGIN;

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_created_at ON users (created_at);

COMMIT;
```

### Rollback Strategy

```sql
-- ✅ Good: migration with rollback
-- migration: add_user_profiles
BEGIN;

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    bio TEXT,
    website VARCHAR(500)
);

-- Rollback section
-- DROP TABLE user_profiles;

COMMIT;
```

## Security Considerations

### Parameterized Queries

```sql
-- ✅ Always use parameterized queries (example in application code)
-- NEVER: "SELECT * FROM users WHERE email = '" + userEmail + "'"
-- ALWAYS: "SELECT * FROM users WHERE email = $1", [userEmail]
```

### Row Level Security (PostgreSQL)

```sql
-- ✅ Enable RLS for multi-tenant applications
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_data ON user_data
FOR ALL USING (user_id = current_user_id());
```

## Monitoring and Logging

### Query Monitoring

```sql
-- ✅ Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = '1000';  -- Log queries > 1 second
ALTER SYSTEM SET log_statement = 'ddl';

-- ✅ Create monitoring views
CREATE VIEW system_performance AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

### Performance Analysis

```sql
-- ✅ Analyze table statistics
ANALYZE VERBOSE users;

-- ✅ Query execution plans
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT * FROM users WHERE email = 'test@example.com';
```

## Stored Procedures and Functions

### Function Patterns

```sql
-- ✅ Good: reusable business logic
CREATE OR REPLACE FUNCTION calculate_user_score(user_id INT)
RETURNS DECIMAL AS $$
DECLARE
    post_count INT;
    comment_count INT;
    score DECIMAL;
BEGIN
    SELECT COUNT(*) INTO post_count FROM posts WHERE author_id = user_id;
    SELECT COUNT(*) INTO comment_count FROM comments WHERE author_id = user_id;

    score := post_count * 2.5 + comment_count * 1.0;
    RETURN score;
END;
$$ LANGUAGE plpgsql;
```

## Database Version Specific

### PostgreSQL Specific

```sql
-- ✅ Use PostgreSQL-specific features
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE users ADD COLUMN user_uuid UUID DEFAULT uuid_generate_v4();
CREATE INDEX CONCURRENTLY idx_users_uuid ON users (user_uuid);
```

### Migration Tools

```bash
# ✅ Use schema migration tools
# Alembic for PostgreSQL
# Flyway for multi-database
# Prisma for modern applications
```

## Testing Database Code

### Unit Tests for Functions

```sql
-- test functions
CREATE OR REPLACE FUNCTION test_calculate_user_score()
RETURNS TABLE (test_case TEXT, passed BOOLEAN) AS $$
BEGIN
    -- Insert test data
    INSERT INTO test_users (id, name) VALUES (1, 'Test User');

    -- Test calculation
    RETURN QUERY
    SELECT
        'Basic calculation'::TEXT,
        calculate_user_score(1) > 0;
END;
$$ LANGUAGE plpgsql;
```

## Documentation

### Schema Documentation

```sql
-- Table comments
COMMENT ON TABLE users IS 'User accounts in the system';
COMMENT ON COLUMN users.email IS 'User email address, must be unique and validated';

-- Generate documentation
SELECT
    schemaname,
    tablename,
    obj_description((schemaname || '.' || tablename)::regclass) as comment
FROM pg_tables
WHERE schemaname = 'public';
```

## Backup and Recovery

### Backup Strategy

```bash
# ✅ Good: regular backups
pg_dump -Fc dbname > backup.dump
pg_dump -Fp dbname > backup.sql

# ✅ Point-in-time recovery
pg_basebackup -D backup/ -Fp -Xs -P -R
```