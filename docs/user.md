# Kullanıcı detayları

```http
GET /api/v1/user/<USERNAME>
GET /api/v1/user/<USERID>
```

İstenen kullanıcı için, kullanıcı detaylarını döner. Örnek bir istek aşağıdaki
cevabı alır:

```json
{
    "id": 1,
    "username": "aciksozluk",
    "karma": 1500,
    "entryCount": 50,
    "monthlyEntryCount": 10,
    "weeklyEntryCount": 4,
    "dailyEntryCount": 1,
    "registrationDate": "2016-04-10T16:27:50+03:00",
    "badges": ["editor", "moderator"]
}
```

Cevapta yer alabilecek diğer alanlar:

| Alan       | Açıklama                                             |
|------------|------------------------------------------------------|
| id         | Kullanıcı numarası                                   |
| username   | Kullanıcı adı                                        |
| karma      | Kullanıcının toplam karma puanı                      |
| entryCount | Kullanıcının girdiği toplam entry sayısı             |
| monthlyEntryCount | Kullanıcının bir ay içerisinde girdiği toplam entry sayısı      |
| weeklyEntryCount  | Kullanıcının bir hafta içerisinde girdiği toplam entry sayısı   |
| dailyEntryCount   | Kullanıcının son 24 saat içerisinde girdiği toplam entry sayısı |
| registrationDate  | Kullanıcının kayıt olduğu tarih               |
| badges            | Kullanıcının sahip olduğu rozet idlerinin bir listesi           |
| lastLoginDate\*   | Kullanıcının en son giriş yaptığı tarih       |
| level\*    | Kullanıcı seviyesini                                 |
| email\*    | Kullanıcı email adresi                               |

\*: Bu alanlar sadece isteği yapan kişi yönetici ise cevapta yer alırlar.


# Kullanıcı kaydı

```http
POST /api/v1/user/registration
```

Yeni bir kullanıcı kaydı oluşturur.

!!! warning "Gereken istemci yetkileri"
    Bu isteği sadece kullanıcı kaydı oluşturma izni olan istemciler
    gerçekleştirebilir. Bu isteği gerçekleştirmek isteyen istemci öncelikle
    kendini sunucuya `client_credentials` grant'ı ile auth etmelidir.
    Ayrıntılı bilgi için [yetkilendirme ve kimlik doğrulama](auth.md)
    sayfasına bakınız.

İstek ile gönderilen JSON nesnesi aşağıdaki alanları içermelidir:

| Alan     | Açıklama                                 |
|----------|------------------------------------------|
| username | Kullanıcı adı                            |
| password | En az 6 karakter olan kullanıcı şifresi  |
| email    | Kullanıcı eposta adresi                  |

<!-- TODO: Kullanıcı kaydıdan sonra cevap olarak ne yollanacak? -->


# Kullanıcı silme

```http
DELETE /api/v1/user/<USERNAME>
DELETE /api/v1/user/<USERID>
DELETE /api/v1/user/me
```

Kullanıcıyı veritabanından siler.

!!! warning "Gereken yetkiler"
    Bu isteği sadece kullanıcının kendisi veya yönetici yetkisine sahip
    kişiler gerçekleştirebilir.

<!-- TODO: Kullanıcı sildikten sonra cevap olarak ne yollanacak? -->
