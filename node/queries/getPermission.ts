export default `
  query permissions {
    checkUserPermission {
      role {
        id
        name
        slug
      }
      permissions
    }
  }
`
