# KiloCode Rules for Python

## Core Philosophy

- **Readability First**: Code should be readable as English prose
- **Explicit Over Implicit**: Make intentions clear rather than relying on magic
- **One Way to Do It**: Follow established patterns and conventions
- **Errors Should Not Pass Silently**: Fail fast with meaningful error messages

## Code Structure

```
project/
├── src/
│   ├── __init__.py
│   ├── main.py          # Application entry point
│   ├── config.py        # Configuration management
│   └── app/
│       ├── __init__.py
│       ├── models/      # Data models
│       ├── routes/      # API endpoints
│       ├── services/    # Business logic
│       └── utils/       # Helper functions
├── tests/
│   ├── __init__.py
│   ├── conftest.py      # Pytest configuration
│   └── unit/            # Unit tests
├── scripts/
│   └── dev.py          # Development utilities
├── pyproject.toml      # Project metadata and dependencies
├── Dockerfile
└── README.md
```

## Naming Conventions

- **Modules/Packages**: snake_case (`data_processing`, `user_management`)
- **Functions**: snake_case (`get_user_data()`, `process_payment()`)
- **Variables**: snake_case (`user_name`, `is_active`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Classes**: PascalCase (`UserProfile`, `PaymentProcessor`)
- **Type Hints**: PascalCase for classes, lowercase for builtins

## Imports

### Absolute Imports (Preferred)
```python
from app.services.user_service import UserService
from app.models.user import User
```

### Relative Imports (Within Package Only)
```python
from .user_service import UserService  # Same package
from ..models.user import User         # Parent package
```

### Import Organization
```python
# Standard library imports
import json
import asyncio
from typing import List, Optional

# Third-party imports
import fastapi
import pydantic
import sqlalchemy

# Local imports
from app.models.user import User
from app.services.payment_service import PaymentService
```

## Type Hints

### Function Signatures
```python
from typing import List, Optional, Dict, Any
import pydantic

def process_users(
    users: List[User],
    filters: Optional[Dict[str, Any]] = None,
    limit: int = 100
) -> List[ProcessedUser]:
    """Process a list of users with optional filtering."""
    pass

# For complex types, prefer Pydantic models
class ProcessUsersRequest(pydantic.BaseModel):
    users: List[User]
    filters: Optional[Dict[str, Any]] = None
    limit: int = pydantic.Field(default=100, ge=1, le=1000)
```

### Generic Types
```python
from typing import TypeVar, Generic

T = TypeVar('T')

class PaginatedResponse(Generic[T]):
    data: List[T]
    total: int
    page: int
    limit: int
```

## Async Programming

### Async/Await Pattern
```python
import asyncio
from typing import Coroutine, Any

async def fetch_user(user_id: str) -> User:
    """Asynchronous user fetching."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"/users/{user_id}")
        return User.parse_obj(response.json())

async def process_batch(users: List[str]) -> List[User]:
    """Process multiple users concurrently."""
    tasks = [fetch_user(user_id) for user_id in users]
    return await asyncio.gather(*tasks)
```

### Error Handling in Async Code
```python
async def robust_fetch_user(user_id: str) -> Optional[User]:
    try:
        return await fetch_user(user_id)
    except httpx.HTTPError as e:
        logger.error(f"HTTP error fetching user {user_id}: {e}")
        return None
    except pydantic.ValidationError as e:
        logger.error(f"Invalid user data for {user_id}: {e}")
        raise
```

## Data Models

### Pydantic Models (Preferred)
```python
from pydantic import BaseModel, validator, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v

    class Config:
        orm_mode = True  # Enables SQLAlchemy compatibility
```

### SQLAlchemy Models (for Databases)
```python
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class UserDB(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
```

## Dependency Injection

### FastAPI Example
```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

app = FastAPI()

def get_db() -> Session:
    """Database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/{user_id}")
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """Get user by ID."""
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.from_orm(user)
```

## Testing

### Unit Tests with Pytest
```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.user_service import UserService

@pytest.mark.asyncio
async def test_create_user_success():
    """Test successful user creation."""
    user_service = UserService(db=MagicMock())

    user_data = {"email": "test@example.com", "name": "Test User"}
    result = await user_service.create_user(user_data)

    assert result.email == "test@example.com"
    assert result.name == "Test User"
    assert result.id is not None

@pytest.mark.asyncio
async def test_create_user_duplicate_email():
    """Test user creation with duplicate email."""
    user_service = UserService(db=MagicMock())

    # Mock database to simulate unique constraint violation
    user_service.db.query.return_value.filter.return_value.first.return_value = MockUser()

    with pytest.raises(UserAlreadyExistsError):
        await user_service.create_user({"email": "existing@example.com"})
```

## Error Handling

### Custom Exceptions
```python
from typing import Any, Dict, Optional

class ApplicationError(Exception):
    """Base application exception."""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.details = details or {}

class UserNotFoundError(ApplicationError):
    pass

class ValidationError(ApplicationError):
    pass
```

### Structured Error Responses
```python
from fastapi import HTTPException
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    error: str
    code: str
    details: Optional[Dict[str, Any]] = None

def raise_user_not_found(user_id: str) -> None:
    raise HTTPException(
        status_code=404,
        detail=ErrorResponse(
            error="User not found",
            code="USER_NOT_FOUND",
            details={"user_id": user_id}
        ).dict()
    )
```

## Logging

### Structured Logging
```python
import logging
import json
from typing import Any, Dict

logger = logging.getLogger(__name__)

class StructuredLogger:
    @staticmethod
    def info(message: str, **kwargs: Any) -> None:
        extra = {"extra": kwargs}
        logger.info(message, extra=extra)

    @staticmethod
    def error(message: str, exc: Optional[Exception] = None, **kwargs: Any) -> None:
        extra = {"extra": kwargs}
        if exc:
            logger.error(message, exc_info=exc, extra=extra)
        else:
            logger.error(message, extra=extra)

# Usage
StructuredLogger.info("User created", user_id=user.id, email=user.email)
StructuredLogger.error("Database connection failed", exc=e, retry_count=3)
```

## Configuration Management

### Environment-Based Configuration
```python
import os
from typing import Optional

class Config:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    # External APIs
    EXTERNAL_API_KEY: Optional[str] = os.getenv("EXTERNAL_API_KEY")

    # Application
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")

    # Validation
    @property
    def is_production(self) -> bool:
        return not self.DEBUG

config = Config()
```

## Performance Optimization

- **Async First**: Use async/await for I/O operations
- **Connection Pooling**: Reuse database connections
- **Caching**: Implement appropriate caching strategies
- **Lazy Loading**: Use generators for large datasets
- **Memory Management**: Be mindful of memory usage in long-running processes

## Security Best Practices

- **Input Validation**: Always validate and sanitize inputs
- **SQL Injection Prevention**: Use parameterized queries
- **Authentication**: Implement proper JWT/token handling
- **Authorization**: Use role-based access control
- **HTTPS Only**: Always use HTTPS in production
- **Security Headers**: Implement appropriate security headers