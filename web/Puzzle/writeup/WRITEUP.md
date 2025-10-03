# CTF Challenge Solution: Puzzle

## Challenge Overview
- **Category**: Web Exploitation  
- **Points**: 500


## Vulnerability Chain

### 1. Information Disclosure via Directory Listing (available in code, no guessing)
- The `/db` endpoint is publicly accessible and contains `old.db`
- The `/data` endpoint is admin-only but contains critical files: `dbconnect.exe` and `secrets.zip`

### 2. Role-based Access Control Bypass
The registration system accepts a `role` parameter:
```python
# In /confirm-register route
role = request.form.get('role', '2')  # Default is '2' (user)
role_map = {
    '0': 'admin',    # Blocked in registration
    '1': 'editor',   # Can access /users/<uuid> endpoint  
    '2': 'user'      # Regular user
}
```

**Exploit**: Register with `role=1` to become an editor instead of regular user.

### 3. User Information Disclosure
The `/users/<uuid>` endpoint returns sensitive user data including plaintext passwords:
```python
@app.route('/users/<string:target_uuid>')
def get_user_details(target_uuid):
    # Only admins (role='0') and editors (role='1') can access this
    if current_user['role'] not in ('0', '1'):
        return jsonify({'error': 'Invalid user role'}), 403
    
    # Returns password in plaintext!
    return jsonify({
        'uuid': user['uuid'],
        'username': user['username'], 
        'password': user['password']  # ⚠️ Password leak!
    })
```

### 4. IDOR in Collaboration System
The collaboration acceptance has an IDOR vulnerability:
```python
@app.route('/collab/accept/<string:request_uuid>', methods=['POST'])
def accept_collaboration(request_uuid):
    # Missing authorization check - any user can accept any request
    c.execute("SELECT * FROM collab_requests WHERE uuid = ?", (request_uuid,))
```

**Exploit**: Send collaboration request to admin, then accept your own request to create an article with admin as collaborator, revealing admin's UUID in the article metadata.

### 5. Admin Credential Extraction
get admin creds with /users/uuid
```

### 6. Protected File Access  
As admin, access `/data` directory containing:
- `dbconnect.exe` - Contains hardcoded password in source
- `secrets.zip` - Encrypted archive with the flag

### 7. Password Extraction from Binary
The C source code in `/inC/dbconnect.c` reveals:
```c
// Line 20 in dbconnect.c
const char *creds = "server = '127.0.0.1'\ndatabase = 'puzzledb'\nusername = 'sa'\npassword = 'something'\n";
```

crack the secrets.zip with that pass and u have the flag.
The challenge if full of rabbit holes like fake SSRF bypass and SSTI.