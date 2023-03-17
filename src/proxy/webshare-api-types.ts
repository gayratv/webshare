export interface ProxyList {
  count: number;
  next: string;
  previous?: any;
  results: ProxyListObject[];
}

export interface ProxyListObject {
  id: string;
  username: string;
  password: string;
  proxy_address: string;
  port: number;
  valid: boolean;
  last_verification: Date;
  country_code: string;
  city_name: string;
  created_at: Date;
}

export interface ShowProfileData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  last_login: Date;
  timezone: string;
  subscribed_bandwidth_usage_notifications: boolean;
  subscribed_subscription_notifications: boolean;
  subscribed_proxy_usage_statistics: boolean;
  subscribed_usage_warnings: boolean;
  subscribed_guides_and_tips: boolean;
  subscribed_survey_emails: boolean;
  tracking_id: string;
  helpscout_beacon_signature: string;
  announce_kit_user_token: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReplaceProxyResult {
  id: number;
  to_replace: ToReplace;
  replace_with: ReplaceWith[];
  dry_run: boolean;
  state: string;
  proxies_removed: number;
  proxies_added: number;
  created_at: Date;
  completed_at: Date;
}

export interface ReplaceWith {
  type: string;
  count: number;
}

export interface ToReplace {
  type: string;
  ip_range: string;
}

export interface ReplacedProxiesList {
  count: number;
  next: string;
  previous?: any;
  results: ReplacedProxiesObject[];
}

export interface ReplacedProxiesObject {
  id: number;
  proxy: string;
  proxy_port: number;
  proxy_country_code: string;
  replaced_with: string;
  replaced_with_country_code: string;
  replaced_with_port: number;
  created_at: Date;
}
