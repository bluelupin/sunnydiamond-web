export type MagentoGraphqlErrorEntry = {
  message: string;
  /** Magento error category, e.g. `graphql-authorization` or a module-specific code. */
  extensions?: { category?: string };
};

export class MagentoGraphqlError extends Error {
  public readonly errors: MagentoGraphqlErrorEntry[];

  constructor(message: string, errors: MagentoGraphqlErrorEntry[] = []) {
    super(message);
    this.name = "MagentoGraphqlError";
    this.errors = errors;
  }
}
