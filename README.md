# grunt-maildev
Grunt task to run a [MailDev](https://github.com/djfarrelly/MailDev)
mail server, to view and test emails during development.

## Install
You need node, npm, and grunt already installed.

```
npm install grunt-maildev --save-dev
```

## Usage

Start a server, keep it running and open a browser on the web view.

```javascript
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
  maildev: {
    run: {
      options: {
        open: true,
        keepAlive: true
      }
    }
  }
});

grunt.registerTask('default', ['maildev:run']);
```

Start a server and use it for your tests (logging all received emails to console),
then close everything.

```javascript
grunt.initConfig({
  maildev: {
    run: {
      onNewMail: function(email) {console.log(email);}
    }
  }
});

grunt.registerTask('test', ['maildev:run, test1, test2']);
```


## Options

Please refer to [MailDev](https://github.com/djfarrelly/MailDev)
to understand what options mean.

### smtpPort

Type: `number`  
Default: `1025`

The port on which you want to access the SMTP server.

### httpPort

Type: `number`  
Default: `1080`

The port on which you want to access the webserver that displays the emails received.

### open

Type: `boolean`
Default: `false`

Open a browser on the MailDev web server view when task is triggered.

### keepalive

Type: `boolean`  
Default: `false`

Keep the server alive indefinitely. Any task specified after this will not run.
You do **not** want this if you have tests or watches set after this task! 

### onNewMail

Type: `function`
Default: `null`

Will be called each time a message is received by the server,
with the message passed as an argument.

See [here](https://github.com/djfarrelly/MailDev/blob/master/docs/rest.md#example-email-response)
for the details of the mail argument.

### relay

Type: `object`  
Default: `null`

Specifies if/how messages could be relayed to an actual SMTP server
([more explanations](https://github.com/djfarrelly/MailDev#outgoing-email)).

Authorized fields:

```javascript
relay: {
  host: 'mail.yourdomain.com',
  port: 465,
  secure: true,
  user: 'your_user',
  pass: 'your secret password'
},
```


## Build, test, contribute
You need `git` and `node`

```
git clone https://github.com/xavierpriour/grunt-maildev.git
cd catchmail-node
npm install
grunt
```

Thanks and enjoy!