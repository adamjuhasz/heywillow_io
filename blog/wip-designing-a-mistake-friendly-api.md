## Having helpful error messages

### Bad content type

One of the first questions is how to deal with content type mismatches? There are two types of mismatches

1. Incorrect but valid content. YAML was sent to the server but JSON was expected by the endpoint
2. Correct but invalid content. JSON was sent to the server but the "Content-Type" header was missing or set to another value.
3. Incorrect and invalid content. YAML was sent and the Content-Type is set to Application/JSON.

We decided to return both as `Invalid Content` errors. For the first we never to display non-deterministic behaviors. If we document only accepting JSON but a user sends YAML and it works they may come to rely on that behavior, we may at a later time decide to change our code or use a new framework and that "magically free" functionality disappears. We now have to make the decision to officially support it or cause our user's clients to start "randomly" hitting errors.

# Offering an idempotency key

We shouldn't rely

Should we return a 409 or a 202?

# Checking types and logic

Not only is the api value valid for the type (did they send a string a number) but does it make sense?
