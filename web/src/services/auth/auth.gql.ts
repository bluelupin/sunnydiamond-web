export const MAGENTO_SOCIAL_LOGIN_MUTATION = `
  mutation MagentoSocialLogin($input: SocialLoginInput!) {
    socialLogin(input: $input) {
      token
      customer_created
    }
  }
` as const;

export const MAGENTO_REQUEST_LOGIN_OTP_MUTATION = `
  mutation MagentoRequestLoginOtp($input: RequestLoginOtpInput!) {
    requestLoginOtp(input: $input) {
      success
      resend_after_seconds
      channel
      masked_destination
    }
  }
` as const;

export const MAGENTO_VERIFY_LOGIN_OTP_MUTATION = `
  mutation MagentoVerifyLoginOtp($input: VerifyLoginOtpInput!) {
    verifyLoginOtp(input: $input) {
      token
      registration_required
      customer_created
    }
  }
` as const;
