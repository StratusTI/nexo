export class InsufficientPermissionsError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message)
  }
}
