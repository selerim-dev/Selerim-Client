# Authenticated demo hosting package

This package is prepared but not deployed. The existing Vercel website can host
the public MP4 walkthroughs. The Python demo gateway needs a persistent volume;
it explicitly refuses Vercel's ephemeral function disk. Do not remove that guard.

Deploy the same image as two services, one per hostname, on an approved container
host with TLS and separate persistent volumes. Build from repository root:

```sh
docker build -f demos/hosting/Dockerfile -t selerim-concepts .
```

Configure secrets directly in the host's environment interface (never Git):

- `DEMO_KIND`: `logistics` or `legal`.
- `DEMO_INPUTS`: `/fixtures/logistics/inputs` or `/fixtures/legal/inputs`.
- `DEMO_STATE_DIR`: `/data`, mounted to a private persistent volume owned by UID 10001.
- `DEMO_ORIGIN`: the exact HTTPS origin, without a trailing slash.
- `DEMO_ACCESS_KEY`: at least 24 random characters, shared only with invited viewers.
- `DEMO_SESSION_SECRET`: at least 32 random characters, independent of the access key.
- Optional model (logistics wording or legal source ordering): `DEMO_LLM_MODEL` and `OPENAI_API_KEY`.

The gateway has a secure, HTTP-only, SameSite=Strict eight-hour signed cookie,
server-side session revocation on logout, exact Host/Origin checks, action tokens,
five login attempts per remote address per 15 minutes, and separate SQLite state
for every session. A filesystem lock serializes each session across worker
processes. Source assets require authentication. There is no file upload, external
mail transport or anonymous model endpoint. Shared-key access does not verify
that a reviewer is an attorney and is not a replacement for client SSO.

Do not trust arbitrary forwarded client IP headers. Behind a reverse proxy the
login throttle may apply to the proxy address; configure trusted proxy handling
at the hosting layer before broad distribution. There is no automatic retention
cleanup: session databases and local audit logs remain on the volume until the
operator applies a retention policy. Run one host per volume; network filesystem
locking and horizontal replica semantics have not been validated.

Before public deployment: choose the persistent host, provision its TLS origin
and volume, configure secrets, run the tests, and verify two independent browser
sessions cannot see each other's review decisions. Live provider tests and the
container build remain separate deployment checks; passing local gateway tests
does not claim the hosted service has been validated.
