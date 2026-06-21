# Інструкція для фронтенду: монетизація, доступ і ролі

Зведений документ змін бекенду (main / billing / vocabulary / auth) + план робіт
для фронтенду (Vue 3). Зібрано з оновлень усіх репозиторіїв і фронтенд-секції
початкового інфраплану.

---

## 1. Що змінилось у бекенді (огляд)

- **Новий сервіс `billing`** — джерело правди про плани, ціни курсів, підписки й
  покупки. Платіжка — заглушка (mock), завжди успішна.
- **main (course)**: у курсу з'явилось поле **`isFree`**; контент блоків уроку
  тепер **гейтиться** (платний курс → лише власник/адмін); приватні CRUD-роути
  стали **ADMIN-only**.
- **vocabulary**: ліміти плану на створення словників/слів (**403** при
  перевищенні).
- **auth**: у JWT і в заголовку `X-User-Plan` тепер є план користувача; зміна
  плану застосовується миттєво; адмінські ендпоінти закриті роллю **ADMIN**.
- **Шина подій (RabbitMQ)** між сервісами — для фронту **прозора**: жодних прямих
  викликів, усе через REST нижче.

---

## 2. Загальні правила інтеграції

### Базовий URL і клієнт
- Усі виклики йдуть через `$API` (`src/api/index.ts`, `@astralis-os/notfetch`),
  `baseURL = VITE_API_URL`. Базовий URL вже включає `/api`, тож шляхи нижче —
  відносні до нього: `/billing/...`, `/course/...`, `/vocabulary/...`, `/auth/...`.

### Конверт відповіді (однаковий у main / billing / vocabulary)
```jsonc
{ "code": 200, "message": "Success", "data": <корисні дані> }
```
Помилки — той самий конверт із `data: {}`:
```jsonc
{ "code": 403, "message": "You do not have access to this course", "data": {} }
```
> `code` — це **HTTP-статус** (число), не доменний код. Завжди читай корисні дані
> з `data`.

### Автентифікація та заголовки
- Фронт надсилає лише **`Authorization: Bearer <accessToken>`** (як зараз).
- Заголовки `X-User-Id` / `X-User-Role` / `X-User-Plan` **проставляє шлюз**
  (Traefik ForwardAuth) — фронт їх **не формує** і не бачить.
- `public/*` роути доступні без токена; `private/*` — потребують токена.

### Ролі
- Роль користувача береться з токена (claim/`groups`). Адмінські дії доступні
  лише для ролі **`ADMIN`** — інакше сервер віддасть **403**.

---

## 3. Довідник API

### 3.1 billing — `/billing` (новий сервіс)

**Public (без токена):**
| Метод | Шлях | Повертає |
|---|---|---|
| GET | `/billing/public/plans` | `Plan[]` (активні) — вітрина тарифів |
| GET | `/billing/public/products` | `Product[]` (активні) — ціни курсів |
| GET | `/billing/public/products/:courseId` | `Product` |

**Private (потрібен токен):**
| Метод | Шлях | Повертає / тіло |
|---|---|---|
| GET | `/billing/private/me/subscription` | `UserSubscription` поточного юзера |
| GET | `/billing/private/me/purchases` | `CoursePurchase[]` юзера |
| POST | `/billing/private/purchase/course/:courseId` | створює `CoursePurchase` (mock-оплата) |
| GET | `/billing/private/me/access/:courseId` | `{ courseId, hasAccess: boolean }` |

**Admin (роль ADMIN):**
| Метод | Шлях | Тіло |
|---|---|---|
| POST | `/billing/private/admin/plans` | `UpsertPlanDto` |
| PUT | `/billing/private/admin/plans/:code` | `UpdatePlanDto` |
| DELETE | `/billing/private/admin/plans/:code` | — |
| PUT | `/billing/private/admin/products/:courseId` | `SetProductPriceDto` (ціна курсу) |
| PUT | `/billing/private/admin/subscriptions/:userId` | `GrantSubscriptionDto` (ручна видача) |

