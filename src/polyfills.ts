

var valuesPolyfill = function objectValues(obj: Object) {
  var res = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      res.push((obj as any)[i]);
    }
  }
  return res;
}
if(!(Object as any).values) { (Object as any).values = valuesPolyfill; } 