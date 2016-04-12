Açık Sözlük uygulama geliştirmek isteyenlere RESTFUL JSON API sunmaktadır.
Açık Sözlük içerisindeki tüm işlemler bu API yardımıyla yapılmaktadır.

# Hata mesajları

Sunucuya gönderilen hatalı istekler `400 Bad Request` yanıtını dönmektedir.
Eğer istek yetki nedeniyle gerçekleştirilemediyse `401 Unauthorized` yanıtı
döndürülmektedir. Aynı zamanda yanıt içeriği aşağıdaki örnekteki gibi
ayrıntıları içermektedir:


```json
{
    "error": {
        "errors": [
            {
                "message": "`id` parametresi boş bırakılamaz",
                "fields": ["id"]
            }
        ],
        "code": 400,
        "message": "`id` parametresi boş bırakılamaz"
    }
}
```
