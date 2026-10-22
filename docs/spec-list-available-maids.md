# List available maids — API spec (v1)

## Purpose
Let a logged-in **Customer** browse all maids registered in the app. For v1, **“available” = every user with `userType` `Maid`**. No schedule or booking filter yet.

## Endpoint

| Item | Value |
|------|--------|
| Method | `GET` |
| Path | `/users/maids` |
| Auth | Required — `Authorization: Bearer <JWT>` from `POST /users/login` |
| Who may call | JWT payload `userType` must be `Customer` |

## Query parameters (v1)

None. Optional later: `page`, `limit`, search by name.

## Success response

**HTTP 200**

Body matches existing list style (`message` + `data`):

```json
{
  "message": "Maids fetched successfully!",
  "data": [
    {
      "_id": "…",
      "name": "…",
      "age": 28,
      "email": "…",
      "gender": "Female",
      "userType": "Maid",
      "createdAt": "…",
      "updatedAt": "…"
    }
  ]
}
```

- `data` is an array (empty array if no maids).
- **Password must never appear** in `data` (omit field in query projection).

## Error responses

| HTTP | When | Body (typical) |
|------|------|----------------|
| **401** | Missing/invalid/expired token | Nest `UnauthorizedException`: `"Token is required"` or `"Invalid token"` |
| **403** | Valid token but `userType` is not `Customer` (e.g. Maid, Admin) | `"Only customers can list maids"` |
| **200** (app pattern) | DB or unexpected failure inside service | `{ "message": "Failed to fetch maids!", "data": [], "error": "<detail>" }` |

Note: Most user routes today return errors in JSON with HTTP 200; this endpoint uses **401/403** for auth (same middleware as `/services`).

## Data source

- MongoDB `users` collection, Mongoose model `User` (`schemas/user.schema.ts`).
- Filter: `{ userType: 'Maid' }` (`Usertype.Maid` enum).

## Related today (facts)

- `GET /users` — lists **all** user types, **no auth**, includes password hash in documents (known gap).
- `/services/*` — JWT required on all routes (`AuthMiddleware` on `/services` in `app.module.ts`).
- No `isAvailable` (or similar) field on users yet.

## Out of scope (v1)

- Maids “free” for a date range via service requests.
- Pagination, sorting, or filters.
- Maids or admins calling this list.
