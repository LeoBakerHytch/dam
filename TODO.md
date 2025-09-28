# TODO

- [x] Set up GraphQL type generation in the frontend (so we no longer have to write type definitions by hand, which can
  drift from the actual schema).
    - Set up `gql.data`

- [x] Review whether API mutation naming convention (`Namespace_Entity_Action`) makes sense.
    - Settled on `Namespace_Action`

- [x] Set up CSRF protection.
    - Enabled Lighthouse’s built-in middleware.

- [x] Implement automatic refreshing of access tokens.

- [ ] Testing!

- [ ] Hybrid upload strategy, for large files. Presently, we rely on the GraphQL `Upload` scalar; for assets though,
  especially in production where we would use cloud storage, it makes sense to separate upload and asset creation.
  Pre-signed S3 URLs could be used for this.

- [ ] Review whether there’s a specific type of `Exception` that we should be throwing from mutation resolvers (rather
  than just the generic `Exception`), and ensure that the error messages are communicated to the user in a sensible way.

- [ ] Ensure that we only ever deliver client-safe error messages to the user in production.

- [ ] Centralize the definition of frontend routes, so that we don’t even have the possibility that links break.
