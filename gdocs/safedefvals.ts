export const Defaults = {
  MediumRestApi: {
    Title: "My Medium Blog",
    Username: "mediumuser",
  },
  HostedWPRestApi: {
    Title: "My Awesome Blog",
    ApiUrl: "https://example.com/wp-json/wp/v2",
  },
  PublicWPRestApi: {
    Title: "WordPress.com",
    SiteUrl: "example.wordpress.com",
  },
  TokenAuthClient: {
    AuthBaseUrl: "https://example.com/wp-json/jwt-auth",
    TokenUrl: "/v1/token",
    ValidateUrl: "/v1/token/validate",
    Token: "ENTER_TOKEN_HERE",
  },
  LoginAuthClient: {
    Username: "testuser",
    Password: "PASSWORD_1234",
    AuthBaseUrl: "https://example.com/wp-json/jwt-auth",
    TokenUrl: "/v1/token",
    ValidateUrl: "/v1/token/validate",
  },
  HostedWPOAuth2Api: {
    ClientId: 0,
    ClientSecret: "ENTER_SECRET_HERE",
    AuthBaseUrl: "https://example.com/oauth2",
    TokenUrl: "/token",
    AuthorizeUrl: "/authorize",
    AuthenticateUrl: "/authenticate",
  },
  PublicWPOAuth2Api: {
    ClientId: 0,
    ClientSecret: "ENTER_SECRET_HERE",
    AuthBaseUrl: "https://example.com/oauth2",
    TokenUrl: "/token",
    AuthorizeUrl: "/authorize",
    AuthenticateUrl: "/authenticate",
  },
  MediumOAuth2Api: {
    ClientId: 0,
    ClientSecret: "ENTER_SECRET_HERE",
    AuthBaseUrl: "https://medium.com/m/oauth",
    TokenUrl: "/token",
    AuthorizeUrl: "/authorize",
    AuthenticateUrl: "/authenticate",
  },
};
