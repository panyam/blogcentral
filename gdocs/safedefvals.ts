export const Defaults = {
  WPRestApi: {
    Title: "My Awesome Blog",
    ApiUrl: "https://example.com/wp-json",
  },
  TokenAuthClient: {
    AuthBaseUrl: "https://example.com/wp-json/jwt-auth",
    TokenUrl: "/v1/token",
    ValidateUrl: "/v1/token/validate",
    Token: "000000111111222222333333444444555566667778888999AABBBCCCDDDEEEFFF",
  },
  JWTAuthClient: {
    Username: "testuser",
    Password: "PASSWORD_1234",
    AuthBaseUrl: "https://example.com/wp-json/jwt-auth",
    TokenUrl: "/v1/token",
    ValidateUrl: "/v1/token/validate",
  },
};
