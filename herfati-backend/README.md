# Herfati Backend — واجهة برمجة تطبيقات منصة حرفتي

باك إند مبني بـ Node.js + Express + MongoDB يخدم منصة "حرفتي": سوق منتجات للحرفيين، وحملات تمويل جماعي (crowdfunding) لدعم مشاريعهم.

## التشغيل

```bash
npm install
cp .env.example .env   # عدّل القيم حسب بيئتك (خصوصًا MONGO_URI و JWT_SECRET)
npm run dev             # أو npm start
```

يحتاج المشروع MongoDB شغّال محليًا أو رابط Atlas في `MONGO_URI`.

## هيكل المشروع

```
config/db.js          اتصال قاعدة البيانات
models/                مخططات Mongoose: User, Product, Campaign, Contribution, Order
controllers/           منطق كل مسار (auth, product, campaign, order)
routes/                تعريف نقاط النهاية REST
middleware/auth.js     التحقق من JWT وصلاحيات الأدوار (artisan/buyer/admin)
middleware/errorHandler.js  معالجة موحّدة للأخطاء
server.js              نقطة تشغيل التطبيق
```

## نقاط النهاية (API Endpoints)

### Auth
| Method | Route | Auth | الوصف |
|---|---|---|---|
| POST | /api/auth/register | - | تسجيل مستخدم (buyer أو artisan) |
| POST | /api/auth/login | - | تسجيل الدخول، يرجع JWT |
| GET | /api/auth/me | ✔ | بيانات المستخدم الحالي |

### Products (السوق)
| Method | Route | Auth | الوصف |
|---|---|---|---|
| GET | /api/products?category=&search=&page=&limit= | - | عرض/بحث/فلترة المنتجات |
| GET | /api/products/:id | - | تفاصيل منتج |
| POST | /api/products | artisan | إضافة منتج |
| PUT | /api/products/:id | artisan (مالك) | تعديل منتج |
| DELETE | /api/products/:id | artisan (مالك) | حذف منتج |

### Campaigns (التمويل الجماعي)
| Method | Route | Auth | الوصف |
|---|---|---|---|
| GET | /api/campaigns?status=active\|funded\|closed\|all | - | عرض الحملات |
| GET | /api/campaigns/:id | - | تفاصيل حملة |
| POST | /api/campaigns | artisan | فتح حملة تمويل جديدة |
| POST | /api/campaigns/:id/contribute | ✔ | دعم حملة بمبلغ (body: `{ amount }`) |

### Orders (الطلبات)
| Method | Route | Auth | الوصف |
|---|---|---|---|
| POST | /api/orders | ✔ | إنشاء طلب شراء (body: `{ items: [{ product, quantity }] }`) |
| GET | /api/orders/mine | ✔ | طلبات المستخدم الحالي |

المسارات المعلّم عليها ✔ تحتاج ترويسة: `Authorization: Bearer <token>`.

## ملاحظات مهمة قبل الإنتاج

- الدفع هنا **محاكاة فقط**: `contribute` و `createOrder` يحدّثان الأرقام مباشرة بدون بوابة دفع حقيقية. لإتاحة تمويل حقيقي عابر للحدود، يلزم دمج مزوّد دفع (مثل Stripe أو Paymob) والتعامل مع العملات المتعددة.
- لا يوجد رفع صور فعلي؛ حقل `images` يخزّن روابط نصية فقط. يمكن إضافة تخزين سحابي (S3 أو Cloudinary) لاحقًا.
- أضِف Rate limiting و Helmet قبل النشر الفعلي لتحسين الأمان.
