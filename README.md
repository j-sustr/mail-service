# Mail Service

Steps to run this project via Docker:

1. Run `docker-compose up` command

Insomnia workspace
[file](.insomnia\insomnia-workspace.json)

# Features

- ✅ Creating of SMTP connections
- ✅ Immediate mail sending
- ✅ Scheduled mail sending

- ❌ Listing emails via IMAP

## TODO:

- [] Add tests
- [] Optimize for bigger attachments
- [] Connection password encryption

# API

## Sending email

1. Create SMTP connection by sending POST request to `localhost:8080/connection` with json body like this

```json
{
  "type": "SMTP",
  "host": "smtp.seznam.cz",
  "port": 465,
  "secure": true,
  "username": "xyz@seznam.cz",
  "password": "123"
}
```

2. Create SMTP connection by sending POST request to `localhost:8080/mail` with multipart form payload like this

```
connectionId = 3
from = examplesender@seznam.cz
to = examplerecipient@gmail.com
subject = Greeting
text = ...
attachment = <file>
```

## Schedule an email send

Do the same steps as [Sending-email](##Sending-email) and additionally provide "sendTime" field to the multipart form payload

```
...
sendTime = 2022-12-18T08:30:00.000Z
```
