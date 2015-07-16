# grunt-maildev
Grunt task to run a [MailDev](https://github.com/djfarrelly/MailDev)
mail server, to view and test emails during development.

## Install
You need node, npm, and grunt already installed.

```
npm install grunt-maildev --save-dev
```

## Usage

Start a server, keep it running and open a browser on the web view:
```javascript
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
  maildev: {
    run: {
      keepAlive: true,
      open: true
    }
  }
});

grunt.registerTask('default', ['maildev:run']);
```


Start a server and use it for your tests (logging all received emails to console),
then close everything:
```javascript
grunt.initConfig({
  maildev: {
    test: {
      onNewMail: function(email) {console.log(email);},
      options: {
        smtp: {
          port: 1625
        },
        http: {
          address: '0.0.0.0',
          port: 1680,
          user: 'user_login',
          password: 'secret_password'
        }
      }
    }
  }
});

grunt.registerTask('test', ['maildev:test, test1, test2']);
```


## Options

Please refer to [MailDev](https://github.com/djfarrelly/MailDev)
if you need more understanding regarding each option.

Also, note that the following options can also be specified directly at task level:

- keepAlive
- onNewMail
- open

### http.address

Type: `string`
Default: `127.0.0.1`

The IP address the HTTP server will listen to.
Leave as is to restrict connections to local machine,
or set to '0.0.0.0' (or public IP address)
to accept connections from the outside world.

### http.password

Type: `string`  
Default: `null`

If set (in conjunction with http.user),
http server will require authentication using supplied name and password.

### http.port

Type: `number`  
Default: `1080`

The port for the webserver (to display emails received).

### http.user

Type: `string`  
Default: `null`

If set, http server will require authentication using supplied name and password.

### keepalive

Type: `boolean`  
Default: `false`

If true, keep the server alive indefinitely.
Any task specified after this will **not** run.

You do **not** want this if you have tests or watches set after this task! 

### onNewMail

Type: `function`  
Default: `null`

If specified, will be called each time a message is received by the server,
with the message passed as an argument.

See [here](https://github.com/djfarrelly/MailDev/blob/master/docs/rest.md#example-email-response)
for the fields of the supplied mail object.

### open

Type: `boolean`  
Default: `false`

If true, open a browser displaying the web server view.

### smtp.address

Type: `string`
Default: `127.0.0.1`

The IP address the SMTP server will listen to.
Leave as is to restrict connections to local machine,
or set to '0.0.0.0' (or public IP address)
to accept connections from the outside world (not recommended).

### smtp.password

Type: `string`  
Default: `null`

If set (in conjunction with smtp.user),
smtp server will require authentication using supplied name and password.

### smtp.port

Type: `number`  
Default: `1025`

The port for the SMTP server.

### smtp.relay

Type: `object`  
Default: `null`

Specifies if/how messages could be relayed to an actual SMTP server
([more explanations](https://github.com/djfarrelly/MailDev#outgoing-email)).

Authorized fields:

```javascript
smtp: {
  relay: {
    host: 'mail.yourdomain.com',
    port: 465,
    secure: true,
    user: 'your_user',
    pass: 'your secret password'
  },
}
```

### smtp.user

Type: `string`  
Default: `null`

If set, smtp server will require authentication using supplied name and password.


## Build, test, contribute
You need `git` and `node`

```
git clone https://github.com/xavierpriour/grunt-maildev.git
cd grunt-maildev
npm install
grunt
```

Thanks and enjoy!

##Changelog

###2.0

Features:

- updated to MailDev 0.11 and all its new options
- better options grouping

###1.0.1 (2015-04-17)

Features:

- Initial version

## Licence

MIT © [Xavier Priour](https://github.com/xavierpriour)