**Моделі:**
```ts
Plan            { code: string; name: string; maxDictionaries: number;
                  maxWordsPerDict: number; priceCents: number; isActive: boolean }
Product         { courseId: number; title: string; priceCents: number | null;
                  currency: string; isFree: boolean; isActive: boolean }
UserSubscription{ userId: string; planCode: string; status: string;
                  startedAt: string; expiresAt: string | null }
CoursePurchase  { id: number; userId: string; courseId: number;
                  priceCents: number; purchasedAt: string }

UpsertPlanDto       { code; name; maxDictionaries; maxWordsPerDict; priceCents; isActive? }
UpdatePlanDto       { name; maxDictionaries; maxWordsPerDict; priceCents; isActive? }
SetProductPriceDto  { priceCents: number; currency?: string; isActive?: boolean }
GrantSubscriptionDto{ planCode: string; status?: string; expiresAt?: string }
```
> Продукт створюється чернеткою (`isActive:false`) автоматично при створенні
> курсу в main. Щоб курс став купованим — адмін задає ціну через
> `PUT /admin/products/:courseId` (це активує продукт). Покупка вільного курсу
> або без ціни → 400.

### 3.2 main (course) — `/course`

- **Курс** тепер має `isFree: boolean`. Список/прев'ю курсів — публічні:
  `GET /course/public/course`, `/course/public/course/cid/:cid`,
  `/course/public/course/language/:id`, `/course/public/course/category/:id`.
- **Контент блоків уроку (гейтиться):**
  `GET /course/public/lesson/:lessonId/blocks`
  - безкоштовний курс → **200** (навіть анонім);
  - платний курс без доступу → **403** `"You do not have access to this course"`;
  - неіснуючий урок → **404**.
- **Приватні CRUD-роути** (`/course/private/course|lesson|block...`) — тепер
  **ADMIN-only** (інакше 401 без токена / 403 без ролі). Використовуються лише в
  адмінці.
- У DTO створення/редагування курсу додай поле **`isFree?: boolean`**.

### 3.3 vocabulary — `/vocabulary`

- Створення словника: `POST /vocabulary/private/dictionaries`
- Створення слова: `POST /vocabulary/private/words`
- При перевищенні ліміту плану → **HTTP 403**. ⚠️ Через спільний фільтр помилок
  доменний код у тілі **не зберігається** — приходить звичайний конверт:
  ```jsonc
  { "code": 403, "message": "Dictionary limit reached for plan FREE (max 2)", "data": {} }
  { "code": 403, "message": "Word limit reached for plan FREE (max 100 per dictionary)", "data": {} }
  ```
  Розрізняй кейси за HTTP-статусом 403 + підрядком у `message`
  (`Dictionary limit` / `Word limit`). Дефолт FREE = **2 словники / 100 слів**.

  > Бекенд-нотатка: щоб фронт міг гілкуватись надійно за машинним кодом
  > (`LIMIT_DICTIONARIES` / `LIMIT_WORDS`), варто доопрацювати vocabulary-фільтр,
  > аби він прокидав це поле в `data`. Зараз код губиться.

### 3.4 auth — `/auth`

- У відповіді логіну/реєстрації — `user.role`; план юзера доступний через
  billing (`/billing/private/me/subscription`).
- Зміна плану застосовується **миттєво** на шлюзі (для лімітів vocabulary),
  навіть до рефрешу токена. Після апгрейду фронту достатньо перезапитати
  підписку/ліміти.
- Адмінські ендпоінти (для адмінки користувачів): `GET /auth/users`,
  `PATCH /auth/user/:id/role` — лише **ADMIN** (інакше 403).

---

## 4. План робіт на фронтенді (Vue 3)

Стек проєкту: `@astralis-os/notfetch` (`$API`), `@pinia/colada`
(`useQuery`/`useMutation`), Pinia + `pinia-plugin-persistedstate`, `vue-sonner`
(тости), `vue-router` (`$PAGES`).

### 4.1 Типи — `src/types/billing.d.ts`
Описати `Plan`, `Product`, `UserSubscription`, `CoursePurchase`,
`Access { courseId: number; hasAccess: boolean }` (поля — з §3.1).

