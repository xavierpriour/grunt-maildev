'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('maildev', 'Start a MailDev SMTP server', function() {
    var MailDev = require('maildev');

    // standard this.options(default) does not provide deep merge,
    // we have to do it ourselves

    // 1. start with default
    var options = {
      smtp: {
        port: 1025,
        address: '127.0.0.1'
      },
      http: {
        port: 1080,
        address: '127.0.0.1'
      },
      open: false,
      keepAlive: false,
      onNewMail: null, // callback when new mail is received
      relay: null
    };
    // 2. add task-level options
    grunt.util._.merge(options, grunt.config([this.name, 'options']));
    // 3. add target-level options
    grunt.util._.merge(options, grunt.config([this.name, this.target, 'options']));
    // 4. add options that were defined outside an options block (convenience)
    if (this.data.onNewMail) {options.onNewMail = this.data.onNewMail;}
    if (this.data.keepAlive) {options.keepAlive = this.data.keepAlive;}
    if (this.data.open) {options.open = this.data.open;}

    if (options.onNewMail && (typeof options.onNewMail !== 'function')) {
      grunt.fatal('onNewMail must be a function(email)');
    }

    var config = {
      smtp: options.smtp.port,
      ip: options.smtp.address,
      web: options.http.port,
      webIp: options.http.address,
      open: options.open,
      verbose: grunt.option('verbose')
    };
    if (options.http.user) { config.webUser = options.http.user; }
    if (options.http.password) { config.webPass = options.http.password; }
    if (options.smtp.user) { config.incomingUser = options.smtp.user; }
    if (options.smtp.password) { config.incomingPass = options.smtp.password; }
    if (options.smtp.relay) {
      var r = options.smtp.relay;
      config.outgoingHost = r.host;
      config.outgoingPort = r.port;
      config.outgoingUser = r.user;
      config.outgoingPass = r.pass;
      config.outgoingSecure = r.secure;
      if (r.auto) {
        config.autoRelay = true;
        if ((typeof r.auto === 'string') || (Array.isArray(r.auto))) {
          config.autoRelayRules = r.auto;
        }
      }
    }
    // console.log(config);
    var done = this.async();
    var maildev = new MailDev(config);
    if (options.onNewMail) {
      maildev.on('new', options.onNewMail);
    }
    if (!options.keepAlive) {
      done(true);
    }
    maildev.listen();
  });
};
