# работа с webshare


## Описание функций API

### `Webshare.showProfileData()`

Асинхронная статическая функция для получения данных профиля пользователя с Webshare.

- **Расположение:** `src/proxy/webshare-api.ts`
- **Эндпоинт API:** `GET /api/v2/profile/`
- **Возвращает:** `Promise<ShowProfileData>`

Объект `ShowProfileData`, который возвращает функция, содержит следующие поля (согласно интерфейсу в `src/proxy/webshare-api-types.ts`):

```typescript
interface ShowProfileData {
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
````

```
```
