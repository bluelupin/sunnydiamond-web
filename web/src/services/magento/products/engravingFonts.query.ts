export const MAGENTO_ENGRAVING_FONTS_METADATA_QUERY = `
  query MagentoEngravingFontsMetadata {
    customAttributeMetadata(
      attributes: [{ attribute_code: "engraving_fonts", entity_type: "catalog_product" }]
    ) {
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
