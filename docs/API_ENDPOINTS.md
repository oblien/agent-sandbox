# API Endpoints Documentation

Base URL: `https://api.oblien.com/sandbox`

---

## Authentication & Sandbox Management

All requests require client credentials in headers:
- `X-Client-ID`: Your client ID
- `X-Client-Secret`: Your client secret

---

### 1. Create Sandbox

**Endpoint:** `POST /`

**Description:** Create a new sandbox. Returns sandbox details including a **sandbox-specific token** used to interact with that sandbox's APIs (files, git, snapshots, etc.).

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "my-dev-sandbox",
  "region": "us-east-1",
  "template": "node-20",
  "config": {}
}
```

**Response:**
```json
{
  "success": true,
  "sandbox": {
    "id": "sandbox_abc123xyz",
    "name": "my-dev-sandbox",
    "url": "https://sandboxxyz.oblien.com",
    "token": "sandbox_token_xyz789...",
    "status": "active",
    "region": "us-east-1",
    "created_at": "2025-10-18T12:00:00Z"
  }
}
```

**Important:** The `token` in the response is the **sandbox-specific token** used for all subsequent API calls to that sandbox (files, git, snapshots, etc.).

**Usage:**
```javascript
const response = await fetch('https://api.oblien.com/sandbox', {
  method: 'POST',
  headers: {
    'X-Client-ID': 'your_client_id',
    'X-Client-Secret': 'your_client_secret',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'my-dev-sandbox',
    region: 'us-east-1'
  })
});

const { sandbox } = await response.json();
// sandbox.token is what you use for sandbox APIs
// sandbox.url is the base URL for that sandbox
```

---

### 2. List Sandboxes

**Endpoint:** `GET /?page=1&limit=20&status=active`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "sandboxes": [
    {
      "id": "sandbox_abc123",
      "name": "my-sandbox",
      "url": "https://sandbox.oblien.com",
      "status": "active",
      "region": "us-east-1",
      "created_at": "2025-10-18T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### 3. Get Sandbox Details

**Endpoint:** `GET /{sandboxId}`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "sandbox": {
    "id": "sandbox_abc123",
    "name": "my-sandbox",
    "url": "https://sandbox.oblien.com",
    "token": "sandbox_token_xyz...",
    "status": "active",
    "region": "us-east-1",
    "created_at": "2025-10-18T12:00:00Z"
  }
}
```

---

### 4. Delete Sandbox

**Endpoint:** `DELETE /{sandboxId}`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "message": "Sandbox deleted successfully"
}
```

---

### 5. Start Sandbox

**Endpoint:** `POST /{sandboxId}/start`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "sandbox": {
    "id": "sandbox_abc123",
    "status": "active"
  }
}
```

---

### 6. Stop Sandbox

**Endpoint:** `POST /{sandboxId}/stop`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "sandbox": {
    "id": "sandbox_abc123",
    "status": "stopped"
  }
}
```

---

### 7. Restart Sandbox

**Endpoint:** `POST /{sandboxId}/restart`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "sandbox": {
    "id": "sandbox_abc123",
    "status": "active"
  }
}
```

---

### 8. Regenerate Sandbox Token

**Endpoint:** `POST /{sandboxId}/regenerate-token`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "token": "new_sandbox_token_abc...",
  "sandbox": {
    "id": "sandbox_abc123"
  }
}
```

---

### 9. Get Sandbox Metrics

**Endpoint:** `GET /{sandboxId}/metrics`

**Headers:**
```
X-Client-ID: your_client_id
X-Client-Secret: your_client_secret
```

**Response:**
```json
{
  "success": true,
  "metrics": {
    "cpu_usage": 45.2,
    "memory_usage": 512,
    "disk_usage": 1024,
    "uptime": 3600
  }
}
```

---

## Authentication Flow Summary

```
1. Client ID + Client Secret (in headers)
   ↓
   POST /sandboxes (with client credentials in headers)
   ↓
2. Sandbox Token (returned for that specific sandbox)
   ↓
   Use with sandbox.url for files, git, etc.
```

### Example Flow

```javascript
// Step 1: Create sandbox (client credentials in headers)
const sandboxResponse = await fetch('https://api.oblien.com/sandbox', {
  method: 'POST',
  headers: {
    'X-Client-ID': 'your_client_id',
    'X-Client-Secret': 'your_client_secret',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'my-sandbox' })
});
const { sandbox } = await sandboxResponse.json();

// Step 2: Use sandbox token for sandbox operations
const filesResponse = await fetch(`${sandbox.url}/files/list`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sandbox.token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ dirPath: '/opt/app' })
});
```

---

## Notes

- **Client Credentials**: Used in headers (`X-Client-ID`, `X-Client-Secret`) for all account-level operations (create/manage sandboxes)
- **Sandbox Token**: Unique per sandbox, returned when creating sandbox, used for sandbox operations (files, git, etc.)
- All sandbox-specific APIs use the `sandbox.url` as base URL
- All account-level APIs use `https://api.oblien.com/sandbox` as base URL

