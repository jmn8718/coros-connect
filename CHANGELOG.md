# 0.1.7

- Fix API signing behavior for the EU API URL flow
- Add support for FAQ-based API response validation
- Refactor API internals by extracting constants

# 0.1.6

- Update dependencies to fix security issues
- Apply project formatting improvements
- Separate and refresh usage examples
- Add API URL support for European users

# 0.1.5

- Refactor Coros API calls through a shared request/response handler
- Add `yfheader` authentication support with `userId`
- Persist token file as JSON (`accessToken` + `userId`) with backward compatibility
- Add activity update methods (name and perception)
- Add comments API methods (add, remove, list)
- Add comment response typings and shared enums
- Fix activities date range query `endDay` handling

# 0.1.4

- Support ejs and cjs
- Improve login error handling

# 0.1.3

- Configure coros client
- Update upload activity file
- Fix packages version

# 0.1.2

- Include typings

# 0.1.1

- Get profile
- Upload activity file (*fit* and *tcx*)
- Delete activity

# 0.1.0 Initial version

- Fetch activities list
- Fetch activity details (and dashboard data)
- Download activity file
- Store and reuse access token
