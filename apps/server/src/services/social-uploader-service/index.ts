export type {
  SocialProviderInterface,
  AuthenticationResult,
  CreatePostData,
  PostResult,
  PostStatus,
} from "./social-provider.interface";
export { LinkedInOAuthService } from "./linkedin-oauth.service";
export { LinkedInAPIService } from "./linkedin-api.service";
export { SocialUploaderService } from "./social-uploader.service";

// Default exports
import linkedInOAuthService from "./linkedin-oauth.service";
import linkedInAPIService from "./linkedin-api.service";
import socialUploaderService from "./social-uploader.service";

export { linkedInOAuthService, linkedInAPIService, socialUploaderService };