### 4.2 API-домен — `src/api/billing/`
За наявним патерном (`get/`, `create/`, `edit/` + colada-хуки):
- `get/`: `usePlans()`, `useProducts()`, `useProduct(courseId)`,
  `useMySubscription()`, `useMyPurchases()`, `useCourseAccess(courseId)`.
- `create/`: `usePurchaseCourse()` → `POST /billing/private/purchase/course/:id`.
- admin: `useSetProductPrice()` (`PUT /admin/products/:courseId`),
  `useUpsertPlan()` / `useUpdatePlan()` / `useDeletePlan()`.
Усі через `$API`, шляхи з §3.1; дані діставати з `res.data`.

### 4.3 Стор — `src/stores/billing.store.ts` (persisted)
- Стан: `plan: UserSubscription | null`, `ownedCourseIds: Set<number>` (з
  `me/purchases`).
- Гетер: `canAccessCourse(course) => course.isFree || ownedCourseIds.has(course.id) || isAdmin`
  (`isAdmin` — з `user.store`).
- Дії: `loadSubscription()`, `loadPurchases()`, `refreshAfterPurchase()`.
- Інвалідовувати/перезавантажувати після покупки й після зміни плану.

### 4.4 Гейтинг і сторінки
- **Сторінка тарифів** (`/pricing` або в кабінеті): `usePlans()` + поточна
  підписка з стору.
- **Картка/сторінка курсу**:
  - якщо `canAccessCourse` → кнопка «Вчити»;
  - інакше → бейдж ціни (з `Product.priceCents/currency`) + кнопка «Купити».
- **Модалка покупки**: `usePurchaseCourse()` (mock-оплата) → при успіху
  `billing.store.refreshAfterPurchase()` (додати `courseId` в `ownedCourseIds`,
  перезапитати purchases) → закрити модалку, показати тост.
- Альтернативно перевірку доступу можна звіряти через
  `GET /billing/private/me/access/:courseId`, але локальний гетер швидший.
- Якщо при відкритті контенту уроку прилетіло **403** з `/course/public/lesson/.../blocks`
  — показати екран «Курс закрито» з кнопкою купівлі.

### 4.5 Обробка лімітів словника
- На `POST /vocabulary/private/dictionaries` і `/words` ловити **403**:
  тост (`vue-sonner`) з підказкою про апгрейд + лок-стан на 3-му словнику /
  101-му слові.
- Розрізняти словник/слово за `message` (див. §3.3) до бекенд-фіксу коду.

### 4.6 Адмінка
- Форма курсу: тоглик **`isFree`** (іде в main, у DTO курсу) + поле **ціни**
  (іде в billing: `PUT /admin/products/:courseId`, `priceCents`/`currency`).
- Екран керування **планами**: CRUD через `/billing/private/admin/plans`.
- (Опційно) керування підписками юзерів: `PUT /admin/subscriptions/:userId`.
- Адмінські дії доступні лише для ADMIN — інакше 403 (показати відповідно).

---

## 5. Порядок впровадження

1. `src/types/billing.d.ts` — типи.
2. `src/api/billing/` — домен запитів (get → purchase → admin).
3. `src/stores/billing.store.ts` — план + `ownedCourseIds` + `canAccessCourse`.
4. Гейтинг на картках/сторінках курсів (бейдж/Купити/Вчити).
5. Модалка покупки + рефреш стору.
6. Обробка 403-лімітів у словниках (тости + лок-стан).
7. Адмін-поля: `isFree` (main) і ціна/плани (billing).

---

## 6. Застереження

- **Конверт**: завжди читати `data`; `code` — HTTP-статус, не доменний код.
- **Ліміти vocabulary**: доменний код наразі губиться у фільтрі — гілкуватись за
  403 + `message` (або домовитись із бекендом прокидати `LIMIT_*` у `data`).
- **Миттєвий план**: після апгрейду перезапитати `me/subscription` і
  (за потреби) повторити дію зі словником — шлюз уже віддає новий план.
- **Заголовки X-User-***: фронт їх не виставляє — лише `Authorization: Bearer`.
