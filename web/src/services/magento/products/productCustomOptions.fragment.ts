export const MAGENTO_PRODUCT_CUSTOM_OPTIONS_FIELDS = `
  ... on CustomizableProductInterface {
    options {
      uid
      title
      required
      sort_order
      __typename
      ... on CustomizableFieldOption {
        fieldValue: value {
          uid
        }
      }
      ... on CustomizableDropDownOption {
        dropDownValues: value {
          uid
          title
          option_type_id
        }
      }
      ... on CustomizableRadioOption {
        radioValues: value {
          uid
          title
          option_type_id
        }
      }
    }
  }
` as const;
