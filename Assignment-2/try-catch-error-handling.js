var fs = require('fs');


fs.readFile('does-not-exist', function(err, data) {
    try {
        if (err) {
            throw new Error(err);
        }
    } catch (err) {
        console.log("File does not exists: ", err);
    }

});


/*// THIS WILL NOT WORK:
var fs = require('fs');

try {
  fs.readFile('does-not-exist', function (err, data){
    // mistaken assumption: throwing here...
    if (err) {
      throw err;
    }
  });
} catch(err) {
  // This will not catch the throw!
  console.log(err);
}
*/
