var numberOfPeople = 400;

function avg(jiff, groups, vals) {
  // Compute Average
  var zero = jiff.share(0, null, ['s1', 1], ['s1', 1]);

  var averages = [];
  for (var i = 0; i < numberOfPeople; i++) {
    for (var g = 0; g < groups.length; g++) {
      if (averages[g] == null) averages[g] = [];

      var isG = groups[i][g];
      for (var v = 0; v < vals.length; v++) {
        if (averages[g][v] == null) averages[g][v] = zero;
        var val = vals[i][v];
        val = isG.if_else(val, 0);
        averages[g][v] = averages[g][v].sadd(val);
      }
    }
  }
  
  return averages;
}

async function open(jiff, obj) {
  for(var g = 0; g < 10; g++)
    for(var v = 11; v < 14; v++)
      obj[g][v] = await jiff.open(obj[g][v], ['s1', 1, 2]);

  return obj;
}

exports.compute = async function (jiff) {
  var groups = [];
  var vals = [];
  var squares = [];
  for (var i = 0; i < numberOfPeople; i++) {
    vals[i] = [];
    groups[i] = [];
    squares[i] = [];
    for (var j = 0;j < 3; j++) {
      var shares = jiff.share(null, null, ['s1', 1], [2]);
      vals[i].push(shares[2]);
    }
    for (;j < 6; j++) {
      var shares = jiff.share(null, null, ['s1', 1], [2]);
      squares[i].push(shares[2]);
    }
    for (; j < 16; j++) {
      var shares = jiff.share(null, null, ['s1', 1], [2]);
      groups[i].push(shares[2]);
    }
  }

  // count per group
  var zero = jiff.share(0, null, ['s1', 1], ['s1', 1]);
  var count = [];
  for (var i = 0; i < numberOfPeople; i++) {
    for (var g = 0; g < 10; g++) {
      if (count[g] == null) count[g] = zero;
      count[g] = count[g].sadd(groups[i][g]);
    }
  }  

  // compute average
  var averages = avg(jiff, groups, vals);
  var squaresAvg = avg(jiff, groups, squares);
  
  // open average
  averages = open(jiff, averages);
  squaresAvg = open(jiff, squaresAvg);
  count = open(jiff, count);
  
  var stdDeviation = [];
  for (var g = 0; g < 10; g++) {
    stdDeviation[g] = [];
    for (var v = 0; v < 3; v++) {
      averages[g][v] = averages[g][v] / count[g][v];
      stdDeviation[g][v] = squaresAvg[g][v] - Math.pow(averages[g][v], 2);
      stdDeviation[g][v] = stdDeviation[g][v] / count[g][v];
      stdDeviation[g][v] = Math.sqrt(stdDeviation[g][v]);
    }
  }

  // corelations
  
      

  
};
