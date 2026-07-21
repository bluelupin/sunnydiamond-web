export class MagentoGraphqlError extends Error {
  public readonly errors: Array<{ message: string }>;

  constructor(message: string, errors: Array<{ message: string }> = []) {
    super(message);
    this.name = "MagentoGraphqlError";
    this.errors = errors;
  }
}
