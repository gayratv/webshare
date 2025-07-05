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

## Webshare.writeProxyListToDatabase()
Асинхронная статическая функция, которая получает список всех прокси-серверов из вашего аккаунта Webshare и сохраняет их в базу данных.

Расположение: src/proxy/webshare-api.ts

Возвращает: Promise<void>

Порядок действий:

Получение списка: Делает запросы к API Webshare (/api/v2/proxy/list/), чтобы получить полный список ваших прокси.

Очистка таблицы: Полностью очищает таблицу webShareProxyListApi в базе данных (truncate table).

Запись в БД: Записывает полученный список прокси в таблицу webShareProxyListApi.

Обновление статусов: Обновляет поля checkedForAvito и exist_in_proxyList, сравнивая данные с уже существующей таблицей proxyList.