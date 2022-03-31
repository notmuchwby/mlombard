# mlombard

Сделано все кроме добавления фотографий в филиал. Пытался выполнить через AWS таким способом:

const rawBody = bodyParser.raw({
    type: () => true,
    limit: '25mb'
})

app.post('/upload-image', rawBody, async function (req, res) {
    const fileType = await fileTypeFromBuffer(req.body)
    const filename = uuidv4() + '.' + fileType.ext

    new AWS.S3().upload({
        Bucket: 'wyafool',
        Key: filename,
        Body: req.body,
    }).send()

    const url = `https://wyafool.s3.eu-central-1.amazonaws.com/${filename}`

    res.json({ url })
})

Но почему-то не вышло.
Знаю что переборщил с Middleware и можно было обойтись одним, но время поджимает :D

credentials:
username : password:

"admin" : "admin",
"user" : "user",
"moderator" : "moderator" 

При запрете редактирования филиала администратором, указывать время возможного редактирования. 
