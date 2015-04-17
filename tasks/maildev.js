'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('maildev', 'Start a MailDev SMTP server', function() {
    var MailDev = require('maildev');

    var options = this.options({
      smtpPort: 1025,
      httpPort: 1080,
      open: false,
      keepAlive: false,
      onNewMail: null, // callback when new mail is received
      relay: null
    });

    if (this.data.onNewMail) {options.onNewMail = this.data.onNewMail;}
    if (this.data.keepAlive) {options.keepAlive = this.data.keepAlive;}
    if (this.data.open) {options.open = this.data.open;}

    if (options.onNewMail && (typeof options.onNewMail !== 'function')) {
      grunt.fatal('onNewMail must be a function(email)');
    }

    var config = {
      smtp: options.smtpPort,
      web: options.httpPort,
      open: options.open,
      verbose: grunt.option('verbose')
    };
    if (options.relay) {
      var r = options.relay;
      config.outgoingHost = r.host;
      config.outgoingPort = r.port;
      config.outgoingUser = r.user;
      config.outgoingPass = r.pass;
      config.outgoingSecure = r.secure;
    }
    var done = this.async();
    var maildev = new MailDev(config);
    if (options.onNewMail) {
      maildev.on('new', options.onNewMail);
    }
    if (!options.keepAlive) {
      done(true);
    }
  });
};
