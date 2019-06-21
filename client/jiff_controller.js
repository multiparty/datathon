define(['mpc', 'pki', 'BigNumber', 'jiff', 'jiff_bignumber', 'jiff_restAPI', 'table_template'], function (mpc, pki, BigNumber, jiff, jiff_bignumber, jiff_restAPI, table_template) {
  jiff.dependencies({ io: jiff_restAPI.io });

  var cryptoHooks = {
    encryptSign: function (jiff, message, receiver_public_key) {
      // Analyst never encrypts anything
      if (jiff.id === 1) {
        return message;
      }

      // Submitters only encrypt analyst share
      if (receiver_public_key == null || receiver_public_key === '' || receiver_public_key === 's1') {
        return message;
      }

      return pki.encrypt(message, receiver_public_key);
    },
    decryptSign: function (jiff, cipher, secret_key, sender_public_key) {
      // Submitters never decrypt anything
      if (jiff.id !== 1) {
        return cipher;
      }

      // Analyst only decrypts shares from submitters
      if (sender_public_key === 's1') {
        // Do not decrypt messages from the server
        return cipher;
      }

      return pki.decrypt(cipher, secret_key);
    },
    parseKey: function (jiff, keyString) {
      // We really parse just one key, the analyst key
      if (keyString == null || keyString === '' || keyString === 's1') {
        return keyString;
      }

      return pki.parsePublicKey(keyString);
    },
    dumpKey: function (jiff, key) {
      // No one cares about the submitters keys, dump the empty defaults
      if (jiff.id !== 1) {
        return key;
      }

      // Analyst public key will never be dumped except by the analyst
      // do not return anything (undefined) so that the public key
      // is never modified.
    }
  };

  // initialize jiff instance
  var initialize = function (session, role, options) {
    var baseOptions = {
      autoConnect: false,
      sodium: false,
      hooks: {
        createSecretShare: [function (jiff, share) {
          share.refresh = function () {
            return share;
          };
          return share;
        }]
      },
      public_keys: {
        's1': 's1'
      }
    };
    baseOptions = Object.assign(baseOptions, options);
    baseOptions.hooks = Object.assign({}, baseOptions.hooks, cryptoHooks);
    var bigNumberOptions = { Zp: '618970019642690137449562111' }; // 2^89-1

    var restOptions = {
      flushInterval: 0,
      pollInterval: 0,
      maxBatchSize: 5000
    };

    var port = window.location.port === '8080' ? ':8080' : '';
    var instance = jiff.make_jiff(window.location.protocol + '//' + window.location.hostname + port, session, baseOptions);
    instance.apply_extension(jiff_bignumber, bigNumberOptions);
    instance.apply_extension(jiff_restAPI, restOptions);

    instance.connect(true);
    return instance;
  };

  // Client side stuff
  // TODO: add cohort here
  var clientSubmit = function (sessionkey, userkey, dataSubmission, callback, cohort) {
    var ordering = mpc.consistentOrdering(table_template);
    var values = [];

    // List values according to consistent ordering
    for (var i = 0; i < ordering.tables.length; i++) {
      var t = ordering.tables[i];
      values.push(Math.round(dataSubmission[t.table][t.row][t.col]));
    }
    for (var j = 0; j < ordering.questions.length; j++) {
      var q = ordering.questions[j];
      values.push(dataSubmission['questions'][q.question][q.option]);
    }

    for (var k = 0; k < ordering.usability.length; k++) {
      var m = ordering.usability[k].metric;
      var f = ordering.usability[k].field;

      if (f != null && f !== '') {
        values.push(dataSubmission.usability[m][f]);
      } else {
        values.push(dataSubmission.usability[m]);
      }
    }

    // Handle jiff errors returned from server
    var options = {
      onError: function (errorString) {
        callback(null, JSON.stringify({ status: false, error: errorString }));
      },
      initialization: {
        userkey: userkey,
        cohort: cohort
      }
    };

/*
[ Region, Pooled Age Group, Follow up status, Time till death (months), Time since diagnosis (months), Time since metastatic disease, Time between initial diagnosis to metastatic diagnosis, Pooled Number of metastatic diagnosis, Death flag, Actual Treatment ]
 */
    // Initialize and submit
    var jiff = initialize(sessionkey, 'client', options);
    jiff.wait_for([1, 's1'], function () {
      // After initialization
      jiff.restReceive = function () {
        jiff.disconnect(false, false);
        callback.apply(null, arguments);
      };
      // Group by *Disease, *Age-group >> sum these values (aggregate by), submit/share sums
      // Square individual data, sum and submit
      var disease = {};
      var age_group = {};
      for (var k = 0; k < uploadedFile.length; k++) {

      }
      for (var i = 0; i < values.length; i++) {
        jiff.share(values[i], null, [1, 's1'], [jiff.id]);
        // Share the square of the input for standard deviation: only for tables, but not for questions
        if (i < ordering.tables.length) {
          jiff.share(new BigNumber(values[i]).pow(2), null, [1, 's1'], [jiff.id]);
        }
      }
      //group by region
      var age_group = {};
      var treatment = {};
      var AGE_GROUP_INDEX = 0;
      var TREATMENT_INDEX = 1;
      var T_TIL_DEATH_INDEX = 2;
      var T_SINCE_DGNS_INDEX = 3;
      var T_SINCE_METDIS_INDEX = 4;
      var DEATH_FLAG_INDEX= 5;
      /*for(var i = 0; i < patient_data.length; i++) {
      if(patient_data[i][REGION_INDEX] in region){
        region['key_1'][key_1] = patient_data[i][KEY_1_INDEX];
        region['key_2'][key_2] = patient_data[i][KEY_2_INDEX];
        region['key_3'][key_3] = patient_data[i][KEY_3_INDEX];
      }
    }*/
      // secret share individual patient data
      for(var i = 0; i < patient_data.length; i++) {
        if(patient_data[i][DEATH_FLAG_INDEX] == 'Y') {
          var til_death = patient_data[i][T_TIL_DEATH_INDEX];
          var since_diagnosis = patient_data[i][T_SINCE_DGNS_INDEX];
          var since_metastatic = patient_data[i][T_SINCE_METDIS_INDEX];
          jiff.share(til_death, null, [1, 's1'], [jiff.id]);
          jiff.share(since_diagnosis, null, [1, 's1'], [jiff.id]);
          jiff.share(since_metastatic, null, [1, 's1'], [jiff.id]);

          jiff.share(til_death * til_death, null, [1, 's1'], [jiff.id]);
          jiff.share(since_diagnosis * since_diagnosis, null, [1, 's1'], [jiff.id]);
          jiff.share(since_metastatic * since_metastatic, null, [1, 's1'], [jiff.id]);

          //age group
          for (var k = 0; k < 6; k++) {
            // treatment
            for (var j = 0; j < 2; j++) {
              var age_range = Math.floor(patient_data[i][AGE_GROUP_INDEX]);
              var treatment = patient_data[i][TREATMENT_INDEX];
              var bit = 0;
              if (age_range == k) {
                if (treatment == j) {
                  bit = 1;
                }
              }
              jiff.share(bit, null, [1, 's1'], [jiff.id]);
            }
          }
      }

      jiff.restFlush();
    });
  };

  // Analyst side stuff
 /* var computeAndFormat = function (sessionkey, password, secretkey, error, callback) {
    var options = {
      onError: error,
      secret_key: pki.parsePrivateKey(secretkey),
      party_id: 1,
      initialization: {
        password: password
      }
    };

    // Initialize
    var jiff = initialize(sessionkey, 'analyst', options);
    // Listen to the submitter ids from server
    jiff.listen('compute', function (party_id, msg) {
      if (party_id !== 's1') {
        return;
      }

      // Meta-info
      var ordering = mpc.consistentOrdering(table_template);
      var submitters = JSON.parse(msg);

      // Compute and Format
      var promise = mpc.compute(jiff, submitters, ordering);
      promise.then(function (result) {
        jiff.disconnect(false, false);
        callback(mpc.format(result, submitters, ordering));
      }).catch(function (err) {
        error(err.toString());
      });
    });
  };*/

  // Exports
  return {
    client: {
      submit: clientSubmit
    },
    analyst: {
      computeAndFormat: computeAndFormat
    }
  }
});
