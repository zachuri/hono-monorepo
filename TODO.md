# TODO

## API

- [ ] role based auth

  - [ ] admin, user, developer
    - [ ] admin/developer can view api /reference and /storybook

- [ ] sockets setup for testing later
- [ ] need to fix type safety bettern client and server
  - its able to fetch the updated data but cant find the types throwing an error
  - need to fix types some more, need to export auth config but its embeddeed in the hono
  - will try a nodejs compatibility version

## UI

- [ ] host storybook on vercel
  - ran into problems and remove
  ```
  {
    "dependencies": {
      "react": "^19.1.1",
      "react-dom": "^19.1.1",
      "next": "15.1.8",
      "@acme/ui": "workspace:*"
    },
    "devDependencies": {
      "@acme/web": "workspace:*",  // Move here
      // ... rest of devDependencies
    }
  }
  ```

## Better Auth setup

- [ ] KV

  - [x] kv storage cache with better auth
  - [ ] doc of my findings

- [x] geo location
- [x] ip identifier

# Other cool setup

- [ ] expo

## Project setup

- [ ] maybe add nextra (blog)

- [ ] ~~host next js on cloudflare~~

- [x] project wil be name acme
- [x] storybook for ui framework
- [x] storybook setup docs for ui components

- [x] lefthook
- [x] biome linter setup
- [x] CI/CD pipeline with github actions
- [x] dev, staging, prod, env
