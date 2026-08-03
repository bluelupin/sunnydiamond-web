export const MAGENTO_PRODUCT_ATTRIBUTE_OPTIONS_QUERY = `
  query MagentoProductAttributeOptions($attributes: [AttributeInput!]!) {
    customAttributeMetadata(attributes: $attributes) {
      items {
        attribute_code
        attribute_options {
          label
          value
        }
      }
    }
  }
` as const;
